import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pengaturan standar Next.js 16 Anda
};

export default withSentryConfig(nextConfig, {
  org: "jlpt-saas",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",

  /* SOLUSI PAMUNGKAS: Mematikan instrumentasi otomatis Sentry pada Middleware & Server */
  // Ini akan menghentikan Sentry memodifikasi bundle server yang memicu error hantu nft.json
  autoInstrumentMiddleware: false,
  autoInstrumentServerFunctions: false, 
  
  excludeServerRoutes: [
    /middleware/,
    /security/,
    /sentry-tunnel/
  ],
});
