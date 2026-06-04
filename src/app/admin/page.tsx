"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Question {
  id: string
  jlpt_level: string
  module_type: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: string
  explanation: string
}

interface StudyItem {
  id: string
  jlpt_level: string
  module_type: string
  title: string
  content_body: string
  example_sentence: string
  quiz_question: string
  quiz_opt_a: string
  quiz_opt_b: string
  quiz_correct: string
  quiz_explanation: string
}

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [activeTab, setActiveTab] = useState<"quiz" | "study">("quiz")

  const [questions, setQuestions] = useState<Question[]>([])
  const [studyItems, setStudyItems] = useState<StudyItem[]>([])
  const [loadingQuiz, setLoadingQuiz] = useState(true)
  const [loadingStudy, setLoadingStudy] = useState(true)

  const [level, setLevel] = useState("N5")
  const [type, setType] = useState("grammar")
  const [questionText, setQuestionText] = useState("")
  const [optA, setOptA] = useState("")
  const [optB, setOptB] = useState("")
  const [optC, setOptC] = useState("")
  const [optD, setOptD] = useState("")
  const [correct, setCorrect] = useState("A")
  const [explanation, setExplanation] = useState("")

  const [sLevel, setSLevel] = useState("N5")
  const [sType, setSType] = useState("grammar")
  const [sTitle, setSTitle] = useState("")
  const [sBody, setSBody] = useState("")
  const [sExample, setSExample] = useState("")
  const [sQuizQ, setSQuizQ] = useState("")
  const [sQuizA, setSQuizA] = useState("")
  const [sQuizB, setSQuizB] = useState("")
  const [sQuizCorrect, setSQuizCorrect] = useState("A")
  const [sQuizExp, setSQuizExp] = useState("")

  useEffect(() => {
    async function checkAdminAccess() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email === "wisnuajisyafiq@gmail.com") {
        setIsAuthorized(true)
        fetchQuestions()
        fetchStudyItems()
      } else {
        alert("🔒 Akses Ditolak!")
        router.push("/dashboard")
      }
    }
    checkAdminAccess()
  }, [])

  async function fetchQuestions() {
    try {
      const res = await fetch("/api/admin/questions", { cache: "no-store" })
      if (res.ok) setQuestions(await res.json())
    } catch (err) { console.error(err) } finally { setLoadingQuiz(false) }
  }

  async function fetchStudyItems() {
    try {
      const res = await fetch("/api/admin/study", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setStudyItems(Array.isArray(data) ? data : [])
      }
    } catch (err) { console.error(err) } finally { setLoadingStudy(false) }
  }

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault()
    if (!questionText || !optA || !optB || !optC || !optD) return alert("Lengkapi data soal!")
    try {
      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jlpt_level: level, module_type: type, question_text: questionText,
          option_a: optA, option_b: optB, option_c: optC, option_d: optD,
          correct_option: correct, explanation
        })
      })
      if (res.ok) {
        alert("🎉 Soal sukses ditambahkan!")
        setQuestionText(""); setOptA(""); setOptB(""); setOptC(""); setOptD(""); setExplanation("")
        fetchQuestions()
      }
    } catch { alert("Gagal koneksi") }
  }

  async function handleAddStudy(e: React.FormEvent) {
    e.preventDefault()
    if (!sTitle || !sBody || !sExample || !sQuizQ || !sQuizA || !sQuizB) return alert("Lengkapi data materi!")
    try {
      const res = await fetch("/api/admin/study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jlpt_level: sLevel, module_type: sType, title: sTitle, content_body: sBody,
          example_sentence: sExample, quiz_question: sQuizQ, quiz_opt_a: sQuizA,
          quiz_opt_b: sQuizB, quiz_correct: sQuizCorrect, quiz_explanation: sQuizExp
        })
      })
      if (res.ok) {
        alert("🎉 Materi belajar baru sukses disimpan!")
        setSTitle(""); setSBody(""); setSExample(""); setSQuizQ(""); setSQuizA(""); setSQuizB(""); setSQuizExp("")
        fetchStudyItems()
      } else {
        const err = await res.json()
        alert(`Gagal: ${err.error}`)
      }
    } catch { alert("Gagal koneksi") }
  }

  async function handleDeleteQuestion(id: string) {
    if (!confirm("Hapus soal ini?")) return
    const res = await fetch(`/api/admin/questions?id=${id}`, { method: "DELETE" })
    if (res.ok) { alert("Terhapus!"); fetchQuestions() }
  }

  async function handleDeleteStudy(id: string) {
    if (!confirm("Hapus materi ini?")) return
    const res = await fetch(`/api/admin/study?id=${id}`, { method: "DELETE" })
    if (res.ok) { alert("Terhapus!"); fetchStudyItems() }
  }

  if (!isAuthorized) {
    return <div className="p-6 text-center text-xs animate-pulse">Memverifikasi Hak Akses...</div>
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">🎌 Pusat Kontrol Manajemen DaijiNihongo</h1>
          <p className="text-slate-500 text-xs mt-0.5">Sistem pembaruan butir soal kuis dan kurikulum materi mandiri.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border">
          <Button
            variant={activeTab === "quiz" ? "default" : "ghost"}
            size="sm"
            className="text-xs rounded-lg h-8"
            onClick={() => setActiveTab("quiz")}
          >
            ✍️ Kelola Soal
          </Button>
          <Button
            variant={activeTab === "study" ? "default" : "ghost"}
            size="sm"
            className="text-xs rounded-lg h-8"
            onClick={() => setActiveTab("study")}
          >
            📖 Kelola Materi
          </Button>
        </div>
      </div>

      {/* ===== TAB 1: KELOLA BANK SOAL ===== */}
      {activeTab === "quiz" && (
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-100">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-bold">Suntik Soal Kuis Pilihan Ganda</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <form onSubmit={handleAddQuestion} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs">Level</Label>
                    <select className="w-full mt-1 p-2 rounded-lg border bg-white" value={level} onChange={(e) => setLevel(e.target.value)}>
                      {["N5","N4","N3","N2","N1"].map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Modul</Label>
                    <select className="w-full mt-1 p-2 rounded-lg border bg-white" value={type} onChange={(e) => setType(e.target.value)}>
                      {["grammar","kanji","vocab","reading"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Kunci</Label>
                    <select className="w-full mt-1 p-2 rounded-lg border bg-white" value={correct} onChange={(e) => setCorrect(e.target.value)}>
                      {["A","B","C","D"].map((k) => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Kalimat Soal</Label>
                  <Input type="text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1"><Label className="text-xs">Opsi A</Label><Input type="text" value={optA} onChange={(e) => setOptA(e.target.value)} /></div>
                  <div className="space-y-1"><Label className="text-xs">Opsi B</Label><Input type="text" value={optB} onChange={(e) => setOptB(e.target.value)} /></div>
                  <div className="space-y-1"><Label className="text-xs">Opsi C</Label><Input type="text" value={optC} onChange={(e) => setOptC(e.target.value)} /></div>
                  <div className="space-y-1"><Label className="text-xs">Opsi D</Label><Input type="text" value={optD} onChange={(e) => setOptD(e.target.value)} /></div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Pembahasan</Label>
                  <textarea className="w-full p-2 border rounded-lg h-20 text-xs bg-white text-slate-800" value={explanation} onChange={(e) => setExplanation(e.target.value)} />
                </div>
                <Button type="submit" className="w-full text-xs h-9 bg-slate-800 text-white rounded-lg font-medium">
                  Simpan Butir Soal
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-100">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-bold">Daftar Soal Aktif ({questions.length})</CardTitle>
              <CardDescription className="text-xs">Semua soal yang tersedia di bank kuis acak.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="border rounded-lg max-h-80 overflow-y-auto divide-y text-xs">
                {loadingQuiz ? (
                  <div className="p-4 text-center text-slate-400 animate-pulse">Memuat data...</div>
                ) : questions.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">Belum ada soal kuis.</div>
                ) : (
                  questions.map((q) => (
                    <div key={q.id} className="p-3 flex justify-between items-center gap-3">
                      <div className="truncate flex-1">
                        <span className="font-bold text-[#4f46e5] mr-2">[{q.jlpt_level}-{q.module_type.toUpperCase()}]</span>
                        {q.question_text}
                      </div>
                      <Button variant="destructive" className="h-7 text-[10px] px-2 rounded-lg shrink-0" onClick={() => handleDeleteQuestion(q.id)}>
                        Hapus
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===== TAB 2: KELOLA MATERI BELAJAR ===== */}
      {activeTab === "study" && (
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-100">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-bold">Tambah Materi Belajar Baru</CardTitle>
              <CardDescription className="text-xs">Isi konten teori beserta kalimat contoh dan mini flash-kuis.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <form onSubmit={handleAddStudy} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Level JLPT</Label>
                    <select className="w-full mt-1 p-2 rounded-lg border bg-white" value={sLevel} onChange={(e) => setSLevel(e.target.value)}>
                      {["N5","N4","N3","N2","N1"].map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Modul</Label>
                    <select className="w-full mt-1 p-2 rounded-lg border bg-white" value={sType} onChange={(e) => setSType(e.target.value)}>
                      {["grammar","kanji","vocab","reading"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Judul Materi</Label>
                  <Input placeholder="cth: Penggunaan Partikel は vs が" value={sTitle} onChange={(e) => setSTitle(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Isi Penjelasan Teori</Label>
                  <textarea className="w-full p-2 border rounded-lg h-24 text-xs bg-white text-slate-800" placeholder="Tulis penjelasan lengkap materi di sini..." value={sBody} onChange={(e) => setSBody(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Kalimat Contoh</Label>
                  <Input placeholder="cth: 私は学生です。Watashi wa gakusei desu." value={sExample} onChange={(e) => setSExample(e.target.value)} />
                </div>

                {/* SEKSI MINI KUIS */}
                <div className="border border-dashed border-slate-300 rounded-xl p-4 space-y-3 bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">⚡ Flash Mini-Kuis</p>
                  <div className="space-y-1">
                    <Label className="text-xs">Pertanyaan Kuis</Label>
                    <Input placeholder="Tulis pertanyaan singkat..." value={sQuizQ} onChange={(e) => setSQuizQ(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Opsi A</Label><Input value={sQuizA} onChange={(e) => setSQuizA(e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Opsi B</Label><Input value={sQuizB} onChange={(e) => setSQuizB(e.target.value)} /></div>
                  </div>
                  <div>
                    <Label className="text-xs">Jawaban Benar</Label>
                    <select className="w-full mt-1 p-2 rounded-lg border bg-white" value={sQuizCorrect} onChange={(e) => setSQuizCorrect(e.target.value)}>
                      <option value="A">Opsi A</option>
                      <option value="B">Opsi B</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Penjelasan Jawaban (Opsional)</Label>
                    <textarea className="w-full p-2 border rounded-lg h-16 text-xs bg-white text-slate-800" placeholder="Mengapa jawaban ini benar?" value={sQuizExp} onChange={(e) => setSQuizExp(e.target.value)} />
                  </div>
                </div>

                <Button type="submit" className="w-full text-xs h-9 bg-[#4f46e5] text-white rounded-lg font-medium">
                  Simpan Materi Belajar
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-100">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-bold">Daftar Materi Aktif ({studyItems.length})</CardTitle>
              <CardDescription className="text-xs">Semua modul teori yang tersedia di Ruang Belajar Mandiri.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="border rounded-lg max-h-80 overflow-y-auto divide-y text-xs">
                {loadingStudy ? (
                  <div className="p-4 text-center text-slate-400 animate-pulse">Memuat data materi...</div>
                ) : studyItems.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">Belum ada materi belajar.</div>
                ) : (
                  studyItems.map((m) => (
                    <div key={m.id} className="p-3 flex justify-between items-center gap-3">
                      <div className="truncate flex-1">
                        <span className="font-bold text-[#4f46e5] mr-2">[{m.jlpt_level}-{m.module_type.toUpperCase()}]</span>
                        {m.title}
                      </div>
                      <Button variant="destructive" className="h-7 text-[10px] px-2 rounded-lg shrink-0" onClick={() => handleDeleteStudy(m.id)}>
                        Hapus
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
