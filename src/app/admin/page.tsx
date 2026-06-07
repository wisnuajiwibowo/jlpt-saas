"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Question {
  id: string; jlpt_level: string; module_type: string; question_text: string
  option_a: string; option_b: string; option_c: string; option_d: string
  correct_option: string; explanation: string
}
interface StudyItem {
  id: string; jlpt_level: string; module_type: string; title: string
  content_body: string; example_sentence: string; quiz_question: string
  quiz_opt_a: string; quiz_opt_b: string; quiz_correct: string; quiz_explanation: string
}

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [activeTab, setActiveTab] = useState<"quiz" | "study">("quiz")
  const [questions, setQuestions] = useState<Question[]>([])
  const [studyItems, setStudyItems] = useState<StudyItem[]>([])
  const [loading, setLoading] = useState(true)

  const [level, setLevel] = useState("N5")
  const [type, setType] = useState("grammar")
  const [qText, setQText] = useState("")
  const [a, setA] = useState("")
  const [b, setB] = useState("")
  const [c, setC] = useState("")
  const [d, setD] = useState("")
  const [correct, setCorrect] = useState("A")
  const [qExp, setQExp] = useState("")

  const [sTitle, setSTitle] = useState("")
  const [sBody, setSBody] = useState("")
  const [sExample, setSExample] = useState("")
  const [sQuizQ, setSQuizQ] = useState("")
  const [sQuizA, setSQuizA] = useState("")
  const [sQuizB, setSQuizB] = useState("")
  const [sQuizCorrect, setSQuizCorrect] = useState("A")
  const [sQuizExp, setSQuizExp] = useState("")

  useEffect(() => {
    async function checkAccess() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email === "wisnuajisyafiq@gmail.com") {
        setIsAuthorized(true)
        refreshData()
      } else {
        alert("🔒 Akses Ditolak!")
        router.push("/dashboard")
      }
    }
    checkAccess()
  }, [])

  async function refreshData() {
    setLoading(true)
    try {
      const [rq, rs] = await Promise.all([
        fetch("/api/admin/questions", { cache: "no-store" }),
        fetch("/api/admin/study", { cache: "no-store" })
      ])
      if (rq.ok) setQuestions(await rq.json())
      if (rs.ok) setStudyItems(await rs.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault()
    if (!qText || !a || !b || !c || !d) return alert("Lengkapi data soal!")
    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jlpt_level: level, module_type: type, question_text: qText,
        option_a: a, option_b: b, option_c: c, option_d: d,
        correct_option: correct, explanation: qExp
      })
    })
    if (res.ok) {
      alert("🎉 Soal ditambahkan!")
      setQText(""); setA(""); setB(""); setC(""); setD(""); setQExp("")
      refreshData()
    }
  }

  async function handleDeleteQuestion(id: string) {
    if (!confirm("Hapus soal ini?")) return
    const res = await fetch(`/api/admin/questions?id=${id}`, { method: "DELETE" })
    if (res.ok) { alert("🗑️ Soal terhapus!"); refreshData() }
  }

  async function handleAddStudy(e: React.FormEvent) {
    e.preventDefault()
    if (!sTitle || !sBody || !sExample || !sQuizQ || !sQuizA || !sQuizB) return alert("Lengkapi data materi!")
    const res = await fetch("/api/admin/study", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jlpt_level: level, module_type: type, title: sTitle,
        content_body: sBody, example_sentence: sExample,
        quiz_question: sQuizQ, quiz_opt_a: sQuizA, quiz_opt_b: sQuizB,
        quiz_correct: sQuizCorrect, quiz_explanation: sQuizExp
      })
    })
    if (res.ok) {
      alert("🎉 Materi disimpan!")
      setSTitle(""); setSBody(""); setSExample(""); setSQuizQ(""); setSQuizA(""); setSQuizB(""); setSQuizExp("")
      refreshData()
    }
  }

  async function handleDeleteStudy(id: string) {
    if (!confirm("Hapus materi ini?")) return
    const res = await fetch(`/api/admin/study?id=${id}`, { method: "DELETE" })
    if (res.ok) { alert("🗑️ Materi terhapus!"); refreshData() }
  }

  if (!isAuthorized) {
    return <div className="p-6 text-center text-xs animate-pulse">Memverifikasi Akses...</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans text-xs">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800">🎌 Pusat Kontrol DaijiNihongo</h1>
          <p className="text-slate-500">Kelola kuis ujian dan materi pembelajaran mandiri.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border">
          <Button
            variant={activeTab === "quiz" ? "default" : "ghost"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setActiveTab("quiz")}
          >
            ✍️ Soal
          </Button>
          <Button
            variant={activeTab === "study" ? "default" : "ghost"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setActiveTab("study")}
          >
            📖 Materi
          </Button>
        </div>
      </div>

      {/* SELECTOR LEVEL & MODUL */}
      <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border">
        <div>
          <Label>Level</Label>
          <select className="w-full mt-1 p-2 rounded-lg border" value={level} onChange={(e) => setLevel(e.target.value)}>
            {["N5","N4","N3","N2","N1"].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <Label>Modul</Label>
          <select className="w-full mt-1 p-2 rounded-lg border" value={type} onChange={(e) => setType(e.target.value)}>
            {["grammar","kanji","vocab","reading"].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* FORM TAB QUIZ */}
      {activeTab === "quiz" && (
        <form onSubmit={handleAddQuestion} className="space-y-4 bg-white p-4 rounded-xl border">
          <div>
            <Label>Pertanyaan Utama</Label>
            <Input className="mt-1" placeholder="Tulis soal di sini..." value={qText} onChange={(e) => setQText(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Opsi A</Label><Input className="mt-1" value={a} onChange={(e) => setA(e.target.value)} /></div>
            <div><Label>Opsi B</Label><Input className="mt-1" value={b} onChange={(e) => setB(e.target.value)} /></div>
            <div><Label>Opsi C</Label><Input className="mt-1" value={c} onChange={(e) => setC(e.target.value)} /></div>
            <div><Label>Opsi D</Label><Input className="mt-1" value={d} onChange={(e) => setD(e.target.value)} /></div>
          </div>
          <div>
            <Label>Kunci Jawaban</Label>
            <select className="w-full mt-1 p-2 rounded-lg border" value={correct} onChange={(e) => setCorrect(e.target.value)}>
              {["A","B","C","D"].map(o => <option key={o} value={o}>Opsi {o}</option>)}
            </select>
          </div>
          <div>
            <Label>Pembahasan</Label>
            <textarea className="w-full mt-1 p-2 border rounded-lg h-16 bg-white text-slate-800" placeholder="Jelaskan mengapa jawaban ini benar..." value={qExp} onChange={(e) => setQExp(e.target.value)} />
          </div>
          <Button type="submit" className="w-full bg-[#4f46e5] text-white">Suntik Soal ke Supabase</Button>
        </form>
      )}

      {/* FORM TAB STUDY */}
      {activeTab === "study" && (
        <form onSubmit={handleAddStudy} className="space-y-4 bg-white p-4 rounded-xl border">
          <div>
            <Label>Judul Materi</Label>
            <Input className="mt-1" placeholder="Misal: Pola Kalimat 〜てしまう" value={sTitle} onChange={(e) => setSTitle(e.target.value)} />
          </div>
          <div>
            <Label>Isi Teori / Penjelasan</Label>
            <textarea className="w-full mt-1 p-2 border rounded-lg h-20 bg-white text-slate-800" placeholder="Tulis penjelasan lengkap materi di sini..." value={sBody} onChange={(e) => setSBody(e.target.value)} />
          </div>
          <div>
            <Label>Kalimat Contoh (例文)</Label>
            <Input className="mt-1" placeholder="cth: 財布を忘れてしまった。" value={sExample} onChange={(e) => setSExample(e.target.value)} />
          </div>
          <div className="border border-dashed border-slate-300 rounded-xl p-4 space-y-3 bg-slate-50">
            <p className="font-bold text-slate-500 uppercase tracking-widest">⚡ Flash Mini-Kuis</p>
            <div>
              <Label>Pertanyaan Kuis</Label>
              <Input className="mt-1" placeholder="Tulis pertanyaan singkat..." value={sQuizQ} onChange={(e) => setSQuizQ(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Opsi A</Label><Input className="mt-1" value={sQuizA} onChange={(e) => setSQuizA(e.target.value)} /></div>
              <div><Label>Opsi B</Label><Input className="mt-1" value={sQuizB} onChange={(e) => setSQuizB(e.target.value)} /></div>
            </div>
            <div>
              <Label>Jawaban Benar</Label>
              <select className="w-full mt-1 p-2 rounded-lg border bg-white" value={sQuizCorrect} onChange={(e) => setSQuizCorrect(e.target.value)}>
                <option value="A">Opsi A</option>
                <option value="B">Opsi B</option>
              </select>
            </div>
            <div>
              <Label>Penjelasan Jawaban (Opsional)</Label>
              <textarea className="w-full mt-1 p-2 border rounded-lg h-16 bg-white text-slate-800" placeholder="Mengapa jawaban ini benar?" value={sQuizExp} onChange={(e) => setSQuizExp(e.target.value)} />
            </div>
          </div>
          <Button type="submit" className="w-full bg-[#4f46e5] text-white">Simpan Materi ke Supabase</Button>
        </form>
      )}

      {/* DAFTAR ITEM AKTIF */}
      <Card className="bg-white rounded-xl border shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold">
            Item Aktif di Database ({activeTab === "quiz" ? questions.length : studyItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {loading ? (
            <div className="text-center py-4 text-slate-400 animate-pulse">Memuat...</div>
          ) : (
            <div className="max-h-64 overflow-y-auto border rounded-lg divide-y">
              {activeTab === "quiz" ? (
                questions.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">Belum ada soal.</div>
                ) : questions.map(q => (
                  <div key={q.id} className="p-2 flex justify-between items-center gap-2">
                    <span className="truncate flex-1">
                      <span className="font-bold text-[#4f46e5] mr-1">[{q.jlpt_level}-{q.module_type.toUpperCase()}]</span>
                      {q.question_text}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-6 text-[10px] shrink-0"
                      onClick={() => handleDeleteQuestion(q.id)}
                    >
                      Hapus
                    </Button>
                  </div>
                ))
              ) : (
                studyItems.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">Belum ada materi.</div>
                ) : studyItems.map(s => (
                  <div key={s.id} className="p-2 flex justify-between items-center gap-2">
                    <span className="truncate flex-1">
                      <span className="font-bold text-[#4f46e5] mr-1">[{s.jlpt_level}-{s.module_type.toUpperCase()}]</span>
                      {s.title}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-6 text-[10px] shrink-0"
                      onClick={() => handleDeleteStudy(s.id)}
                    >
                      Hapus
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
