import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

// Domain ที่อนุญาตให้ล็อกอิน (ตาม Out-of-Scope ใน intent.md)
// ตั้งค่าใน env: ALLOWED_EMAIL_DOMAIN=kmitl.ac.th
// ถ้าไม่ตั้งค่า จะรับทุก domain (สำหรับช่วง dev)
const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 12 ชั่วโมง ตาม technical-design.md
  },

  callbacks: {
    async signIn({ user, account }) {
      // ตรวจสอบว่า email_verified = true จาก Google
      if (account?.provider !== "google") return false;
      if (!user.email) return false;

      // Normalize email: trim + lowercase ตาม 04-technical-design.md ข้อ 3
      const emailLookup = user.email.trim().toLowerCase();

      // ตรวจสอบ domain (ถ้ากำหนดไว้)
      if (ALLOWED_DOMAIN && !emailLookup.endsWith(`@${ALLOWED_DOMAIN}`)) {
        return `/auth/error?error=DomainNotAllowed`;
      }

      // หา user ในระบบ
      let existingUser = await prisma.user.findUnique({
        where: { email_lookup: emailLookup },
      });

      // --- Bootstrapping: สำหรับการล็อกอินครั้งแรกสุดของระบบ ---
      // ถ้ายังไม่มี User ใดๆ ในฐานข้อมูลเลย ให้ดึงคนแรกที่ล็อกอินมาเป็น SYSTEM_ADMIN อัตโนมัติ
      if (!existingUser) {
        const userCount = await prisma.user.count();
        if (userCount === 0) {
          existingUser = await prisma.user.create({
            data: {
              email_lookup: emailLookup,
              email_raw: user.email,
              display_name: user.name || user.email.split("@")[0],
              platform_role: "SYSTEM_ADMIN",
              can_create_classroom: true,
              status: "ACTIVE",
            }
          });
        } else {
          // ถ้ามี user ในระบบแล้ว แต่คนนี้ไม่มีใน roster → ปฏิเสธ (ต้องให้ Admin/Teacher แอดเข้า CSV ก่อน)
          return `/auth/error?error=NotInRoster`;
        }
      }

      // อัปเดต google_sub ในครั้งแรกที่ล็อกอิน
      if (!existingUser.google_sub && account.providerAccountId) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            google_sub: account.providerAccountId,
            status: "ACTIVE",
            last_login_at: new Date(),
          },
        });
      } else {
        // อัปเดต last_login_at
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { last_login_at: new Date() },
        });
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (account && user?.email) {
        const emailLookup = user.email.trim().toLowerCase();
        const dbUser = await prisma.user.findUnique({
          where: { email_lookup: emailLookup },
        });
        if (dbUser) {
          token.userId = dbUser.id;
          token.platformRole = dbUser.platform_role;
          token.canCreateClassroom = dbUser.can_create_classroom;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string;
        session.user.platformRole = token.platformRole as string;
        session.user.canCreateClassroom = token.canCreateClassroom as boolean;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});
