import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;

  const isLoggedIn = !!session;

  // เส้นทางที่ต้องการ Authentication
  const protectedPaths = ["/dashboard", "/classroom", "/evaluation"];
  const isProtected = protectedPaths.some((path) =>
    nextUrl.pathname.startsWith(path)
  );

  // ถ้าไม่ได้ล็อกอินและพยายามเข้าหน้า protected → redirect ไปหน้า signin
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", nextUrl));
  }

  // ถ้าล็อกอินแล้วและพยายามเข้าหน้า signin → redirect ไป dashboard
  if (isLoggedIn && nextUrl.pathname.startsWith("/auth/signin")) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // เว้นไฟล์ static และ API auth routes
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
