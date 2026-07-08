import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login"
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/agents/:path*",
    "/channels/:path*",
    "/chat/:path*",
    "/contacts/:path*",
    "/team/:path*",
    "/more/:path*",
    "/settings/:path*",
    "/billing/:path*",
    "/api-keys/:path*",
    "/knowledge-base/:path*",
    "/templates/:path*",
    "/labels/:path*",
    "/appointments/:path*"
  ]
};
