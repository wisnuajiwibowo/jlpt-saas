import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
})

export const PLANS = {
  free:     { name: "Free",     tokens: 20_000,    priceId: null },
  pro:      { name: "Pro",      tokens: 500_000,   priceId: "price_XXXXX_pro" },
  n1_elite: { name: "N1 Elite", tokens: 2_000_000, priceId: "price_XXXXX_elite" },
} as const

export type PlanKey = keyof typeof PLANS
