import { createHash } from "crypto"

const IPAYMU_VA = process.env.IPAYMU_VA!
const IPAYMU_API_KEY = process.env.IPAYMU_API_KEY!
// Karena kamu pakai akun asli, kita langsung tembak ke URL asli ://ipaymu.com
const IPAYMU_URL = 'https://://ipaymu.com/api/v2/payment' 

export async function createIpaymuInvoice({
  idOrder,
  amount,
  buyerName,
  buyerEmail,
}: {
  idOrder: string
  amount: number
  buyerName: string
  buyerEmail: string
}) {
  const body = {
    name: buyerName,
    email: buyerEmail,
    price: [amount.toString()],
    qty: ["1"],
    product: ["Paket Langganan DaijiNihongo"],
    referenceId: idOrder,
    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vercel.app'}/dashboard`,
    notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vercel.app'}/api/webhook/ipaymu`,
  }

  const jsonBody = JSON.stringify(body)
  const signBody = createHash("sha256").update(jsonBody).digest("hex")
  const stringToSign = `POST:${IPAYMU_VA}:${signBody}:${IPAYMU_API_KEY}`
  const signature = createHash("sha256").update(stringToSign).digest("hex")

  const response = await fetch(IPAYMU_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "va": IPAYMU_VA,
      "signature": signature,
    },
    body: jsonBody,
  })

  return await response.json()
}
