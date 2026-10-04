"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

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
      // Memvalidasi email admin resmi kepemilikan platform Juku Anda
      if (user && user.email === "wisnuajisyafiq@gmail.com") {
        setIsAuthorized(true)
        refreshData()
      } else {
        alert("🔒 Akses Ditolak! Hanya untuk Akun Administrator.")
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
      console.error("Gagal sinkronisasi data master panel kontrol:", err)
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
      alert("🎉 Soal berhasil ditambahkan ke database!")
      setQText(""); setA(""); setB(""); setC(""); setD(""); setQExp("")
      refreshData()
    }
  }

  async function handleDeleteQuestion(id: string) {
    if (!confirm("Hapus soal ini secara permanen dari database?")) return
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
      alert("🎉 Materi belajar berhasil disimpan!")
      setSTitle(""); setSBody(""); setSExample(""); setSQuizQ(""); setSQuizA(""); setSQuizB(""); setSQuizExp("")
      refreshData()
    }
  }

  async function handleDeleteStudy(id: string) {
    if (!confirm("Hapus modul materi ini secara permanen?")) return
    const res = await fetch(`/api/admin/study?id=${id}`, { method: "DELETE" })
    if (res.ok) { alert("🗑️ Materi terhapus!"); refreshData() }
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center p-6 space-y-2">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[11px] font-medium text-slate-500 animate-pulse">Memverifikasi Hak Akses Admin Juku...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans text-xs bg-slate-50 min-h-screen text-slate-800">
      {/* HEADER UTAMA PANEL */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4 select-none">
        <div>
          <h1 className="text-lg font-bold text-slate-800">🎌 Pusat Kontrol Admin Juku</h1>
          <p className="text-slate-500 text-[11px] mt-0.5">Kelola bank soal kuis kompetensi dan modul pembelajaran mandiri.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm gap-1">
          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === "quiz" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            ✍️ Soal
          </button>
          <button
            onClick={() => setActiveTab("study")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === "study" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            📖 Materi
          </button>
        </div>
      </div>

      {/* SELECTOR LEVEL & MODUL */}
      <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <label className="font-bold text-slate-700 block mb-1">Level JLPT</label>
          <select className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50/50 font-bold focus:border-indigo-500 focus:outline-none" value={level} onChange={(e) => setLevel(e.target.value)}>
            {["N5","N4","N3","N2","N1"].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="font-bold text-slate-700 block mb-1">Modul</label>
          <select className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50/50 font-bold focus:border-indigo-500 focus:outline-none" value={type} onChange={(e) => setType(e.target.value)}>
            {["grammar","kanji","vocab","reading"].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      {/* FORM TAB QUIZ */}
      {activeTab === "quiz" && (
        <form onSubmit={handleAddQuestion} className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Pertanyaan Utama</label>
            <input className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none text-xs" placeholder="Tulis soal di sini..." value={qText} onChange={(e) => setQText(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="font-bold text-slate-600 block mb-1">Opsi A</label><input className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none text-xs" value={a} onChange={(e) => setA(e.target.value)} /></div>
            <div><label className="font-bold text-slate-600 block mb-1">Opsi B</label><input className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none text-xs" value={b} onChange={(e) => setB(e.target.value)} /></div>
            <div><label className="font-bold text-slate-600 block mb-1">Opsi C</label><input className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none text-xs" value={c} onChange={(e) => setC(e.target.value)} /></div>
            <div><label className="font-bold text-slate-600 block mb-1">Opsi D</label><input className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none text-xs" value={d} onChange={(e) => setD(e.target.value)} /></div>
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Kunci Jawaban</label>
            <select className="w-full p-2.5 rounded-lg border border-slate-200 bg-white font-bold focus:border-indigo-500 focus:outline-none" value={correct} onChange={(e) => setCorrect(e.target.value)}>
              {["A","B","C","D"].map(o => <option key={o} value={o}>Opsi {o}</option>)}
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Pembahasan</label>
            <textarea className="w-full p-2.5 border border-slate-200 rounded-lg h-20 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none text-xs" placeholder="Jelaskan mengapa jawaban ini benar..." value={qExp} onChange={(e) => setQExp(e.target.value)} />
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer">Suntik Soal ke Supabase</button>
        </form>
      )}
      {/* FORM TAB STUDY */}
      {activeTab === "study" && (
        <form onSubmit={handleAddStudy} className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Judul Materi</label>
            <input className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none text-xs" placeholder="Misal: Pola Kalimat 〜てしまう" value={sTitle} onChange={(e) => setSTitle(e.target.value)} />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Isi Teori / Penjelasan</label>
            <textarea className="w-full p-2.5 border border-slate-200 rounded-lg h-24 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none text-xs" placeholder="Tulis penjelasan lengkap materi di sini..." value={sBody} onChange={(e) => setSBody(e.target.value)} />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Kalimat Contoh (例文)</label>
            <input className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none text-xs" placeholder="cth: 財布を忘れてしまった。" value={sExample} onChange={(e) => setSExample(e.target.value)} />
          </div>
          <div className="border border-dashed border-slate-300 rounded-xl p-4 space-y-3 bg-slate-50/50">
            <p className="font-bold text-amber-600 uppercase tracking-widest text-[10px]">⚡ Flash Mini-Kuis</p>
            <div>
              <label className="font-bold text-slate-600 block mb-1">Pertanyaan Kuis</label>
              <input className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:border-indigo-500 focus:outline-none text-xs" placeholder="Tulis pertanyaan singkat..." value={sQuizQ} onChange={(e) => setSQuizQ(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="font-bold text-slate-500 block mb-1">Opsi A</label><input className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:border-indigo-500 focus:outline-none text-xs" value={sQuizA} onChange={(e) => setSQuizA(e.target.value)} /></div>
              <div><label className="font-bold text-slate-500 block mb-1">Opsi B</label><input className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:border-indigo-500 focus:outline-none text-xs" value={sQuizB} onChange={(e) => setSQuizB(e.target.value)} /></div>
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">Jawaban Benar</label>
              <select className="w-full p-2.5 rounded-lg border border-slate-200 bg-white font-bold focus:border-indigo-500 focus:outline-none" value={sQuizCorrect} onChange={(e) => setSQuizCorrect(e.target.value)}>
                <option value="A">Opsi A</option>
                <option value="B">Opsi B</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">Penjelasan Jawaban (Opsional)</label>
              <textarea className="w-full p-2.5 border border-slate-200 rounded-lg h-16 bg-white text-slate-800 focus:border-indigo-500 focus:outline-none text-xs" placeholder="Mengapa jawaban ini benar?" value={sQuizExp} onChange={(e) => setSQuizExp(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer">Simpan Materi ke Supabase</button>
        </form>
      )}

      {/* DAFTAR ITEM AKTIF */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 select-none">
          <h2 className="text-xs font-bold text-slate-700">
            Item Aktif di Database ({activeTab === "quiz" ? questions.length : studyItems.length})
          </h2>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="text-center py-6 text-slate-400 animate-pulse">Memuat...</div>
          ) : (
            <div className="max-h-64 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-100">
              {activeTab === "quiz" ? (
                questions.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">Belum ada soal.</div>
                ) : questions.map(q => (
                  <div key={q.id} className="p-3 flex justify-between items-center gap-3 hover:bg-slate-50/50">
                    <span className="truncate flex-1 font-medium text-slate-700">
                      <span className="font-bold text-indigo-600 mr-1.5">[{q.jlpt_level}-{q.module_type.toUpperCase()}]</span>
                      {q.question_text}
                    </span>
                    <button
                      className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-lg transition text-[10px] cursor-pointer shrink-0"
                      onClick={() => handleDeleteQuestion(q.id)}
                    >
                      Hapus
                    </button>
                  </div>
                ))
              ) : (
                studyItems.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">Belum ada materi.</div>
                ) : studyItems.map(s => (
                  <div key={s.id} className="p-3 flex justify-between items-center gap-3 hover:bg-slate-50/50">
                    <span className="truncate flex-1 font-medium text-slate-700">
                      <span className="font-bold text-indigo-600 mr-1.5">[{s.jlpt_level}-{s.module_type.toUpperCase()}]</span>
                      {s.title}
                    </span>
                    <button
                      className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-lg transition text-[10px] cursor-pointer shrink-0"
                      onClick={() => handleDeleteStudy(s.id)}
                    >
                      Hapus
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
