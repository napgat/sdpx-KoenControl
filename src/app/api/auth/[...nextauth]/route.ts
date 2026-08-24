import { handlers } from "@/lib/auth";

// Route Handler สำหรับ GET และ POST ที่ NextAuth ต้องการ
// ครอบคลุม: /api/auth/signin, /api/auth/callback/google, /api/auth/signout ฯลฯ
export const { GET, POST } = handlers;
