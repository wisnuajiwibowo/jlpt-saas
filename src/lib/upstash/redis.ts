import { Redis } from "@upstash/redis"

// Menggunakan kata sandi cadangan dummy agar build Vercel meluncur sukses jika env di server belum diisi penuh
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "https://upstash.io",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "dummy_token_for_passing_build_pipeline",
})
