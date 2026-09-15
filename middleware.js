// middleware.js
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/properties/add", "/profile", "/properties/saved", "/messages"],
};