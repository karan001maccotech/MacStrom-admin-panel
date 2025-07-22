import { NextResponse } from "next/server"

export async function POST(request) {
  // Simulate 2FA setup
  const qrCode = "/placeholder.svg?height=200&width=200"
  const backupCodes = ["ABC123", "DEF456", "GHI789", "JKL012", "MNO345", "PQR678"]

  return NextResponse.json(
    {
      qrCode: qrCode,
      backupCodes: backupCodes,
    },
    { status: 200 },
  )
}
