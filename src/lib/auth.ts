// Re-export จาก root auth.ts ผ่าน @/ alias
// วิธีนี้ทำให้ Turbopack/Webpack สามารถ resolve ได้อย่างถูกต้อง
export { handlers, signIn, signOut, auth } from "../../auth";
