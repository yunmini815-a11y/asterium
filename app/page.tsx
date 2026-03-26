"use client"

import { useEffect, useRef, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { ChatInterface } from "@/components/dashboard/chat-interface"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { Globe, Shield, Lock, FileText, Users, AlertTriangle, Fingerprint, Sparkles, ChevronRight } from "lucide-react"

function WorldviewPanel() {
  const worldviewData = [
    { label: "등록된 세계", value: "147", change: "+3" },
    { label: "관측 중인 이상현상", value: "23", change: "+1" },
    { label: "활성 게이트", value: "8", change: "0" },
  ]

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto p-4 sm:p-6 lg:overflow-hidden">
      <div className="mb-5 sm:mb-6">
        <h2 className="flex items-center gap-3 text-base font-semibold text-foreground sm:text-lg">
          <Globe className="h-5 w-5 text-primary" />
          세계관 조회
        </h2>
        <p className="mt-1 text-xs tracking-wider text-muted-foreground">
          WORLDVIEW DATABASE ACCESS
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {worldviewData.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border/70 bg-card/70 p-4"
          >
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-2xl font-bold text-foreground">
                {item.value}
              </span>
              <span
                className={`text-xs ${
                  item.change.startsWith("+")
                    ? "text-emerald-500"
                    : "text-muted-foreground"
                }`}
              >
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex-1 overflow-hidden rounded-xl border border-border/70 bg-card/70 p-4 sm:mt-6">
        <h3 className="mb-4 text-sm font-medium text-foreground">최근 관측 기록</h3>
        <div className="space-y-3 overflow-y-auto">
          {[
            { id: "W-147", name: "신규 세계 발견", status: "분석 중", time: "2시간 전" },
            { id: "W-089", name: "차원 불안정 감지", status: "모니터링", time: "5시간 전" },
            { id: "W-112", name: "게이트 활성화 완료", status: "완료", time: "1일 전" },
          ].map((record) => (
            <div
              key={record.id}
              className="flex flex-col gap-2 rounded-lg bg-secondary/40 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-primary">{record.id}</span>
                <span className="text-sm text-foreground">{record.name}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {record.status}
                </span>
                <span className="text-xs text-muted-foreground">{record.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AuditPanel() {
  const agents = [
    { id: "A-001", name: "김서진", rank: "상급 요원", capability: 94, status: "현장 배치" },
    { id: "A-007", name: "이도현", rank: "특수 요원", capability: 89, status: "대기" },
    { id: "A-023", name: "박지우", rank: "신입 요원", capability: 72, status: "훈련 중" },
    { id: "A-012", name: "최민서", rank: "상급 요원", capability: 91, status: "임무 수행" },
  ]

  return (
    <div className="flex h-full flex-col p-4 sm:p-6">
      <div className="mb-5 sm:mb-6">
        <h2 className="flex items-center gap-3 text-base font-semibold text-foreground sm:text-lg">
          <Shield className="h-5 w-5 text-primary" />
          역량 감사
        </h2>
        <p className="mt-1 text-xs tracking-wider text-muted-foreground">
          CAPABILITY AUDIT SYSTEM
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div className="rounded-xl border border-border/70 bg-card/70 p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">총 활성 요원</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">247</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-card/70 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">평균 역량 지수</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">84.7</p>
        </div>
      </div>

      <div className="mt-5 flex-1 overflow-hidden rounded-xl border border-border/70 bg-card/70 sm:mt-6">
        <div className="border-b border-border/70 p-4">
          <h3 className="text-sm font-medium text-foreground">요원 목록</h3>
        </div>
        <div className="h-full divide-y divide-border/70 overflow-y-auto">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex flex-col gap-3 p-4 transition-colors hover:bg-secondary/30 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {agent.name.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-primary">{agent.id}</span>
                    <span className="text-sm font-medium text-foreground">{agent.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{agent.rank}</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6">
                <div className="w-24">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">역량</span>
                    <span className="text-foreground">{agent.capability}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${agent.capability}%` }}
                    />
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    agent.status === "현장 배치" || agent.status === "임무 수행"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : agent.status === "대기"
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {agent.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ArchivePanel() {
  const documents = [
    {
      id: "DOC-2847",
      title: "프로젝트 플뤼겔 보고서",
      level: "기밀",
      date: "266.03.15",
      summary: "바실라 심부에서 회수된 비행형 잔해와 인공 마나흐름에 관한 통합 보고서.",
      content: [
        "회수된 파편 7점은 기존 명멸 공정에서 확인된 합금비와 일치하지 않습니다. 외층은 오리하르콘 계열이나 내층은 생체 반응성을 보였습니다.",
        "잔해의 문양은 서광 제2과가 보관 중인 금기 문서 「쌍익의 도해」와 83% 유사합니다. 해당 도해는 열람 1급으로 재분류 요청되었습니다.",
        "시험 가동 중 파편이 스스로 공명하며 단일 음절을 반복했습니다. 음성분석 결과 '플뤼겔'과 가장 근접한 파형으로 판독됩니다.",
      ],
    },
    {
      id: "DOC-1923",
      title: "제4게이트 역진입 실험 기록",
      level: "일반",
      date: "266.03.10",
      summary: "게이트 내부로 역진입한 선발대의 생체/시간 지표와 귀환 후 변이 보고.",
      content: [
        "역진입 3분 12초 시점부터 모든 시계 장치가 역행했습니다. 귀환 시 실제 경과시간은 19분, 체감시간 진술은 4시간 이상으로 불일치합니다.",
        "대원 2인은 귀환 직후 동일 인물을 '두 번 본 적 있다'고 진술했습니다. 서광은 이를 단순 착시가 아닌 인지 중첩 현상으로 분류했습니다.",
        "게이트 표면에서 채취한 마나막 잔류값은 월식령 선포 직후 관측되는 도시 전역 파장과 동일 대역을 포함합니다.",
      ],
    },
    {
      id: "DOC-3156",
      title: "황혼 루 레흐 비인가 소집 로그",
      level: "보통",
      date: "266.03.08",
      summary: "공식 명령 없이 발생한 루 레흐 집결 사건에 대한 통신 기록 발췌.",
      content: [
        "266.03.08 02:14, 내부 채널에 협회장 서명 없는 집결 신호가 송신되었습니다. 그러나 코드 체계는 정식 천명 양식과 완전히 일치했습니다.",
        "현장 도착 요원 전원이 '같은 명령을 각자 다른 목소리로 들었다'고 보고했습니다. 지시 내용은 모두 동일했으나 호출 주체를 특정하지 못했습니다.",
        "로그 말미에는 신원 미상의 문자열이 남아 있습니다: '늑대가 아니라, 목줄을 쥔 손을 추적하라.'",
      ],
    },
    {
      id: "DOC-0847",
      title: "엘모라 북벽 무음현상 관측서",
      level: "기밀",
      date: "266.02.28",
      summary: "북벽 감시구역에서 주기적으로 발생하는 11초 무음 구간 관측 결과.",
      content: [
        "무음 구간 동안 바람, 발화, 마나 반응이 완전히 소실됩니다. 시각 정보는 유지되나 모든 소리의 전파가 정지된 것으로 추정됩니다.",
        "11초 종료 직후 감시 인력 4인은 서로 다른 문장을 들었다고 진술했으나, 모두 마지막 단어가 '서고'로 일치했습니다.",
        "현상 재현 시 북벽 아래 봉인석의 문양 일부가 발광했습니다. 여명협회는 외부 요인보다 내부 공명 가능성에 무게를 두고 있습니다.",
      ],
    },
    {
      id: "DOC-4412",
      title: "서고 열람 0급 접근 시도 흔적",
      level: "기밀",
      date: "266.02.23",
      summary: "존재가 공식 부정된 0급 서가 접근 흔적에 대한 역추적 보고.",
      content: [
        "접근 로그는 남아 있으나 주체 로그는 비어 있습니다. 기록상 '문이 열렸다'는 결과만 존재하고 누가 열었는지는 남지 않았습니다.",
        "서고 내부 기록은 변조 불가 원칙을 유지하고 있으나, 본 건은 변조가 아닌 '기록자 부재'에 가깝습니다.",
        "사서 직속 검토 결론: 누군가 들어간 것이 아니라, 누군가 이미 안쪽에서 문을 열었을 가능성이 더 높습니다.",
      ],
    },
    {
      id: "DOC-5570",
      title: "월식령 선포 전 43초 공백 분석",
      level: "보통",
      date: "266.02.17",
      summary: "월식령 선포 직전 도시 기록망에서 동시에 누락된 43초의 흔적 분석.",
      content: [
        "모든 관제 시스템에서 동일한 길이의 공백이 확인되었습니다. 장비 고장으로 보기엔 손실 패턴이 지나치게 정밀합니다.",
        "공백 직전 마지막 프레임에는 하늘에 반달 문양이 겹쳐 관측됩니다. 그러나 당시 기상 기록에는 해당 광학 조건이 존재하지 않습니다.",
        "결론은 보류되었습니다. 다만 공백 이후 첫 통신 문장만은 공통입니다: '우리는 언제나, 어느 곳에든 존재한다.'",
      ],
    },
  ]

  const [selectedDocId, setSelectedDocId] = useState(documents[0].id)
  const [mobileSelectedDocId, setMobileSelectedDocId] = useState(documents[0].id)
  const [revealedLineCount, setRevealedLineCount] = useState(0)
  const [mobileHintVisible, setMobileHintVisible] = useState(true)
  const [mobileNudgeActive, setMobileNudgeActive] = useState(false)
  const [detailPulse, setDetailPulse] = useState(false)
  const [mobileCarouselApi, setMobileCarouselApi] = useState<CarouselApi>()
  const detailPanelRef = useRef<HTMLElement>(null)

  const isMobileViewport = () => typeof window !== "undefined" && window.innerWidth < 1024
  const effectiveSelectedDocId = isMobileViewport() ? mobileSelectedDocId : selectedDocId
  const selectedDoc = documents.find((doc) => doc.id === effectiveSelectedDocId) ?? documents[0]
  const selectedDocIndex = documents.findIndex((doc) => doc.id === effectiveSelectedDocId)

  useEffect(() => {
    setRevealedLineCount(0)

    const timer = setInterval(() => {
      setRevealedLineCount((prev) => {
        if (prev >= selectedDoc.content.length) {
          clearInterval(timer)
          return prev
        }
        return prev + 1
      })
    }, 220)

    return () => clearInterval(timer)
  }, [effectiveSelectedDocId, selectedDoc.content.length])

  useEffect(() => {
    const isMobile = window.innerWidth < 1024
    if (!isMobile) {
      setMobileHintVisible(false)
      return
    }

    setMobileHintVisible(true)

    const timer = window.setTimeout(() => {
      setMobileHintVisible(false)
    }, 3200)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const isMobile = window.innerWidth < 1024
    if (!isMobile || !mobileCarouselApi) return

    const nudgeStart = window.setTimeout(() => {
      setMobileNudgeActive(true)
      mobileCarouselApi.scrollNext()
    }, 550)

    const nudgeReset = window.setTimeout(() => {
      mobileCarouselApi.scrollTo(0)
      setMobileNudgeActive(false)
    }, 1300)

    return () => {
      window.clearTimeout(nudgeStart)
      window.clearTimeout(nudgeReset)
    }
  }, [mobileCarouselApi])

  useEffect(() => {
    setDetailPulse(true)
    const timer = window.setTimeout(() => setDetailPulse(false), 520)

    return () => window.clearTimeout(timer)
  }, [effectiveSelectedDocId])

  useEffect(() => {
    if (!mobileCarouselApi) return

    const syncSelectedDoc = () => {
      const nextIndex = mobileCarouselApi.selectedScrollSnap()
      const nextDoc = documents[nextIndex]
      if (nextDoc && nextDoc.id !== mobileSelectedDocId) {
        setMobileSelectedDocId(nextDoc.id)
      }
    }

    mobileCarouselApi.on("select", syncSelectedDoc)
    mobileCarouselApi.on("reInit", syncSelectedDoc)
    if (isMobileViewport()) {
      syncSelectedDoc()
    }

    return () => {
      mobileCarouselApi.off("select", syncSelectedDoc)
      mobileCarouselApi.off("reInit", syncSelectedDoc)
    }
  }, [documents, mobileCarouselApi, mobileSelectedDocId])

  return (
    <div className="flex h-full flex-col p-4 sm:p-6">
      <div className="mb-5 sm:mb-6">
        <h2 className="flex items-center gap-3 text-base font-semibold text-foreground sm:text-lg">
          <Lock className="h-5 w-5 text-primary" />
          기밀 보관소
        </h2>
        <p className="mt-1 text-xs tracking-wider text-muted-foreground">
          CLASSIFIED ARCHIVE ACCESS
        </p>
      </div>

      <div className="mb-5 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:mb-6">
        <div className="flex items-center gap-2 text-primary">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-medium">보안 경고</span>
        </div>
        <p className="mt-2 text-[13px] leading-6 text-muted-foreground sm:text-xs sm:leading-normal">
          본 영역의 모든 접근 및 열람 기록은 보안 시스템에 의해 자동 기록됩니다.
          무단 복제 또는 외부 유출 시 협회 규정에 따라 처리됩니다.
        </p>
      </div>

      <div
        className={cn(
          "mb-3 flex items-center justify-between rounded-xl border border-border/60 bg-card/50 px-3 py-2 transition-all duration-500 lg:hidden",
          mobileHintVisible ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-70"
        )}
      >
        <div>
          <p className="text-[10px] tracking-[0.24em] text-primary/85">ARCHIVE SLIDE</p>
          <p className="mt-1 text-[13px] leading-5 text-muted-foreground">문서를 좌우로 넘겨 다른 기록을 확인하세요.</p>
        </div>
        <div className="flex items-center gap-1 text-primary/80">
          <span className="text-[10px] tracking-widest">SWIPE</span>
          <div className="flex items-center">
            <ChevronRight className="h-4 w-4 -mr-1 animate-pulse" />
            <ChevronRight className="h-4 w-4 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 pb-5 lg:flex-1 lg:overflow-hidden lg:gap-3 lg:pb-0 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <div className="relative lg:hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-7 bg-gradient-to-r from-background via-background/70 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background via-background/75 to-transparent" />
            <Carousel
              setApi={setMobileCarouselApi}
              opts={{ align: "start", dragFree: false, containScroll: "trimSnaps", skipSnaps: false }}
              className={cn("px-1 transition-transform duration-500", mobileNudgeActive && "translate-x-1")}
            >
              <CarouselContent className="archive-scroll -ml-2 pb-2 pr-10">
              {documents.map((doc) => {
                const isActive = mobileSelectedDocId === doc.id

                return (
                  <CarouselItem key={doc.id} className="basis-[calc(100vw-2.5rem)] pl-2 sm:basis-[68vw]">
                    <button
                      type="button"
                      onClick={() => {
                        if (!isActive) {
                          setMobileSelectedDocId(doc.id)
                          mobileCarouselApi?.scrollTo(documents.findIndex((item) => item.id === doc.id))
                        }
                        if (window.innerWidth < 1024) {
                          requestAnimationFrame(() => {
                            detailPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
                          })
                        }
                      }}
                      className={`group relative w-full overflow-hidden rounded-[1.35rem] border p-3.5 text-left transition-all duration-300 ${
                        isActive
                          ? "scale-[1.01] border-primary/55 bg-primary/12 shadow-[0_0_0_1px_rgba(56,189,248,0.25),0_18px_40px_rgba(2,6,23,0.28)]"
                          : "scale-[0.985] border-border/70 bg-card/70 hover:border-primary/30 hover:bg-card/80"
                      }`}
                    >
                    <div
                      className={cn(
                        "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_38%)] transition-opacity duration-300",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {doc.level === "기밀" && (
                      <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-red-400/95 via-red-500/80 to-red-700/65" />
                    )}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between text-[10px] tracking-[0.18em] text-muted-foreground">
                        <span>
                          {String(documents.findIndex((item) => item.id === doc.id) + 1).padStart(2, "0")} / {String(documents.length).padStart(2, "0")}
                        </span>
                        <span>{isActive ? "ACTIVE FILE" : "ARCHIVE FILE"}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-primary">{doc.id}</span>
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] ${
                                  doc.level === "기밀"
                                    ? "border border-red-400/45 bg-red-500/20 text-red-200"
                                    : doc.level === "보통"
                                    ? "border border-sky-400/40 bg-sky-500/15 text-sky-200"
                                    : "border border-border/70 bg-secondary/70 text-foreground/85"
                                }`}
                              >
                                {doc.level}
                              </span>
                            </div>
                            <p className="mt-0.5 line-clamp-1 text-[15px] leading-5 text-foreground sm:text-sm sm:leading-normal">{doc.title}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{doc.date}</span>
                      </div>
                      <p className="line-clamp-2 text-[12px] leading-5 text-muted-foreground sm:text-[11px] sm:leading-normal">{doc.summary}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] tracking-[0.14em] text-primary/85">
                          {isActive ? "SELECTED RECORD" : "TAP TO OPEN"}
                        </p>
                        <div className="flex items-center gap-1 text-primary/70">
                          <span className="text-[10px] tracking-widest">NEXT</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-secondary/80">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-300",
                            isActive ? "bg-primary shadow-[0_0_10px_rgba(56,189,248,0.65)]" : "bg-primary/30"
                          )}
                          style={{ width: `${((selectedDocIndex + 1) / documents.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    </button>
                  </CarouselItem>
                )
              })}
              </CarouselContent>
            </Carousel>
          </div>

          <div className="mt-2 flex items-center justify-center gap-1.5 lg:hidden">
            {documents.map((doc, index) => {
              const isActive = doc.id === mobileSelectedDocId
              return (
                <button
                  key={doc.id}
                  type="button"
                  aria-label={`${index + 1}번째 문서 보기`}
                  onClick={() => {
                    setMobileSelectedDocId(doc.id)
                    mobileCarouselApi?.scrollTo(index)
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-200",
                    isActive ? "w-7 bg-primary shadow-[0_0_10px_rgba(56,189,248,0.65)]" : "w-2 bg-border"
                  )}
                />
              )
            })}
          </div>

          <div className="mt-3 hidden lg:block lg:space-y-3 lg:overflow-y-auto lg:pr-1">
          {documents.map((doc) => {
            const isActive = selectedDocId === doc.id

            return (
              <button
                type="button"
                key={doc.id}
                onClick={() => {
                  setSelectedDocId(doc.id)
                  if (window.innerWidth < 1024) {
                    detailPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                }}
                className={`group relative w-[84vw] shrink-0 cursor-pointer overflow-hidden rounded-xl border p-3 text-left transition-all sm:w-[68vw] lg:w-full lg:p-4 ${
                  isActive
                    ? "border-primary/55 bg-primary/12 shadow-[0_0_0_1px_rgba(56,189,248,0.25)]"
                    : "border-border/70 bg-card/70 hover:border-primary/30 hover:bg-card/80"
                }`}
              >
                {doc.level === "기밀" && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-red-400/95 via-red-500/80 to-red-700/65" />
                )}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between lg:gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-primary">{doc.id}</span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] ${
                            doc.level === "기밀"
                              ? "border border-red-400/45 bg-red-500/20 text-red-200"
                              : doc.level === "보통"
                              ? "border border-sky-400/40 bg-sky-500/15 text-sky-200"
                              : "border border-border/70 bg-secondary/70 text-foreground/85"
                          }`}
                        >
                          {doc.level}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-sm text-foreground">{doc.title}</p>
                      <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground lg:hidden">{doc.summary}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{doc.date}</span>
                </div>
                {isActive && (
                  <p className="mt-2 text-[10px] tracking-[0.14em] text-primary lg:hidden">SELECTED RECORD</p>
                )}
              </button>
            )
          })}
          </div>
        </div>

        <article
          ref={detailPanelRef}
          className={cn(
            "relative order-1 flex min-h-[340px] flex-col overflow-visible rounded-[1.4rem] border border-border/70 bg-card/80 transition-all duration-500 lg:order-2 lg:min-h-[260px] lg:overflow-hidden",
            detailPulse && "border-primary/40 shadow-[0_0_0_1px_rgba(56,189,248,0.18),0_14px_36px_rgba(15,23,42,0.28)]"
          )}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_70%)] opacity-80" />
          {selectedDoc.level === "기밀" && (
            <div className="h-1 w-full bg-gradient-to-r from-red-500/85 via-red-400/70 to-transparent" />
          )}
          <div className="border-b border-border/70 p-4 sm:p-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-primary">{selectedDoc.id}</span>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] ${
                  selectedDoc.level === "기밀"
                    ? "border border-red-400/45 bg-red-500/20 text-red-200"
                    : selectedDoc.level === "보통"
                    ? "border border-sky-400/40 bg-sky-500/15 text-sky-200"
                    : "border border-border/70 bg-secondary/70 text-foreground/85"
                }`}
              >
                {selectedDoc.level}
              </span>
              <span className="ml-auto text-[13px] text-muted-foreground sm:text-xs">{selectedDoc.date}</span>
            </div>
            <h3 className="mt-2 text-[18px] font-semibold leading-7 text-foreground sm:text-base sm:leading-normal">{selectedDoc.title}</h3>
            <p className="mt-2 text-[13px] leading-6 text-muted-foreground sm:mt-1 sm:text-xs sm:leading-normal">{selectedDoc.summary}</p>
          </div>

          <div className="archive-scroll flex-1 space-y-2.5 overflow-x-hidden overflow-y-visible p-4 pb-6 text-[12px] leading-6 tracking-[-0.01em] text-foreground/90 sm:text-sm sm:leading-7 lg:overflow-y-auto lg:text-sm lg:leading-relaxed">
            {selectedDoc.content.map((line, index) => {
              if (index >= revealedLineCount) return null

              return (
                <p
                  key={`${selectedDoc.id}-${index}`}
                  className="animate-in fade-in-0 break-keep [overflow-wrap:anywhere] duration-300"
                >
                  {line}
                </p>
              )
            })}

            {revealedLineCount < selectedDoc.content.length && (
              <p className="font-mono text-xs text-primary/80">
                기록 열람 중<span className="animate-pulse">▋</span>
              </p>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("chat")
  const [introReady, setIntroReady] = useState(false)
  const [booting, setBooting] = useState(true)
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    let audioCtx: AudioContext | null = null
    const milestonePlayed = new Set<number>()

    const playTone = (frequency: number, durationMs: number, volume = 0.018) => {
      try {
        const AudioContextCtor: typeof AudioContext | undefined =
          window.AudioContext ??
          (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

        if (!AudioContextCtor) return
        if (!audioCtx) audioCtx = new AudioContextCtor()
        if (audioCtx.state === "suspended") {
          void audioCtx.resume()
        }

        const oscillator = audioCtx.createOscillator()
        const gainNode = audioCtx.createGain()

        oscillator.type = "sine"
        oscillator.frequency.value = frequency
        gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(volume, audioCtx.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + durationMs / 1000)

        oscillator.connect(gainNode)
        gainNode.connect(audioCtx.destination)

        oscillator.start(audioCtx.currentTime)
        oscillator.stop(audioCtx.currentTime + durationMs / 1000 + 0.01)
      } catch {
        // 모바일 자동재생 제한 등으로 실패해도 UI 흐름은 유지한다.
      }
    }

    const durationMs = 1150
    const tickMs = 30
    let elapsed = 0

    const timer = setInterval(() => {
      elapsed += tickMs
      const progress = Math.min(100, Math.round((elapsed / durationMs) * 100))
      setScanProgress(progress)

       const milestones = [25, 50, 75]
       for (const milestone of milestones) {
        if (progress >= milestone && !milestonePlayed.has(milestone)) {
          milestonePlayed.add(milestone)
          playTone(680 + milestone * 4, 55)
        }
      }

      if (elapsed >= durationMs) {
        clearInterval(timer)
        playTone(1040, 80, 0.02)
        setTimeout(() => playTone(1320, 120, 0.02), 90)
        setBooting(false)
        requestAnimationFrame(() => setIntroReady(true))
      }
    }, tickMs)

    return () => {
      clearInterval(timer)
      if (audioCtx && audioCtx.state !== "closed") {
        void audioCtx.close()
      }
    }
  }, [])

  const mobileMenuItems = [
    { id: "chat", label: "아카식", icon: Sparkles },
    { id: "worldview", label: "세계관", icon: Globe },
    { id: "audit", label: "역량", icon: Shield },
    { id: "archive", label: "보관소", icon: Lock },
  ]

  const renderContent = () => {
    switch (activeMenu) {
      case "worldview":
        return <WorldviewPanel />
      case "audit":
        return <AuditPanel />
      case "archive":
        return <ArchivePanel />
      default:
        return <ChatInterface />
    }
  }

  return (
    <div className="flex min-h-screen w-full items-stretch p-2 sm:p-4">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-0 z-40 transition-opacity duration-500",
          booting ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="absolute inset-0 bg-background/90 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="w-full max-w-xs rounded-2xl border border-primary/30 bg-card/85 p-5 shadow-2xl shadow-primary/20">
            <p className="text-center text-[10px] tracking-[0.28em] text-muted-foreground">BIOMETRIC AUTH</p>
            <div className="relative mx-auto mt-4 flex h-28 w-28 items-center justify-center rounded-full border border-primary/25 bg-primary/5">
              <div className="absolute inset-2 rounded-full border border-primary/20" />
              <Fingerprint className="h-12 w-12 text-primary/85" />
              <span
                className="absolute left-3 right-3 h-[2px] rounded-full bg-primary/80 shadow-[0_0_12px_rgba(56,189,248,0.55)] transition-all duration-150"
                style={{ top: `${10 + scanProgress * 0.76}%` }}
              />
            </div>
            <div className="mt-4">
              <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-150"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] tracking-wider text-muted-foreground">
                <span>SCAN</span>
                <span>{scanProgress}%</span>
              </div>
              <p className="mt-2 text-center text-[10px] tracking-[0.18em] text-primary/90">
                {scanProgress < 100 ? "FINGERPRINT VERIFYING" : "ACCESS GRANTED"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "subtle-grid pointer-events-none fixed inset-0 transition-opacity duration-700",
          introReady ? "opacity-[0.08]" : "opacity-0"
        )}
      />
      <div
        className={cn(
          "hidden transition-all duration-500 ease-out lg:flex",
          introReady ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
        )}
        style={{ transitionDelay: introReady ? "80ms" : "0ms" }}
      >
        <Sidebar
          activeMenu={activeMenu}
          onMenuChange={(menu) => setActiveMenu(menu === activeMenu ? "chat" : menu)}
        />
      </div>
      <main
        className={cn(
          "glass-panel relative flex min-h-[calc(100dvh-1rem)] flex-1 flex-col overflow-hidden rounded-2xl border border-border/70 shadow-2xl shadow-black/30 transition-all duration-700 ease-out sm:min-h-[calc(100dvh-2rem)] sm:rounded-3xl",
          introReady ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        )}
      >
        <Header />

        <nav
          className={cn(
            "flex border-b border-border/70 transition-all duration-500 lg:hidden",
            introReady ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          )}
          style={{ transitionDelay: introReady ? "140ms" : "0ms" }}
        >
          {mobileMenuItems.map((item) => {
            const isActive = activeMenu === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-1.5 py-3 text-[10px] font-medium tracking-widest transition-all duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {isActive && (
                  <>
                    <span className="absolute inset-x-2 top-0 h-[2px] rounded-b-full bg-primary/80 shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
                    <span className="absolute inset-0 bg-primary/[0.05]" />
                  </>
                )}
                <span
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-primary/15 shadow-[0_0_14px_rgba(56,189,248,0.35)]"
                      : "bg-secondary/60"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-[17px] w-[17px] transition-all",
                      isActive && "drop-shadow-[0_0_5px_rgba(56,189,248,0.9)]"
                    )}
                  />
                </span>
                <span className="relative">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div
          className={cn(
            "flex-1 overflow-hidden transition-all duration-700",
            introReady ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          )}
          style={{ transitionDelay: introReady ? "180ms" : "0ms" }}
        >
          {renderContent()}
        </div>

        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-primary/20 via-transparent to-transparent transition-opacity duration-700",
            introReady ? "opacity-0" : "opacity-100"
          )}
        />
      </main>
    </div>
  )
}
