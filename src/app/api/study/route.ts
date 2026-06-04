import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const level = searchParams.get("level") || "N3"
  const type = searchParams.get("type") || "grammar"

  const { data, error } = await supabase
    .from("jlpt_study_modules")
    .select("*")
    .eq("jlpt_level", level)
    .eq("module_type", type)
    .order("created_at", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
