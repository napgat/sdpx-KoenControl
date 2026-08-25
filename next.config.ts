import type { NextConfig } from "next";

const nextConfig = {
  // ปิด Turbopack เพราะมีบั๊กกับ Unicode characters ใน path (ภาษาไทย)
  // จะใช้ Webpack แทน ซึ่ง handle path ได้ถูกต้อง
};

export default nextConfig;
