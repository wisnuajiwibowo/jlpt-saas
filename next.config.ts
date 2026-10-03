import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* PERBAIKAN UTAMA: Mematikan total Turbopack khusus untuk sesi kompilasi Vercel */
  experimental: {
    // Memaksa penonaktifan Turbopack agar Sentry Plugin dan Manifest NFT Webpack sinkron sempurna
    turbo: false as any, 
  },
};

export default withSentryConfig(nextConfig, {
  // Lokasi organisasi dan nama proyek Anda di dashboard Sentry
  org: "jlpt-saas",
  project: "javascript-nextjs",

  // Menyembunyikan log upload source maps kecuali di server integrasi (CI)
  silent: !process.env.CI,

  // Mengunggah source maps lengkap agar stack trace error di Sentry terbaca rapi
  widenClientFileUpload: true,

  // Mengalihkan request browser Sentry ke route lokal agar tidak diblokir ad-blocker iklan
  tunnelRoute: "/monitoring",

  webpack: {
    // Instrumentasi otomatis untuk memantau Vercel Cron Jobs jika ada
    automaticVercelMonitors: true,

    // Fitur optimasi ukuran file bundel (Tree-shaking)
    treeshake: {
      // Menghapus log debugging Sentry yang tidak perlu di lingkungan produksi
      removeDebugLogging: true,
    },
  }
});
