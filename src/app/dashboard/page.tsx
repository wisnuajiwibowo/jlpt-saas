import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("*, subscriptions(*)")
    .eq("id", user.id)
    .single()

  const tokenPct = Math.round(((profile?.ai_tokens_used || 0) / (profile?.ai_tokens_quota || 20000)) * 100)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">AI Token</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-medium">
              {(profile?.ai_tokens_used || 0).toLocaleString()} / {(profile?.ai_tokens_quota || 20000).toLocaleString()}
            </p>
            <Progress value={tokenPct} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Plan</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-medium capitalize">
              {profile?.subscriptions?.[0]?.plan_tier || "Free"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
