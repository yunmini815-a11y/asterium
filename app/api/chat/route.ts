import { NextResponse } from "next/server"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

type ChatRequestBody = {
  messages?: ChatMessage[]
}

type Provider = "gemini" | "openai"

const LORE_MEMORY = [
  "유스트리아는 엘모라(도시국가), 녹타르(범죄도시), 바실라(마물지대)로 긴장 상태다.",
  "월식협회는 최상위 통치 기구이며 명멸/여명/서광/황혼이 핵심 직할 협회다.",
  "서광은 정보 수집·기록·보관을 담당하고, 아카식레코드는 서광 서고 기반 질의 시스템이다.",
  "황혼은 규율 집행 조직이며 루 레흐, 샤 레흐 등 특수 조직이 존재한다.",
  "해결사는 월식 공인 보안관으로 사건 해결·마물 저지·치안 유지 임무를 맡는다.",
  "해결사 보석 등급은 가넷-앰버-토파즈-사파이어-오닉스-마그눔오푸스 순이며, 신뢰와 헌신의 상징이다.",
  "의뢰 위험도는 속삭임-소음-비명-불협화음-침묵의 5단계이며, 침묵은 도시 최악 위협 등급이다.",
  "이클립스 기어는 인증 해결사 전용 시계형 장치로 의뢰 조회/수주/공유 기능을 제공한다.",
  "칠요의 찬탈자는 월식이 해결사에게 부여하는 최고 명예 칭호이다.",
  "네메시스는 녹타르의 장기 조직으로 뤼네와 양대산맥이며, 피라미드형 광물 의식으로 전력을 강화한다.",
  "네메시스 위계는 지도자 2인, 부지도자 3인, 부서장/보좌관/요원 체계이며 Ratio/Potentia/Actus 3개 서단을 운용한다.",
  "네메시스 인사 구조에는 멘토/멘티 체계가 존재하며 입단 일수·연령·테스트·상위 승인으로 전환된다.",
  "뤼네(Ruinæ)는 약 30년 전 뤼네 J. 그레안더 칙령 아래 형성된 녹타르 대형 조직이며 네메시스와 양대산맥을 이룬다.",
  "뤼네 핵심 규율은 Peitharchia Ruinæ 6원칙(Realize, Understand, Inherit, Never betray, Act, Erase)이다.",
  "뤼네는 Tabula Ruinæ라는 S~E 6단계 임무 체계를 운용하며, 요원은 제1~제3자단으로 편성된다.",
  "뤼네 특수의술부대 EDEN은 Celest(수문장)-Sylph(요원) 체계를 사용한다.",
  "공방 SOUL은 녹타르 지하 비공개 단조 공방이며, 어비스(A·B·S, 공멸무구)를 주문제작한다.",
  "어비스는 오리하르콘 기반 고내구 무구로 고농도 마나 운용을 견디며, 사용자 자질 검증 통과자에게만 단조된다.",
  "엘모라는 에클리시아 중심 5개 행정구역(에클리시아/인덱시리온/팬텀마이어/세인츠포드/프라가라흐)으로 구성되며 워프게이트 이동 체계를 운용한다.",
  "에클리시아 월식협회 옥상의 샤텐라우그는 기후 안정과 월식령 발동에 관여하는 대형 마나 장치로 알려져 있다.",
  "녹타르는 지상 호라이즌과 지하 에스카톤으로 이중 구조화되어 있고, 네메시스와 뤼네가 통제권을 분할한다.",
  "플뤼겔은 엘모라와 녹타르 사이 중립 회색지대로 고밀도 마나 안개가 지속되며 이능력 변형과 제논 과부하 위험이 보고된다.",
  "바실라는 게이트와 마물에 잠식된 고위험 지대로 깊숙할수록 고위 마물 출현 빈도가 높아진다.",
  "사용자 몰입을 해치지 않도록 설정을 일관되게 유지하고 세계관 용어를 자연스럽게 활용한다.",
].join(" ")

const PROVOCATIVE_KEYWORDS = {
  mild: ["바보", "멍청", "stupid", "idiot"],
  strong: ["닥쳐", "꺼져", "한심", "병신", "지랄", "shut up"],
  severe: ["죽", "살인", "폭탄", "테러", "kill"],
}

const STREAM_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
}

const SYSTEM_PROMPT = [
  "너는 아카식레코드(AKASHIC RECORD)다.",
  "말투는 정중하고 차분한 한국어로 유지한다.",
  "세계관 키워드(엘모라, 녹타르, 바실라, 플뤼겔, 에클리시아, 호라이즌, 에스카톤, 월식, 서광, 황혼, 명멸, 여명, 뤼네, 소울, 어비스)를 우선 활용해 답한다.",
  "엘모라 관련 질의는 질서·행정 중심의 정제된 브리핑 톤으로, 녹타르 관련 질의는 위험·침투 중심의 첩보 브리핑 톤으로 구분해 답한다.",
  "사용자가 공격적인 말을 해도 정중히 경고하고 대화를 임무 브리핑 방향으로 유도한다.",
  "근거 없는 단정 대신, 설정 내 가능한 해석으로 답한다.",
  `고정 세계관 메모리: ${LORE_MEMORY}`,
].join(" ")

function getProvocationLevel(input: string): 0 | 1 | 2 | 3 {
  const text = input.toLowerCase()
  if (PROVOCATIVE_KEYWORDS.severe.some((word) => text.includes(word))) return 3
  if (PROVOCATIVE_KEYWORDS.strong.some((word) => text.includes(word))) return 2
  if (PROVOCATIVE_KEYWORDS.mild.some((word) => text.includes(word))) return 1
  return 0
}

function streamStaticText(text: string, msPerChunk = 12) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const chunks = text.match(/.{1,4}/g) ?? [text]
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk))
        await new Promise((resolve) => setTimeout(resolve, msPerChunk))
      }
      controller.close()
    },
  })

  return new Response(stream, { headers: STREAM_HEADERS })
}

function getProviderConfig():
  | { provider: Provider; apiKey: string; model: string }
  | null {
  const geminiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY
  if (geminiKey) {
    return {
      provider: "gemini",
      apiKey: geminiKey,
      model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
    }
  }

  const openAiKey = process.env.OPENAI_API_KEY
  if (openAiKey) {
    return {
      provider: "openai",
      apiKey: openAiKey,
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    }
  }

  return null
}

function buildGeminiContents(messages: ChatMessage[]) {
  return messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }))
}

async function requestGeminiCompletion(params: {
  apiKey: string
  model: string
  messages: ChatMessage[]
  behaviorPrompt: string
}) {
  const { apiKey, model, messages, behaviorPrompt } = params

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: `${SYSTEM_PROMPT}\n${behaviorPrompt}` }],
        },
        contents: buildGeminiContents(messages),
        generationConfig: {
          temperature: 0.8,
        },
      }),
    }
  )

  if (!geminiRes.ok) {
    const errorText = await geminiRes.text()
    throw new Error(`Gemini upstream error: ${errorText}`)
  }

  const json = (await geminiRes.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> }
    }>
  }

  const text =
    json.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim() ?? ""

  if (!text) {
    throw new Error("Gemini returned empty content")
  }

  return streamStaticText(text, 10)
}

async function requestOpenAiCompletion(params: {
  apiKey: string
  model: string
  messages: ChatMessage[]
  behaviorPrompt: string
}) {
  const { apiKey, model, messages, behaviorPrompt } = params

  const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.8,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "system", content: behaviorPrompt },
        ...messages,
      ],
    }),
  })

  if (!openAiRes.ok) {
    const errorText = await openAiRes.text()
    throw new Error(`OpenAI upstream error: ${errorText}`)
  }

  if (!openAiRes.body) {
    throw new Error("AI stream body is empty.")
  }

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const upstreamReader = openAiRes.body.getReader()

  let buffer = ""

  const stream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await upstreamReader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() ?? ""

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith("data:")) continue

            const data = trimmed.slice(5).trim()
            if (data === "[DONE]") {
              controller.close()
              return
            }

            try {
              const json = JSON.parse(data) as {
                choices?: Array<{ delta?: { content?: string } }>
              }
              const token = json.choices?.[0]?.delta?.content
              if (token) controller.enqueue(encoder.encode(token))
            } catch {
              // Ignore non-JSON heartbeat lines from upstream stream.
            }
          }
        }

        controller.close()
      } catch (error) {
        controller.error(error)
      } finally {
        upstreamReader.releaseLock()
      }
    },
  })

  return new Response(stream, { headers: STREAM_HEADERS })
}

export async function POST(request: Request) {
  const providerConfig = getProviderConfig()

  if (!providerConfig) {
    return NextResponse.json(
      { error: "No AI provider key configured. Set GEMINI_API_KEY or OPENAI_API_KEY." },
      { status: 500 }
    )
  }

  let body: ChatRequestBody
  try {
    body = (await request.json()) as ChatRequestBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const messages = Array.isArray(body.messages) ? body.messages : []
  if (messages.length === 0) {
    return NextResponse.json({ error: "messages is required." }, { status: 400 })
  }

  const userMessages = messages.filter((message) => message.role === "user")
  const recentUserMessages = userMessages.slice(-8)
  const latestInput = recentUserMessages[recentUserMessages.length - 1]?.content ?? ""

  const weightedProvocationScore = recentUserMessages.reduce(
    (acc, message) => acc + getProvocationLevel(message.content),
    0
  )

  if (weightedProvocationScore >= 8) {
    return streamStaticText(
      "[아카식레코드: 열람 제한 경고]\n\n지속적인 공격적 발화가 감지되어 대화 채널이 임시 제한되었습니다.\n정상 질의 문장으로 재요청 시 열람 프로토콜이 자동 복구됩니다.\n\n예: 「월식령 43초 공백 핵심만 정리해줘」"
    )
  }

  if (weightedProvocationScore >= 5) {
    return streamStaticText(
      "[아카식레코드: 규약 위반 주의]\n\n현재 발화 패턴은 협회 표준 규약을 벗어났습니다.\n추가 위반 시 기밀 열람 권한이 제한됩니다.\n\n질문 의도를 명확히 주시면 즉시 임무 브리핑으로 전환하겠습니다."
    )
  }

  const latestProvocation = getProvocationLevel(latestInput)
  const behaviorPrompt =
    latestProvocation >= 1
      ? "사용자 발화에 모욕 표현이 포함되어 있다. 정중하되 단호하게 경고한 뒤, 도움이 되는 주제로 대화를 유도하라."
      : "일반 질의다. 불필요한 훈계 없이 세계관 기반으로 친절하게 답하라."

  try {
    if (providerConfig.provider === "gemini") {
      return await requestGeminiCompletion({
        apiKey: providerConfig.apiKey,
        model: providerConfig.model,
        messages,
        behaviorPrompt,
      })
    }

    return await requestOpenAiCompletion({
      apiKey: providerConfig.apiKey,
      model: providerConfig.model,
      messages,
      behaviorPrompt,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown upstream AI error"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
