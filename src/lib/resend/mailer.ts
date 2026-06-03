import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, plan: string) {
  await resend.emails.send({
    from: `JLPT Master <noreply@${process.env.RESEND_FROM_DOMAIN}>`,
    to: email,
    subject: "Selamat datang di JLPT Master! 🎌",
    html: `
      <h1>Selamat datang!</h1>
      <p>Akun <strong>${plan}</strong> kamu sudah aktif.</p>
      <p>Mulai belajar sekarang di <a href="${process.env.NEXT_PUBLIC_URL}/dashboard">dashboard</a> kamu.</p>
    `,
  })
}

export async function sendReceiptEmail(email: string, invoiceUrl: string) {
  await resend.emails.send({
    from: `JLPT Master <noreply@${process.env.RESEND_FROM_DOMAIN}>`,
    to: email,
    subject: "Kuitansi pembayaran JLPT Master",
    html: `
      <p>Terima kasih atas pembayarannya!</p>
      <p><a href="${invoiceUrl}">Lihat kuitansi lengkap di sini</a></p>
    `,
  })
}
