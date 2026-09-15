// lib/auth.config.js
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute = [
        "/properties/add",
        "/profile",
        "/properties/saved",
        "/messages",
      ].some((path) => nextUrl.pathname.startsWith(path));

      if (isOnProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
  },
  providers: [], // Add an empty array; the full providers are in auth.js
};