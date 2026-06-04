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

interface StudyModule {
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
  const [studyModules, setStudyModules] = useState<StudyModule[]>([])
  const [loadingQuiz, setLoadingQuiz] = useState(true)
  const [loadingStudy, setLoadingStudy] = useState(true)

  const [qLevel, setQLevel] = useState("N5")
  const [qType, setQType] = useState("grammar")
  const [qText, setQText] = useState("")
  const [qA, setQA] = useState("")
  const [qB, setQB] = useState("")
  const [qC, setQC] = useState("")
  const [qD, setQD] = useState("")
  const [qCorrect, setQCorrect] = useState("A")
  const [qExplain, setQExplain] = useState("")

  const [sLevel, setSLevel] = useState("N5")
  const [sType, setSType] = useState("grammar")
  const [sTitle, setSTitle] = useState("")
  const [sBody, setSBody] = useState("")
  const [sExample, setSExample] = useState("")
  const [sQuizQ, setSQuizQ] = useState("")
  const [sQuizA, setSQuizA] = useState("")
  const [sQuizB, setSQuizB] = useState("")
  const [sQuizCorrect, setSQuizCorrect] = useState("A")
  const [sQuizExplain, setSQuizExplain] = useState("")

  useEffect(() => {
    async function checkAdminAccess() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email === "wisnuajisyafiq@gmail.com") {
        setIsAuthorized(true)
        fetchQuestions()
        fetchStudyModules()
      } else {
        alert("🔒 Akses Ditolak! Khusus Akun Admin Utama.")
        router.push("/dashboard")
      }
    }
    checkAdminAccess()
  }, [])

  async function fetchQuestions() {
    try {
      const res = await fetch("/api/admin/questions", { cache: "no-store" })
      if (res.ok) setQuestions(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingQuiz(false)
    }
  }

  async function fetchStudyModules() {
    try {
      const res = await fetch("/api/admin/study", { cache: "no-store" })
      if (res.ok) setStudyModules(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingStudy(false)
    }
  }

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault()
    if (!qText || !qA || !qB || !qC || !qD) return alert("Wajib mengisi teks pertanyaan & opsi A-D!")
    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jlpt_level: qLevel,
        module_type: qType,
        question_text: qText,
        option_a: qA,
        option_b: qB,
        option_c: qC,
        option_d: qD,
        correct_option: qCorrect,
        explanation: qExplain,
      }),
    })
    if (res.ok) {
      alert("🎉 Sukses menyuntikkan Soal Kuis!")
      setQText(""); setQA(""); setQB(""); setQC(""); setQD(""); setQExplain("")
      fetchQuestions()
    }
  }

  async function handleDeleteQuestion(id: string) {
    if (!confirm("Hapus soal ini secara permanen?")) return
    const res = await fetch(`/api/admin/questions?id=${id}`, { method: "DELETE" })
    if (res.ok) { alert("🗑️ Soal kuis berhasil terhapus!"); fetchQuestions() }
  }

  async function handleAddStudy(e: React.FormEvent) {
    e.preventDefault()
    if (!sTitle || !sBody || !sExample || !sQuizQ || !sQuizA || !sQuizB) {
      return alert("Wajib melengkapi judul, isi teori, kalimat contoh, dan flash kuis!")
    }
    const res = await fetch("/api/admin/study", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jlpt_level: sLevel,
        module_type: sType,
        title: sTitle,
        content_body: sBody,
        example_sentence: sExample,
        quiz_question: sQuizQ,
        quiz_opt_a: sQuizA,
        quiz_opt_b: sQuizB,
        quiz_correct: sQuizCorrect,
        quiz_explanation: sQuizExplain,
      }),
    })
    if (res.ok) {
      alert("🎉 Sukses menyuntikkan Materi Belajar Baru!")
      setSTitle(""); setSBody(""); setSExample(""); setSQuizQ(""); setSQuizA(""); setSQuizB(""); setSQuizExplain("")
      fetchStudyModules()
    }
  }

  async function handleDeleteStudy(id: string) {
    if (!confirm("Hapus materi belajar ini secara permanen?")) return
    const res = await fetch(`/api/admin/study?id=${id}`, { method: "DELETE" })
    if (res.ok) { alert("🗑️ Materi belajar berhasil terhapus!"); fetchStudyModules() }
  }

  if (!isAuthorized) {
    return (
      <div className="p-6 text-center text-xs animate-pulse">
        Memverifikasi Hak Akses Kunci Sistem...
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 font-sans text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#3b3c95]">
            🎌 Pusat Manajemen Kontrol Juku Admin
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Kelola pasokan butir soal latihan kuis acak dan modul teori ruang belajar mandiri.
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <Button
            size="sm"
            variant={activeTab === "quiz" ? "default" : "ghost"}
            className={`text-xs ${activeTab === "quiz" ? "bg-[#4f46e5] text-white" : "text-slate-600"}`}
            onClick={() => setActiveTab("quiz")}
          >
            📝 Kelola Soal Kuis
          </Button>
          <Button
            size="sm"
            variant={activeTab === "study" ? "default" : "ghost"}
            className={`text-xs ${activeTab === "study" ? "bg-[#4f46e5] text-white" : "text-slate-600"}`}
            onClick={() => setActiveTab("study")}
          >
            📖 Kelola Materi Belajar
          </Button>
        </div>
      </div>

      {activeTab === "quiz" && (
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-100">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-sm font-bold">Formulir Tambah Soal Kuis Baru</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <form onSubmit={handleAddQuestion} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label>Level</Label>
                    <select className="w-full mt-1.5 p-2 rounded-lg border bg-white" value={qLevel} onChange={(e) => setQLevel(e.target.value)}>
                      {["N5","N4","N3","N2","N1"].map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Modul</Label>
                    <select className="w-full mt-1.5 p-2 rounded-lg border bg-white" value={qType} onChange={(e) => setQType(e.target.value)}>
                      {["grammar","kanji","vocab","reading"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Kunci Jawaban</Label>
                    <select className="w-full mt-1.5 p-2 rounded-lg border bg-white" value={qCorrect} onChange={(e) => setQCorrect(e.target.value)}>
                      {["A","B","C","D"].map((k) => <option key={k} value={k}>Opsi {k}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Pertanyaan</Label>
                  <Input className="mt-1.5 h-9 rounded-lg" placeholder="Tulis teks soal di sini..." value={qText} onChange={(e) => setQText(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>Opsi A</Label><Input className="mt-1.5 h-9 rounded-lg" value={qA} onChange={(e) => setQA(e.target.value)} /></div>
                  <div><Label>Opsi B</Label><Input className="mt-1.5 h-9 rounded-lg" value={qB} onChange={(e) => setQB(e.target.value)} /></div>
                  <div><Label>Opsi C</Label><Input className="mt-1.5 h-9 rounded-lg" value={qC} onChange={(e) => setQC(e.target.value)} /></div>
                  <div><Label>Opsi D</Label><Input className="mt-1.5 h-9 rounded-lg" value={qD} onChange={(e) => setQD(e.target.value)} /></div>
                </div>
                <div>
                  <Label>Penjelasan Pembahasan</Label>
                  <textarea className="w-full mt-1.5 p-3 rounded-lg border bg-white h-20 text-xs text-slate-800" placeholder="Opsional: jelaskan mengapa jawaban ini benar..." value={qExplain} onChange={(e) => setQExplain(e.target.value)} />
                </div>
                <Button type="submit" className="w-full bg-slate-800 text-white font-medium h-9 rounded-lg text-xs">
                  Simpan Soal Kuis
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-100">
            <CardHeader className="p-5">
              <CardTitle className="text-sm font-bold">Daftar Soal Kuis Aktif ({questions.length})</CardTitle>
              <CardDescription className="text-xs">Semua soal yang tersedia di bank kuis acak.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="border rounded-lg max-h-80 overflow-y-auto divide-y text-xs">
                {loadingQuiz ? (
                  <div className="p-4 text-center text-slate-400 animate-pulse">Memuat data soal...</div>
                ) : questions.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">Belum ada soal kuis.</div>
                ) : (
                  questions.map((q) => (
                    <div key={q.id} className="p-3 flex justify-between items-center gap-3">
                      <div className="truncate flex-1">
                        <span className="font-bold text-[#4f46e5] mr-2">[{q.jlpt_level}-{q.module_type.toUpperCase()}]</span>
                        {q.question_text}
                      </div>
                      <Button variant="destructive" className="h-7 text-[10px] px-2 rounded-md shrink-0" onClick={() => handleDeleteQuestion(q.id)}>
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

      {activeTab === "study" && (
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-100">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-sm font-bold">Formulir Tambah Materi Belajar Baru</CardTitle>
              <CardDescription className="text-xs">Isi konten teori beserta kalimat contoh dan mini flash-kuis untuk setiap modul.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <form onSubmit={handleAddStudy} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Level JLPT</Label>
                    <select className="w-full mt-1.5 p-2 rounded-lg border bg-white" value={sLevel} onChange={(e) => setSLevel(e.target.value)}>
                      {["N5","N4","N3","N2","N1"].map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Modul</Label>
                    <select className="w-full mt-1.5 p-2 rounded-lg border bg-white" value={sType} onChange={(e) => setSType(e.target.value)}>
                      {["grammar","kanji","vocab","reading"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Judul Materi</Label>
                  <Input className="mt-1.5 h-9 rounded-lg" placeholder="cth: Penggunaan Partikel は vs が" value={sTitle} onChange={(e) => setSTitle(e.target.value)} />
                </div>
                <div>
                  <Label>Isi Penjelasan Teori (content_body)</Label>
                  <textarea className="w-full mt-1.5 p-3 rounded-lg border bg-white h-24 text-xs text-slate-800" placeholder="Tulis penjelasan lengkap materi di sini..." value={sBody} onChange={(e) => setSBody(e.target.value)} />
                </div>
                <div>
                  <Label>Kalimat Contoh (example_sentence)</Label>
                  <Input className="mt-1.5 h-9 rounded-lg" placeholder="cth: 私は学生です。Watashi wa gakusei desu." value={sExample} onChange={(e) => setSExample(e.target.value)} />
                </div>
                <div className="border border-dashed border-slate-300 rounded-xl p-4 space-y-3 bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">⚡ Flash Mini-Kuis (Pemahaman Cepat)</p>
                  <div>
                    <Label>Pertanyaan Kuis</Label>
                    <Input className="mt-1.5 h-9 rounded-lg" placeholder="Tulis pertanyaan singkat..." value={sQuizQ} onChange={(e) => setSQuizQ(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Opsi A</Label><Input className="mt-1.5 h-9 rounded-lg" value={sQuizA} onChange={(e) => setSQuizA(e.target.value)} /></div>
                    <div><Label>Opsi B</Label><Input className="mt-1.5 h-9 rounded-lg" value={sQuizB} onChange={(e) => setSQuizB(e.target.value)} /></div>
                  </div>
                  <div>
                    <Label>Jawaban Benar</Label>
                    <select className="w-full mt-1.5 p-2 rounded-lg border bg-white" value={sQuizCorrect} onChange={(e) => setSQuizCorrect(e.target.value)}>
                      <option value="A">Opsi A</option>
                      <option value="B">Opsi B</option>
                    </select>
                  </div>
                  <div>
                    <Label>Penjelasan Jawaban (Opsional)</Label>
                    <textarea className="w-full mt-1.5 p-3 rounded-lg border bg-white h-16 text-xs text-slate-800" placeholder="Mengapa jawaban ini benar?" value={sQuizExplain} onChange={(e) => setSQuizExplain(e.target.value)} />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-[#4f46e5] text-white font-medium h-9 rounded-lg text-xs">
                  Simpan Materi Belajar
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-100">
            <CardHeader className="p-5">
              <CardTitle className="text-sm font-bold">Daftar Materi Belajar Aktif ({studyModules.length})</CardTitle>
              <CardDescription className="text-xs">Semua modul teori yang tersedia di Ruang Belajar Mandiri.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="border rounded-lg max-h-80 overflow-y-auto divide-y text-xs">
                {loadingStudy ? (
                  <div className="p-4 text-center text-slate-400 animate-pulse">Memuat data materi...</div>
                ) : studyModules.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">Belum ada materi belajar.</div>
                ) : (
                  studyModules.map((m) => (
                    <div key={m.id} className="p-3 flex justify-between items-center gap-3">
                      <div className="truncate flex-1">
                        <span className="font-bold text-[#4f46e5] mr-2">[{m.jlpt_level}-{m.module_type.toUpperCase()}]</span>
                        {m.title}
                      </div>
                      <Button variant="destructive" className="h-7 text-[10px] px-2 rounded-md shrink-0" onClick={() => handleDeleteStudy(m.id)}>
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
