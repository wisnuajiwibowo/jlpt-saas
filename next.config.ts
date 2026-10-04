import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Matikan fitur eksperimental turbo secara mutlak di level config
  experimental: {
    turbo: false as any,
  },
};

export default withSentryConfig(nextConfig, {
  org: "jlpt-saas",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",

  // PERBAIKAN MUTLAK: Paksa Sentry untuk tidak menyentuh atau membuat file pelacak (*trace*) pada fungsi middleware
  excludeServerRoutes: [
    /middleware/,
    /security/,
    /sentry-tunnel/
  ],
});
