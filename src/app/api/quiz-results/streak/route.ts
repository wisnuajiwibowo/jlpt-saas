import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from("user_streaks")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (error) return NextResponse.json({ current_streak: 0, longest_streak: 0, total_sessions: 0 })
  return NextResponse.json(data)
}
