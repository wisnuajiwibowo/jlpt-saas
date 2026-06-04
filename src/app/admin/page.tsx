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

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isAuthorized, setIsAuthorized] = useState(false)

  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  
  const [level, setLevel] = useState("N5")
  const [type, setType] = useState("grammar")
  const [questionText, setQuestionText] = useState("")
  const [optA, setOptA] = useState("")
  const [optB, setOptB] = useState("")
  const [optC, setOptC] = useState("")
  const [optD, setOptD] = useState("")
  const [correct, setCorrect] = useState("A")
  const [explanation, setExplanation] = useState("")

  useEffect(() => {
    async function checkAdminAccess() {
      const { data: { user } } = await supabase.auth.getUser()
      
      // SUDAH DIUBAH MUTLAK: Mengunci gerbang hanya untuk email Anda asli
      if (user && user.email === "wisnuajisyafiq@gmail.com") { 
        setIsAuthorized(true)
        fetchAllQuestions()
      } else {
        alert("🔒 Akses Ditolak! Halaman ini khusus untuk Akun Admin Utama.")
        router.push("/dashboard")
      }
    }
    checkAdminAccess()
  }, [])

  async function fetchAllQuestions() {
    try {
      const res = await fetch("/api/admin/questions", { cache: 'no-store' })
      const data = await res.json()
      if (res.ok) setQuestions(data)
    } catch (err) {
      console.error("Gagal mengambil data soal", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault()
    if (!questionText || !optA || !optB || !optC || !optD) {
      alert("Semua kolom wajib diisi manual!")
      return
    }

    try {
      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jlpt_level: level,
          module_type: type,
          question_text: questionText,
          option_a: optA,
          option_b: optB,
          option_c: optC,
          option_d: optD,
          correct_option: correct,
          explanation: explanation || ""
        })
      })

      const responseData = await res.json()

      if (res.ok) {
        alert("🎉 Sukses! Soal baru berhasil disuntikkan ke Supabase!")
        setQuestionText("")
        setOptA("")
        setOptB("")
        setOptC("")
        setOptD("")
        setExplanation("")
        fetchAllQuestions()
      } else {
        alert(`⚠️ Gagal Menyimpan: ${responseData.error}`)
      }
    } catch (err) {
      alert("❌ Gagal terhubung dengan server API.")
    }
  }

  async function handleDeleteQuestion(id: string) {
    if (!confirm("Apakah Anda 100% yakin ingin menghapus butir soal ini?")) return

    try {
      const res = await fetch(`/api/admin/questions?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        alert("🗑️ Soal berhasil dihapus dari database!")
        fetchAllQuestions()
      } else {
        alert("⚠️ Gagal menghapus soal.")
      }
    } catch (err) {
      alert("❌ Terjadi kesalahan sistem saat mencoba menghapus.")
    }
  }

  if (!isAuthorized) {
    return <div className="p-6 text-center text-sm text-muted-foreground animate-pulse">Memverifikasi Hak Akses Kunci Sistem...</div>
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">🎌 Panel Kontrol Admin JLPT Master</h1>
        <p className="text-muted-foreground text-sm mt-1">Kelola manajemen penambahan dan penghapusan butir soal secara manual.</p>
      </div>

      <Card className="shadow-md border border-muted">
        <CardHeader>
          <CardTitle>Tambah Butir Soal Baru</CardTitle>
          <CardDescription>Gunakan modifikasi teks mandiri agar aman dari hak cipta buku.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddQuestion} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Tingkatan Level</Label>
                <select className="w-full mt-1.5 p-2 rounded-md border bg-background text-sm text-foreground" value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="N5">JLPT N5</option>
                  <option value="N4">JLPT N4</option>
                  <option value="N3">JLPT N3</option>
                  <option value="N2">JLPT N2</option>
                  <option value="N1">JLPT N1</option>
                </select>
              </div>
              <div>
                <Label>Jenis Modul</Label>
                <select className="w-full mt-1.5 p-2 rounded-md border bg-background text-sm text-foreground" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="grammar">Grammar (文法)</option>
                  <option value="kanji">Kanji (漢字)</option>
                  <option value="vocab">Vocabulary (語彙)</option>
                  <option value="reading">Reading (読解)</option>
                </select>
              </div>
              <div>
                <Label>Kunci Jawaban</Label>
                <select className="w-full mt-1.5 p-2 rounded-md border bg-background text-sm text-foreground" value={correct} onChange={(e) => setCorrect(e.target.value)}>
                  <option value="A">Opsi A</option>
                  <option value="B">Opsi B</option>
                  <option value="C">Opsi C</option>
                  <option value="D">Opsi D</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Kalimat Pertanyaan Utama</Label>
              <Input type="text" placeholder="Contoh: 日本の生活に慣れる＿＿＿、日本語が上手になってきた。" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Pilihan A</Label><Input type="text" value={optA} onChange={(e) => setOptA(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Pilihan B</Label><Input type="text" value={optB} onChange={(e) => setOptB(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Pilihan C</Label><Input type="text" value={optC} onChange={(e) => setOptC(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Pilihan D</Label><Input type="text" value={optD} onChange={(e) => setOptD(e.target.value)} /></div>
            </div>

            <div className="space-y-1.5">
              <Label>Boks Pembahasan & Analisis Jebakan (Gaya Shin Kanzen Master)</Label>
              <textarea className="w-full p-3 rounded-md border bg-background text-sm text-foreground h-24" placeholder="Tuliskan alasan jawaban benar dan pembeda nuansa antar partikel di sini..." value={explanation} onChange={(e) => setExplanation(e.target.value)} />
            </div>

            <Button type="submit" className="w-full font-semibold bg-primary text-primary-foreground">
              Simpan dan Suntik ke Supabase
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-sm border border-muted">
        <CardHeader><CardTitle>Daftar Soal di Database ({questions.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-sm text-muted-foreground py-4 animate-pulse">Memuat tabel soal...</div>
          ) : (
            <div className="border rounded-md divide-y max-h-96 overflow-y-auto bg-card">
              {questions.map((q) => (
                <div key={q.id} className="p-4 flex items-center justify-between gap-4 bg-card/40 hover:bg-muted/30 transition-colors">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold bg-primary text-primary-foreground px-2 py-0.5 rounded">{q.jlpt_level}</span>
                      <span className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded capitalize">{q.module_type}</span>
                      <span className="text-xs text-muted-foreground">Kunci: {q.correct_option}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground line-clamp-1">{q.question_text}</p>
                  </div>
                  <Button type="button" variant="destructive" size="sm" className="text-xs px-3 py-1 h-auto" onClick={() => handleDeleteQuestion(q.id)}>
                    Hapus
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
