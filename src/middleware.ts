import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/request'

// File pancingan agar compiler Vercel menyusun ulang manifes NFT dari nol
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [], // Array kosong agar tidak memblokir rute apa pun sementara waktu
}
