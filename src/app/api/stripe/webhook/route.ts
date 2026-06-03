import { stripe, PLANS } from "@/lib/stripe/client"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"
import Stripe from "stripe"

// Tambahkan ini agar lolos dari kompilasi statis Next.js
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata!.user_id
      const plan = session.metadata!.plan as keyof typeof PLANS

      await supabaseAdmin.from("subscriptions").update({
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        plan_tier: plan,
        status: "active",
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }).eq("user_id", userId)

      await supabaseAdmin.from("users").update({
        ai_tokens_used: 0,
        ai_tokens_quota: PLANS[plan].tokens,
      }).eq("id", userId)
      break
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as any
      if (invoice.subscription) {
        const sub = await stripe.subscriptions.retrieve(invoice.subscription as string)
        await supabaseAdmin.from("users").update({ ai_tokens_used: 0 })
          .eq("id", (sub.metadata as any).user_id)
      }
      break
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription
      await supabaseAdmin.from("subscriptions")
        .update({ status: "canceled", plan_tier: "free" })
        .eq("stripe_subscription_id", sub.id)
      await supabaseAdmin.from("users")
        .update({ ai_tokens_quota: PLANS.free.tokens })
        .eq("id", sub.metadata.user_id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
