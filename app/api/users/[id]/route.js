import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function DELETE(request, { params }) {
  const { id } = params

  try {
    const sql = neon(process.env.DATABASE_URL)

    // Delete user from the database
    await sql`DELETE FROM admins WHERE id = ${id}`

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Failed to delete user:", error)
    return NextResponse.json({ message: "Failed to delete user" }, { status: 500 })
  }
}
