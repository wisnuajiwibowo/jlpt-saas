"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Question { id: string; jlpt_level: string; module_type: string; question_text: string; option_a: string; option_b: string; option_c: string; option_d: string; correct_option: string; explanation: string; }
interface StudyItem { id: string; jlpt_level: string; module_type: string; title: string; content_body: string; example_sentence: string; quiz_question: string; quiz_opt_a: string; quiz_opt_b: string; quiz_correct: string; quiz_explanation: string; }

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [activeTab, setActiveTab] = useState<"quiz" | "study">("quiz")
  const [questions, setQuestions] = useState<Question[]>([])
  const [studyItems, setStudyItems] = useState<StudyItem[]>([])
  const [loading, setLoading] = useState(true)

  // Form States
  const [level, setLevel] = useState("N5"); const [type, setType] = useState("grammar")
  const [qText, setQText] = useState(""); const [a, setA] = useState(""); const [b, setB] = useState(""); const [c, setC] = useState(""); const [d, setD] = useState("")
  const [correct, setCorrect] = useState("A"); const [qExp, setQExp] = useState("")

  const [sTitle, setSTitle] = useState(""); const [sBody, setSBody] = useState(""); const [sExample, setSExample] = useState("")
  const [sQuizQ, setSQuizQ] = useState(""); const [sQuizA, setSQuizA] = useState(""); const [sQuizB, setSQuizB] = useState("")
  const [sQuizCorrect, setSQuizCorrect] = useState("A"); const [sQuizExp, setSQuizExp] = useState("")

  useEffect(() => {
    async function checkAccess() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email === "wisnuajisyafiq@gmail.com") {
        setIsAuthorized(true); refreshData()
      } else {
        alert("🔒 Akses Ditolak!"); router.push("/dashboard")
      }
    }
    checkAccess()
  }, [])

  async function refreshData() {
    setLoading(true)
    try {
      const [rq, rs] = await Promise.all([fetch("/api/admin/questions"), fetch("/api/admin/study")])
      if (rq.ok) setQuestions(await rq.json())
      if (rs.ok) setStudyItems(await rs.json())
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault()
    if (!qText || !a || !b || !c || !d) return alert("Lengkapi data soal!")
    const res = await fetch("/api/admin/questions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jlpt_level: level, module_type: type, question_text: qText, option_a: a, option_b: b, option_c: c, option_d: d, correct_option: correct, explanation: qExp })
    })
    if (res.ok) { alert("🎉 Soal ditambahkan!"); setQText(""); setA(""); setB(""); setC(""); setD(""); setQExp(""); refreshData() }
  }

  async function handleAddStudy(e: React.FormEvent) {
    e.preventDefault()
    if (!sTitle || !sBody || !sExample || !sQuizQ || !sQuizA || !sQuizB) return alert("Lengkapi data materi!")
    const res = await fetch("/api/admin/study", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jlpt_level: level, module_type: type, title: sTitle, content_body: sBody, example_sentence: sExample, quiz_question: sQuizQ, quiz_opt_a: sQuizA, quiz_opt_b: sQuizB, quiz_correct: sQuizCorrect, quiz_explanation: sQuizExp })
    })
    if (res.ok) { alert("🎉 Materi disimpan!"); setSTitle(""); setSBody(""); setSExample(""); setSQuizQ(""); setSQuizA(""); setSQuizB(""); setSQuizExp(""); refreshData() }
  }

  if (!isAuthorized) return <div className="p-6 text-center text-xs animate-pulse">Memverifikasi Akses...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans text-xs">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800">🎌 Pusat Kontrol DaijiNihongo</h1>
          <p className="text-slate-500">Kelola kuis ujian dan materi pembelajaran mandiri.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border">
          <Button variant={activeTab === "quiz" ? "default" : "ghost"} size="sm" className="h-8 text-xs" onClick={() => setActiveTab("quiz")}>✍️ Soal</Button>
          <Button variant={activeTab === "study" ? "default" : "ghost"} size="sm" className="h-8 text-xs" onClick={() => setActiveTab("study")}>📖 Materi</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border">
        <div><Label>Level</Label><select className="w-full mt-1 p-2 rounded-lg border" value={level} onChange={(e) => setLevel(e.target.value)}>{["N5","N4","N3","N2","N1"].map(l => <option key={l} value={l}>{l}</option>)}</select></div>
        <div><Label>Modul</Label><select className="w-full mt-1 p-2 rounded-lg border" value={type} onChange={(e) => setType(e.target.value)}>{["grammar","kanji","vocab","reading"].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
      </div>

      {activeTab === "quiz" ? (
        <form onSubmit={handleAddQuestion} className="space-y-4 bg-white p-4 rounded-xl border">
          <Input placeholder="Pertanyaan Utama" value={qText} onChange={(e) => setQText(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Opsi A" value={a} onChange={(e) => setA(e.target.value)} />
            <Input placeholder="Opsi B" value={b} onChange={(e) => setB(e.target.value)} />
            <Input placeholder="Opsi C" value={c} onChange={(e) => setC(e.target.value)} />
            <Input placeholder="Opsi D" value={d} onChange={(e) => setD(e.target.value)} />
          </div>
          <div><Label>Kunci Jawaban</Label><select className="w-full mt-1 p-2 rounded-lg border" value={correct} onChange={(e) => setCorrect(e.target.value)}>{["A","B","C","D"].map(o => <option key={o} value={o}>Opsi {o}</option>)}</select></div>
          <textarea className="w-full p-2 border rounded-lg h-16" placeholder="Pembahasan Gaya Shin Kanzen" value={qExp} onChange={(e) => setQExp(e.target.value)} />
          <Button type="submit" className="w-full bg-[#4f46e5] text-white">Suntik Soal ke Supabase</Button>
        </form>
      ) : (
        <form onSubmit={handleAddStudy} className="space-y-4 bg-white p-4 rounded-xl border">
          <Input placeholder="Judul Materi (Misal: Pola Kalimat ~Tsubomi)" value={sTitle} onChange={(e) => setSTitle(e.target.value)} />
          <textarea className="w-full p-2 border rounded-lg h-20" placeholder="Isi Teori Penjelasan Materi" value={sBody} onChange={(e) => setSBody(e.target.value)} />
          <Input placeholder="Kalimat Contoh (例文)" value={sExample} onChange={(e) => setSExample(e.target.value)} />
          <Input placeholder="Pertanyaan Flash Quiz Pemahaman" value={sQuizQ} onChange={(e) => setSQuizQ(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Pilihan Flash A" value={sQuizA} onChange={(e) => setSQuizA(e.target.value)} />
            <Input placeholder="Pilihan Flash B" value={sQuizB} onChange={(e) => setSQuizB(e.target.value)} />
          </div>
          <div><Label>Kunci Flash Quiz</Label><select className="w-full mt-1 p-2 rounded-lg border" value={sQuizCorrect} onChange={(e) => setSQuizCorrect(e.target.value)}><option value="A">Opsi A</option><option value="B">Opsi B</option></select></div>
          <textarea className="w-full p-2 border rounded-lg h-16" placeholder="Penjelasan Jawaban Flash Quiz" value={sQuizExp} onChange={(e) => setSQuizExp(e.target.value)} />
          <Button type="submit" className="w-full bg-[#4f46e5] text-white">Simpan Materi ke Supabase</Button>
        </form>
      )}

      <Card className="p-4 bg-white rounded-xl border">
        <h3 className="font-bold mb-2">Item Aktif di Database ({activeTab === "quiz" ? questions.length : studyItems.length})</h3>
        {loading ? <div className="text-center py-4">Memuat...</div> : (
          <div className="max-h-48 overflow-y-auto border rounded-lg divide-y">
            {activeTab === "quiz" ? questions.map(q => (
              <div key={q.id} className="p-2 flex justify-between items-center">
                <span>[{q.jlpt_level}-{q.module_type}] {q.question_text}</span>
                <Button variant="destructive" size="sm" className="h-6 text-[10px]" onClick={async () => { if(confirm("Hapus?")) { await fetch(`/api/admin/questions?id=${id}`, {method:"DELETE"}); refreshData() } }}>Hapus</Button>
              </div>
            )) : studyItems.map(s => (
              <div key={s.id} className="p-2 flex justify-between items-center">
                <span>[{s.jlpt_level}-{s.module_type}] {s.title}</span>
                <Button variant="destructive" size="sm" className="h-6 text-[10px]" onClick={async () => { if(confirm("Hapus?")) { await fetch(`/api/admin/study?id=${id}`, {method:"DELETE"}); refreshData() } }}>Hapus</Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
