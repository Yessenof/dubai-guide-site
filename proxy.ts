import { withAuth } from "next-auth/middleware";

// Protects all /admin/* routes except /admin/login.
// Unauthenticated requests are redirected to /admin/login.
export default withAuth({
  pages: { signIn: "/admin/login" },
});

export const config = {
  matcher: ["/admin/guides", "/admin/guides/:path*"],
};
