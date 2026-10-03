import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Konfigurasi standar Next.js 16 Anda
};

export default withSentryConfig(nextConfig, {
  org: "jlpt-saas",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",

  /* PERBAIKAN UTAMA: Mematikan pembuatan otomatis file pelacak NFT oleh Sentry Plugin */
  // Ini akan menghentikan pencarian berkas hantu middleware.js.nft.json secara permanen di Vercel
  excludeServerRoutes: [
    /middleware/,
    /sentry-tunnel/
  ],
});
