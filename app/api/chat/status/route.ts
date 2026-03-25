import { NextResponse } from "next/server"

export async function GET() {
  const geminiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY
  const openAiKey = process.env.OPENAI_API_KEY

  const provider = geminiKey ? "gemini" : openAiKey ? "openai" : null
  const enabled = Boolean(provider)
  const model = provider === "gemini"
    ? process.env.GEMINI_MODEL ?? "gemini-2.0-flash"
    : process.env.OPENAI_MODEL ?? "gpt-4o-mini"

  return NextResponse.json({
    enabled,
    provider,
    model,
  })
}
