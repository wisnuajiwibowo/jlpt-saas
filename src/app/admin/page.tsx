"use client"

import { useState, useEffect } from "react"
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
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  
  // State untuk form input soal baru
  const [level, setLevel] = useState("N5")
  const [type, setType] = useState("grammar")
  const [questionText, setQuestionText] = useState("")
  const [optA, setOptA] = useState("")
  const [optB, setOptB] = useState("")
  const [optC, setOptC] = useState("")
  const [optD, setOptD] = useState("")
  const [correct, setCorrect] = useState("A")
  const [explanation, setExplanation] = useState("")

  // Ambil semua daftar soal saat halaman dibuka
  async function fetchAllQuestions() {
    try {
      const res = await fetch("/api/admin/questions")
      const data = await res.json()
      if (res.ok) setQuestions(data)
    } catch (err) {
      console.error("Gagal mengambil data soal", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllQuestions()
  }, [])

  // Fungsi Tambah Soal Manual
  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault()
    if (!questionText || !optA || !optB || !optC || !optD) {
      alert("Semua kolom wajib diisi!")
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
          explanation
        })
      })

      if (res.ok) {
        alert("Soal berhasil ditambahkan ke Supabase!")
        // Reset form input
        setQuestionText("")
        setOptA("")
        setOptB("")
        setOptC("")
        setOptD("")
        setExplanation("")
        fetchAllQuestions() // Refresh daftar tabel bawah
      } else {
        const errData = await res.json()
        alert(`Gagal: ${errData.error}`)
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem")
    }
  }

  // Fungsi Hapus Soal Manual
  async function handleDeleteQuestion(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus butir soal ini secara permanen dari database?")) return

    try {
      const res = await fetch(`/api/admin/questions?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        alert("Soal berhasil terhapus!")
        fetchAllQuestions()
      } else {
        alert("Gagal menghapus soal")
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem saat menghapus")
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">🎌 Panel Kontrol Admin JLPT Master</h1>
        <p className="text-muted-foreground text-sm mt-1">Kelola manajemen penambahan dan penghapusan butir soal secara manual.</p>
      </div>

      {/* FORMULIR TAMBAH SOAL */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Tambah Butir Soal Baru</CardTitle>
          <CardDescription>Gunakan modifikasi teks mandiri agar aman dari hak cipta buku.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddQuestion} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Tingkatan Level</Label>
                <select className="w-full mt-1.5 p-2 rounded-md border bg-background text-sm" value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="N5">JLPT N5</option>
                  <option value="N4">JLPT N4</option>
                  <option value="N3">JLPT N3</option>
                  <option value="N2">JLPT N2</option>
                  <option value="N1">JLPT N1</option>
                </select>
              </div>
              <div>
                <Label>Jenis Modul</Label>
                <select className="w-full mt-1.5 p-2 rounded-md border bg-background text-sm" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="grammar">Grammar (文法)</option>
                  <option value="kanji">Kanji (漢字)</option>
                  <option value="vocab">Vocabulary (語彙)</option>
                  <option value="reading">Reading (読解)</option>
                </select>
              </div>
              <div>
                <Label>Kunci Jawaban</Label>
                <select className="w-full mt-1.5 p-2 rounded-md border bg-background text-sm" value={correct} onChange={(e) => setCorrect(e.target.value)}>
                  <option value="A">Opsi A</option>
                  <option value="B">Opsi B</option>
                  <option value="C">Opsi C</option>
                  <option value="D">Opsi D</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Kalimat Pertanyaan Utama</Label>
              <Input placeholder="Contoh: 日本の生活に慣れる＿＿＿、日本語が上手になってきた。" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Pilihan A</Label><Input value={optA} onChange={(e) => setOptA(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Pilihan B</Label><Input value={optB} onChange={(e) => setOptB(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Pilihan C</Label><Input value={optC} onChange={(e) => setOptC(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Pilihan D</Label><Input value={optD} onChange={(e) => setOptD(e.target.value)} /></div>
            </div>

            <div className="space-y-1.5">
              <Label>Boks Pembahasan & Analisis Jebakan (Gaya Shin Kanzen Master)</Label>
              <textarea className="w-full p-3 rounded-md border bg-background text-sm h-24" placeholder="Tuliskan alasan jawaban benar dan pembeda nuansa antar partikel di sini..." value={explanation} onChange={(e) => setExplanation(e.target.value)} />
            </div>

            <Button type="submit" className="w-full font-semibold">Simpan dan Suntik ke Supabase</Button>
          </form>
        </CardContent>
      </Card>

      {/* DAFTAR SOAL AKTIF & TOMBOL HAPUS */}
      <Card className="shadow-sm">
        <CardHeader><CardTitle>Daftar Soal di Database ({questions.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-sm text-muted-foreground py-4">Memuat tabel soal...</div>
          ) : questions.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-4">Database kosong.</div>
          ) : (
            <div className="border rounded-md divide-y max-h-96 overflow-y-auto">
              {questions.map((q) => (
                <div key={q.id} className="p-4 flex items-center justify-between gap-4 bg-card/40 hover:bg-card">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold bg-primary text-primary-foreground px-2 py-0.5 rounded">{q.jlpt_level}</span>
                      <span className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded capitalize">{q.module_type}</span>
                      <span className="text-xs text-muted-foreground">Kunci: {q.correct_option}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground line-clamp-1">{q.question_text}</p>
                  </div>
                  <Button variant="destructive" size="sm" className="text-xs px-3 py-1 h-auto" onClick={() => handleDeleteQuestion(q.id)}>Hapus</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
