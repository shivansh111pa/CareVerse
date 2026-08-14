import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  
  console.log("Middleware URL:", request.nextUrl.pathname);
  
  return response;
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/auth/:path*",
  ],
};
