// ขยาย TypeScript types ของ Auth.js เพื่อรองรับ custom fields
import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      platformRole: string;
      canCreateClassroom: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId?: string;
    platformRole?: string;
    canCreateClassroom?: boolean;
  }
}
