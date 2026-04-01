"use client"

import { type CSSProperties, type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { ChatInterface } from "@/components/dashboard/chat-interface"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { dashboardMenuItems } from "../lib/dashboard-menu"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Globe, Shield, Lock, FileText, Users, AlertTriangle, Fingerprint, Sparkles, ChevronRight, X } from "lucide-react"

function GlassShatterOverlay({ active }: { active: boolean }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!active || !mounted) return null

  const segments = Array.from({ length: 8 }, (_, i) => {
    const angle = -90 + i * 45
    const radians = (angle * Math.PI) / 180
    const radius = 10.8
    const cx = 50 + Math.cos(radians) * radius
    const cy = 50 + Math.sin(radians) * radius
    const drift = i % 2 === 0 ? 9.5 : 12
    const tx1 = Math.cos(radians) * drift
    const ty1 = Math.sin(radians) * drift

    return (
      <div
        key={i}
        className="glass-segment"
        style={{
          left: `${cx}%`,
          top: `${cy}%`,
          "--segment-rot": `${angle + 90}deg`,
          "--segment-rot-end": `${angle + 112}deg`,
          "--segment-tx": `${tx1}vmin`,
          "--segment-ty": `${ty1}vmin`,
          animationDelay: `${i * 18}ms`,
          animationDuration: `${460 + i * 18}ms`,
        } as CSSProperties}
      />
    )
  })

  const brackets = [
    { left: "calc(50% - 10.5vmin)", top: "calc(50% - 10.5vmin)", rotate: "0deg" },
    { left: "calc(50% + 10.5vmin)", top: "calc(50% - 10.5vmin)", rotate: "90deg" },
    { left: "calc(50% + 10.5vmin)", top: "calc(50% + 10.5vmin)", rotate: "180deg" },
    { left: "calc(50% - 10.5vmin)", top: "calc(50% + 10.5vmin)", rotate: "270deg" },
  ]

  return createPortal(
    <div className="glass-shatter-overlay" aria-hidden>
      <div className="glass-bio-core">
        <div className="glass-bio-ring glass-bio-ring-outer" />
        <div className="glass-bio-ring glass-bio-ring-mid" />
        <div className="glass-bio-ring glass-bio-ring-inner" />
        <div className="glass-bio-grid" />
        <div className="glass-bio-scan-beam" />
      </div>
      {brackets.map((bracket, index) => (
        <div
          key={index}
          className="glass-bio-bracket"
          style={{
            left: bracket.left,
            top: bracket.top,
            "--bracket-rot": bracket.rotate,
            animationDelay: `${index * 16}ms`,
          } as CSSProperties}
        />
      ))}
      <div className="glass-core-pulse" />
      <div className="glass-impact-flash" />
      <div className="glass-refraction-halo" />
      <div className="glass-shockwave-1" />
      <div className="glass-data-shear" />
      {segments}
    </div>,
    document.body
  )
}

function WorldviewPanel({ introActive = false, aftermathActive = false }: { introActive?: boolean; aftermathActive?: boolean }) {
  const worldviewData = [
    { label: "등록된 세계", value: "147", change: "+3" },
    { label: "관측 중인 이상현상", value: "23", change: "+1" },
    { label: "활성 게이트", value: "8", change: "0" },
  ]

  return (
    <div
      className={cn(
        "worldview-vault relative flex h-full min-h-0 flex-col overflow-y-auto p-4 sm:p-6 lg:overflow-hidden",
        introActive && "worldview-intro-live",
        aftermathActive && "worldview-afterglow-live"
      )}
    >
      <div
        aria-hidden
        className={cn(
          "worldview-intro-overlay pointer-events-none absolute inset-0 z-20 transition-opacity duration-500",
          introActive ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="worldview-intro-backdrop absolute inset-0" />
        <div className="worldview-intro-panel absolute inset-x-4 top-4 overflow-hidden rounded-[1.5rem] border border-sky-300/20 px-5 py-5 sm:inset-x-6 sm:top-6 sm:px-6 sm:py-6">
          <div className="worldview-intro-stars absolute inset-0" />
          <div className="worldview-intro-orbit worldview-intro-orbit-a absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full" />
          <div className="worldview-intro-orbit worldview-intro-orbit-b absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full" />
          <div className="worldview-intro-scan absolute inset-x-0 top-0 h-full" />
          <div className="worldview-intro-grid absolute inset-0" />
          <p className="worldview-intro-kicker text-[10px] tracking-[0.32em] text-sky-200/80">OBSERVATION ARRAY SYNCHRONIZED</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="worldview-intro-title text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-3xl">관측 좌표를 전개합니다.</p>
              <p className="worldview-intro-summary mt-2 max-w-xl text-sm leading-6 text-slate-200/70">세계선, 게이트, 이상현상 좌표를 성도처럼 재구성해 열람 영역을 활성화합니다.</p>
            </div>
            <div className="rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-1 text-[10px] tracking-[0.22em] text-sky-100/80">
              STAR MAP ONLINE
            </div>
          </div>
        </div>
      </div>

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

function AuditPanel({
  introActive = false,
  introStage = 0,
  aftermathActive = false,
}: {
  introActive?: boolean
  introStage?: number
  aftermathActive?: boolean
}) {
  const isMobile = useIsMobile()
  const waveStyle = (order: number, extra?: CSSProperties): CSSProperties => ({
    ...(extra ?? {}),
    "--wave-order": order,
  } as CSSProperties)

  const throneArchives = [
    {
      realm: "엘모라",
      code: "ELMORA EXECUTIVE CONSTELLATION",
      summary: "협회 체계를 지배하는 찬탈자와 각 협회의 천칭, 천축 계열을 봉인 기록한 고위직 명부.",
      accent: "from-sky-400/18 via-cyan-400/8 to-transparent",
      organizations: [
        {
          name: "월식협회",
          code: "ECLIPSE ORDER",
          theme: "border-sky-400/20 bg-sky-500/10 text-sky-100",
          positions: [
            {
              title: "일요의 찬탈자",
              domain: "『정점』",
              holders: [
                {
                  seal: "SUN-US",
                  holder: "현좌 미공개",
                  state: "봉인 유지",
                  succession: "기록 봉인",
                  chronicle: "진의 권좌 기록이 유지되고 있습니다.",
                },
              ],
            },
            {
              title: "월요의 찬탈자",
              domain: "『정점』",
              holders: [
                {
                  seal: "MON-US",
                  holder: "현좌 미공개",
                  state: "현좌 등록",
                  succession: "정통 계승",
                  chronicle: "권좌 기록이 봉인되어 있습니다.",
                },
              ],
            },
          ],
        },
        {
          name: "황혼협회",
          code: "TWILIGHT ORDER",
          theme: "border-violet-400/20 bg-violet-500/10 text-violet-100",
          positions: [
            {
              title: "황혼의 천칭",
              domain: "『펜리르』",
              holders: [{ seal: "TWI-BL", holder: "현좌 비공개", state: "현좌 등록", succession: "정통 계승", chronicle: "권좌 기록이 봉인되어 있습니다." }],
            },
            {
              title: "황혼의 천축",
              domain: "『글레이프니르』",
              holders: [{ seal: "TWI-AX", holder: "현좌 비공개", state: "현좌 등록", succession: "정통 계승", chronicle: "헨리 아서의 권좌 기록이 유지되고 있습니다." }],
            },
          ],
        },
        {
          name: "여명협회",
          code: "DAYBREAK ORDER",
          theme: "border-amber-400/20 bg-amber-500/10 text-amber-100",
          positions: [
            {
              title: "여명의 천칭",
              domain: "『데스테라』",
              holders: [{ seal: "DAY-BL", holder: "현좌 비공개", state: "현좌 등록", succession: "정통 계승", chronicle: "권좌 기록이 봉인되어 있습니다." }],
            },
            {
              title: "여명의 천축",
              domain: "『달리움』",
              holders: [{ seal: "DAY-AX", holder: "현좌 비공개", state: "봉인 유지", succession: "기록 봉인", chronicle: "엘리르 세레인의 권좌 기록이 유지되고 있습니다." }],
            },
          ],
        },
        {
          name: "서광협회",
          code: "LUMINANCE ORDER",
          theme: "border-emerald-400/20 bg-emerald-500/10 text-emerald-100",
          positions: [
            {
              title: "서광의 천칭",
              domain: "『사서』",
              holders: [{ seal: "LUM-BL", holder: "현좌 비공개", state: "현좌 등록", succession: "정통 계승", chronicle: "시안의 권좌 기록이 유지되고 있습니다." }],
            },
            {
              title: "서광의 천축",
              domain: "『서기』",
              holders: [{ seal: "LUM-AX", holder: "현좌 비공개", state: "현좌 등록", succession: "정통 계승", chronicle: "아바의 권좌 기록이 유지되고 있습니다." }],
            },
          ],
        },
        {
          name: "명멸협회",
          code: "NIGHTFALL ORDER",
          theme: "border-rose-400/20 bg-rose-500/10 text-rose-100",
          positions: [
            {
              title: "명멸의 천칭",
              domain: "『슈나이더』",
              holders: [{ seal: "NIG-BL", holder: "현좌 비공개", state: "현좌 등록", succession: "정통 계승", chronicle: "이드레타의 권좌 기록이 유지되고 있습니다." }],
            },
            {
              title: "명멸의 천축",
              domain: "『에이트리』",
              holders: [{ seal: "NIG-AX", holder: "현좌 비공개", state: "현좌 등록", succession: "정통 계승", chronicle: "권좌 기록이 봉인되어 있습니다." }],
            },
          ],
        },
        {
          name: "해결사",
          code: "FIXER ASCENDANCY",
          theme: "border-primary/25 bg-primary/10 text-primary",
          positions: [
            { title: "화요의 찬탈자", domain: "『불길』", holders: [{ seal: "TUE-US", holder: "현좌 비공개", state: "현좌 등록", succession: "정통 계승", chronicle: "권좌 기록이 봉인되어 있습니다." }] },
            { title: "수요의 찬탈자", domain: "『파도』", holders: [{ seal: "WED-US", holder: "현좌 비공개", state: "현좌 등록", succession: "정통 계승", chronicle: "권좌 기록이 봉인되어 있습니다." }] },
            { title: "목요의 찬탈자", domain: "『바람』", holders: [{ seal: "THU-US", holder: "현좌 비공개", state: "공석 감시", succession: "재지정 대기", chronicle: "권좌 기록이 봉인되어 있습니다." }] },
            { title: "금요의 찬탈자", domain: "『낙뢰』", holders: [{ seal: "FRI-US", holder: "현좌 비공개", state: "현좌 등록", succession: "정통 계승", chronicle: "권좌 기록이 봉인되어 있습니다." }] },
            { title: "토요의 찬탈자", domain: "『대지』", holders: [{ seal: "SAT-US", holder: "현좌 비공개", state: "현좌 등록", succession: "정통 계승", chronicle: "권좌 기록이 봉인되어 있습니다." }] },
          ],
        },
      ],
    },
    {
      realm: "녹타르",
      code: "NOCTAR BLOODLINE LEDGER",
      summary: "네메시스와 뤼네의 상층부. 녹타르를 양분하는 두 조직의 권력 구조를 기록한 명부.",
      accent: "from-fuchsia-400/18 via-rose-400/8 to-transparent",
      organizations: [
        {
          name: "네메시스",
          code: "NEMESIS",
          theme: "border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-100",
          positions: [
            {
              title: "카사 프리마",
              domain: "『근원』",
              holders: [
                { seal: "CASA-I", holder: "현좌 비공개", state: "혈통 유지", succession: "혈통 계승", chronicle: "권좌 기록이 봉인되어 있습니다." },
                { seal: "CASA-II", holder: "현좌 비공개", state: "혈통 유지", succession: "혈통 계승", chronicle: "권좌 기록이 봉인되어 있습니다." },
              ],
            },
            {
              title: "카르멘",
              domain: "『집정관』",
              holders: [
                { seal: "CARM-I", holder: "현좌 비공개", state: "현좌 등록", succession: "혈통 계승", chronicle: "셰니안의 권좌 기록이 유지되고 있습니다." },
                { seal: "CARM-II", holder: "현좌 비공개", state: "현좌 등록", succession: "혈통 계승", chronicle: "권좌 기록이 봉인되어 있습니다." },
                { seal: "CARM-III", holder: "현좌 비공개", state: "변이 계승", succession: "포식 승계", chronicle: "권좌 기록이 봉인되어 있습니다." },
              ],
            },
          ],
        },
        {
          name: "뤼네",
          code: "LUINAE",
          theme: "border-rose-400/20 bg-rose-500/10 text-rose-100",
          positions: [
            {
              title: "헤더 뤼네",
              domain: "『승천자』",
              holders: [
                { seal: "HEA-I", holder: "현좌 비공개", state: "혈통 유지", succession: "혈통 계승", chronicle: "이벨리스의 권좌 기록이 유지되고 있습니다." },
                { seal: "HEA-II", holder: "현좌 비공개", state: "혈통 유지", succession: "혈통 계승", chronicle: "이졸데의 권좌 기록이 유지되고 있습니다." },
              ],
            },
            {
              title: "메시아 뤼네",
              domain: "『날개』",
              holders: [
                { seal: "MES-I", holder: "현좌 비공개", state: "현좌 등록", succession: "혈통 계승", chronicle: "메이블의 권좌 기록이 유지되고 있습니다." },
                { seal: "MES-II", holder: "현좌 비공개", state: "현좌 등록", succession: "혈통 계승", chronicle: "권좌 기록이 봉인되어 있습니다." },
              ],
            },
          ],
        },
      ],
    },
  ]

  const totalOrganizations = throneArchives.reduce((sum, realm) => sum + realm.organizations.length, 0)
  const totalTitles = throneArchives.reduce(
    (sum, realm) => sum + realm.organizations.reduce((inner, organization) => inner + organization.positions.length, 0),
    0
  )
  const totalSeats = throneArchives.reduce(
    (sum, realm) =>
      sum +
      realm.organizations.reduce(
        (inner, organization) =>
          inner + organization.positions.reduce((seatSum, position) => seatSum + position.holders.length, 0),
        0
      ),
    0
  )
  const seatDistribution = throneArchives.map((realm) => {
    const seats = realm.organizations.reduce(
      (sum, organization) => sum + organization.positions.reduce((seatSum, position) => seatSum + position.holders.length, 0),
      0
    )

    return {
      realm: realm.realm,
      seats,
      ratio: Math.round((seats / totalSeats) * 100),
    }
  })
  const elmoraOrganizations = throneArchives.find((realm) => realm.realm === "엘모라")?.organizations.filter((organization) => organization.code !== "FIXER ASCENDANCY") ?? []
  const fixerClaimants = throneArchives
    .flatMap((realm) => realm.organizations)
    .find((organization) => organization.code === "FIXER ASCENDANCY")?.positions ?? []
  const noctarOrganizations = throneArchives.find((realm) => realm.realm === "녹타르")?.organizations ?? []
  const elmoraSeatCount = elmoraOrganizations.reduce(
    (sum, organization) => sum + organization.positions.reduce((inner, position) => inner + position.holders.length, 0),
    0
  )
  const elmoraAxisCount = elmoraOrganizations
    .filter((organization) => organization.code !== "ECLIPSE ORDER")
    .reduce((sum, organization) => sum + organization.positions.length, 0)
  const elmoraSealedCount = elmoraOrganizations.reduce(
    (sum, organization) =>
      sum +
      organization.positions.reduce(
        (inner, position) => inner + position.holders.filter((holder) => holder.state.includes("봉인")).length,
        0
      ),
    0
  )
  const fixerVacantCount = fixerClaimants.reduce(
    (sum, position) => sum + position.holders.filter((holder) => holder.state.includes("공석") || holder.succession.includes("대기")).length,
    0
  )
  const fixerSignalDomains = fixerClaimants.map((position) => position.domain.replace(/[『』]/g, ""))
  const noctarSeatCount = noctarOrganizations.reduce(
    (sum, organization) => sum + organization.positions.reduce((inner, position) => inner + position.holders.length, 0),
    0
  )
  const noctarBloodCount = noctarOrganizations.reduce(
    (sum, organization) =>
      sum +
      organization.positions.reduce(
        (inner, position) => inner + position.holders.filter((holder) => holder.state.includes("혈통")).length,
        0
      ),
    0
  )
  const noctarMutationCount = noctarOrganizations.reduce(
    (sum, organization) =>
      sum +
      organization.positions.reduce(
        (inner, position) => inner + position.holders.filter((holder) => holder.state.includes("변이") || holder.succession.includes("포식")).length,
        0
      ),
    0
  )
  const mobileHeroHighlights = [
    { label: "LUNAR USURPER", detail: "정점 포함 찬탈자 7석" },
    { label: "BALANCE / AXIS", detail: "사대협회 천칭 및 천축 8석" },
    { label: "NOCTAR OVERLORDS", detail: "네메시스와 뤼네 상층 9석" },
    { label: "ACCESS GRADE", detail: "알파 등급 이상 열람 허가" },
  ]
  const [portalMounted, setPortalMounted] = useState(false)
  useEffect(() => { setPortalMounted(true) }, [])

  const [selectedThrone, setSelectedThrone] = useState<null | {
    realm: string
    realmCode: string
    organizationName: string
    organizationCode: string
    organizationTheme: string
    organizationSeats: number
    positionTitle: string
    positionDomain: string
    holderSeal: string
    holderName: string
    holderState: string
    holderSuccession: string
    holderChronicle: string
  }>(null)

  const openThroneDetails = ({
    realm,
    realmCode,
    organizationName,
    organizationCode,
    organizationTheme,
    organizationSeats,
    positionTitle,
    positionDomain,
    holder,
  }: {
    realm: string
    realmCode: string
    organizationName: string
    organizationCode: string
    organizationTheme: string
    organizationSeats: number
    positionTitle: string
    positionDomain: string
    holder: {
      seal: string
      holder: string
      state: string
      succession: string
      chronicle: string
    }
  }) => {
    setSelectedThrone({
      realm,
      realmCode,
      organizationName,
      organizationCode,
      organizationTheme,
      organizationSeats,
      positionTitle,
      positionDomain,
      holderSeal: holder.seal,
      holderName: holder.holder,
      holderState: holder.state,
      holderSuccession: holder.succession,
      holderChronicle: holder.chronicle,
    })
  }

  const throneDetailBody = selectedThrone ? (
    <div className="throne-detail-panel throne-detail-scan space-y-3">
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {[
          { label: "직위", value: selectedThrone.positionTitle },
          { label: "칭호", value: selectedThrone.positionDomain },
          { label: "소속 좌석", value: `${selectedThrone.organizationSeats} SEATS` },
        ].map((item) => (
          <div key={item.label} className="throne-detail-card rounded-[0.9rem] border border-white/8 px-2.5 py-2.5 sm:px-3 sm:py-3">
            <p className="text-[9.5px] tracking-[0.18em] text-muted-foreground/70 uppercase">{item.label}</p>
            <p className="mt-1.5 text-[12px] font-medium leading-5 text-foreground sm:mt-2 sm:text-[13px] sm:leading-6">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        <div className="throne-detail-card rounded-[0.9rem] border border-white/8 px-3 py-2.5 sm:py-3">
          <p className="text-[9.5px] tracking-[0.18em] text-muted-foreground/70 uppercase">현좌 상태</p>
          <p className="mt-1.5 text-[12px] font-medium leading-5 text-foreground sm:mt-2 sm:text-sm sm:leading-6">{selectedThrone.holderState}</p>
        </div>
        <div className="throne-detail-card rounded-[0.9rem] border border-white/8 px-3 py-2.5 sm:py-3">
          <p className="text-[9.5px] tracking-[0.18em] text-muted-foreground/70 uppercase">승계 형식</p>
          <p className="mt-1.5 text-[12px] font-medium leading-5 text-foreground sm:mt-2 sm:text-sm sm:leading-6">{selectedThrone.holderSuccession}</p>
        </div>
      </div>

      <div className="throne-detail-chronicle rounded-[1rem] border border-white/8 px-3.5 py-3.5 sm:px-4 sm:py-4">
        <p className="text-[9.5px] tracking-[0.22em] text-primary/70 uppercase">의전 기록</p>
        <p className="mt-2.5 text-[12.5px] leading-7 text-foreground/90 sm:text-[13px]">{selectedThrone.holderChronicle}</p>
      </div>
    </div>
  ) : null

  return (
    <div
      className={cn(
        "throne-vault relative flex h-full min-h-0 flex-col overflow-y-auto p-4 sm:p-6 lg:overflow-hidden",
        introActive && "throne-activation-live",
        aftermathActive && "throne-afterglow-live",
        introStage === 1 && "throne-stage-one",
        introStage === 2 && "throne-stage-two",
        introStage >= 3 && "throne-stage-three"
      )}
    >
      {selectedThrone && portalMounted ? createPortal(
        <div className="throne-detail-backdrop fixed inset-0 z-[70] flex items-center justify-center lg:pl-72" onClick={() => setSelectedThrone(null)}>
          <div
            className={cn(
              "throne-detail-shell flex flex-col overflow-hidden",
              isMobile
                ? "throne-detail-animated-mobile absolute inset-x-0 bottom-0 max-h-[80vh] rounded-t-[1.75rem]"
                : "throne-detail-animated-desktop relative w-[min(44rem,calc(100%-2rem))] max-h-[84vh] rounded-[1.6rem]"
            )}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="throne-detail-corners pointer-events-none absolute inset-0 z-10" aria-hidden />

            {isMobile && (
              <div className="relative z-10 flex justify-center pb-1 pt-3" aria-hidden>
                <div className="h-1 w-9 rounded-full bg-white/20" />
              </div>
            )}

            <div className={cn("relative z-10 shrink-0 border-b border-white/8", isMobile ? "px-4 pb-4 pt-3" : "px-6 pb-5 pt-6")}>
              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[10px] tracking-[0.2em] text-primary">
                  {selectedThrone.realm}
                </span>
                <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] tracking-[0.2em]", selectedThrone.organizationTheme)}>
                  {selectedThrone.organizationName}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-foreground/55">
                  {selectedThrone.holderSeal}
                </span>
                <span className="ml-auto rounded-full border border-primary/15 bg-primary/[0.07] px-2.5 py-0.5 text-[9px] tracking-[0.26em] text-primary/80">
                  LEVEL ALPHA
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={cn("throne-detail-title font-semibold tracking-[-0.035em] text-foreground", isMobile ? "text-[1.2rem] leading-tight" : "text-[1.5rem] leading-tight")}>{selectedThrone.positionTitle}</p>
                  <p className={cn("mt-1.5 font-mono text-muted-foreground/60", isMobile ? "text-[10.5px] tracking-[0.18em]" : "text-[11.5px] tracking-[0.2em]")}>
                    {selectedThrone.organizationCode} · {selectedThrone.realmCode}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedThrone(null)}
                  className="mt-0.5 shrink-0 rounded-full border border-white/10 bg-white/[0.04] p-2 text-muted-foreground/70 transition-colors hover:bg-white/10 hover:text-foreground"
                  aria-label="권좌 상세 닫기"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className={cn("relative z-10 flex-1 min-h-0 overflow-y-auto", isMobile ? "px-4 pb-8 pt-4" : "px-6 pb-6 pt-5")}>
              {throneDetailBody}
            </div>
          </div>
        </div>
      , document.body) : null}

      <div
        aria-hidden
        className={cn(
          "throne-intro-overlay pointer-events-none absolute inset-0 z-30 transition-opacity duration-500",
          introActive ? "opacity-100" : "opacity-0"
        )}
      >
        <div
          className={cn(
            "throne-intro-panel absolute inset-x-3 top-3 rounded-[1.55rem] border border-primary/25 p-4 sm:inset-x-6 sm:top-6 sm:rounded-[1.8rem] sm:p-6",
            introStage === 1 && "throne-intro-panel-stage-one",
            introStage === 2 && "throne-intro-panel-stage-two",
            introStage >= 3 && "throne-intro-panel-stage-three"
          )}
        >
          <div className="throne-intro-flash absolute inset-0" />
          <div className="throne-seal-rings absolute inset-0" />
          <div className="throne-intro-grid absolute inset-0" />
          <div className="throne-intro-scan absolute inset-x-0 top-0 h-full" />
          <div className="throne-intro-shards absolute inset-0">
            <span className="throne-intro-shard throne-intro-shard-a" />
            <span className="throne-intro-shard throne-intro-shard-b" />
            <span className="throne-intro-shard throne-intro-shard-c" />
          </div>
          <p className="throne-intro-kicker text-[10px] tracking-[0.34em] text-primary/80">THRONE REGISTRY UNSEALED</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div>
              <p className="throne-intro-title text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-3xl">권좌 봉인을 해제합니다.</p>
              <p className="throne-intro-summary mt-2 text-sm leading-6 text-muted-foreground">상층 권좌, 찬탈 기록, 포식 승계 이력까지 의전 로그를 전개합니다.</p>
            </div>
            <div className="hidden rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] tracking-[0.24em] text-primary sm:block">
              ACCESS ALPHA
            </div>
          </div>
          <div className="relative mt-5 space-y-3 sm:max-w-[25.5rem]">
            {[
              ["01", "SEAL ROUTE", "봉인 해제 절차 개시"],
              ["02", "CHAIN BREAK", "구속 해제 절차 개시"],
              ["03", "THRONE INDEX", " 기록 해제 절차 개시"],
            ].map(([code, label, detail], index) => (
              <div
                key={code}
                className={cn(
                  "throne-intro-step flex min-h-[6.4rem] flex-col justify-between rounded-[1.05rem] border border-white/10 bg-black/15 px-4 py-4 sm:min-h-[6.9rem]",
                  introStage === index + 1 && "is-active",
                  introStage > index + 1 && "is-complete",
                  introStage < index + 1 && "is-pending"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-primary/90">{code}</span>
                  <span className="text-[10px] tracking-[0.16em] text-muted-foreground">{label}</span>
                </div>
                <div className="throne-intro-bar mt-4 h-2 overflow-hidden rounded-full bg-white/8">
                  <span className="block h-full rounded-full bg-gradient-to-r from-primary via-sky-300 to-white" />
                </div>
                <p className="mt-3 text-[11px] leading-5 text-foreground/85 sm:text-[11.5px]">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5 sm:mb-6">
        <h2 className="flex items-center gap-3 text-base font-semibold text-foreground sm:text-lg">
          <Shield className="h-5 w-5 text-primary" />
          권좌 명부
        </h2>
        <p className="mt-1 text-xs tracking-wider text-muted-foreground">
          THRONE REGISTRY
        </p>
      </div>

      <section className="throne-hero throne-glint throne-hero-scan throne-afterglow-target relative overflow-hidden rounded-[1.45rem] border border-primary/20 px-4 py-5 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.75)] sm:rounded-[1.6rem] sm:px-5 sm:py-6" style={waveStyle(0)}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(244,63,94,0.12),transparent_28%)]" />
        <div className="throne-hero-orbit pointer-events-none absolute -right-10 top-1/2 hidden h-40 w-40 -translate-y-1/2 rounded-full border border-primary/15 sm:block" />
        <div className="throne-hero-orbit pointer-events-none absolute -right-4 top-1/2 hidden h-24 w-24 -translate-y-1/2 rounded-full border border-white/10 sm:block" />
        <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent sm:inset-x-6" />
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] tracking-[0.28em] text-primary/80">EXECUTIVE SEAT ARCHIVE</p>
            <h3 className="mt-3 text-[1.45rem] font-semibold leading-tight tracking-[-0.04em] text-foreground sm:text-[2.15rem]">
               고위 권좌들을 하나의 명부로 전개합니다.
            </h3>
            <p className="mt-2 text-[12px] leading-6 text-foreground/90 sm:hidden">
              핵심 권역만 빠르게 훑고, 각 권좌 카드를 아래에서 넘겨가며 열람합니다.
            </p>
            <p className="mt-3 hidden max-w-xl text-sm leading-6 text-muted-foreground sm:block sm:text-[15px]">
              협회의 찬탈자, 천칭과 천축, 녹타르 상층 혈통권, 그리고 포식으로 강탈된 권좌까지. 현좌와 승계 형식을 함께
              기록하는 최상위 열람 구역입니다.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-3 sm:gap-3 xl:min-w-[420px]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-primary">
                <Users className="h-4 w-4" />
                <span className="text-[11px] tracking-[0.18em] text-muted-foreground">소속 기관</span>
              </div>
              <p className="mt-2 text-[1.55rem] font-semibold tracking-[-0.04em] text-foreground sm:mt-3 sm:text-3xl">{totalOrganizations}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-[11px] tracking-[0.18em] text-muted-foreground">직위군</span>
              </div>
              <p className="mt-2 text-[1.55rem] font-semibold tracking-[-0.04em] text-foreground sm:mt-3 sm:text-3xl">{totalTitles}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-primary">
                <Lock className="h-4 w-4" />
                <span className="text-[11px] tracking-[0.18em] text-muted-foreground">지정 권좌</span>
              </div>
              <p className="mt-2 text-[1.55rem] font-semibold tracking-[-0.04em] text-foreground sm:mt-3 sm:text-3xl">{totalSeats}</p>
            </div>
          </div>
        </div>

        <div className="throne-mobile-scroll relative mt-4 flex gap-2.5 overflow-x-auto border-t border-white/10 pt-4 sm:hidden">
          {mobileHeroHighlights.map((item) => (
            <div key={item.label} className="throne-mobile-snap-card min-w-[13.5rem] rounded-[1.15rem] border border-white/10 bg-black/18 p-3.5">
              <p className="text-[10px] tracking-[0.22em] text-primary/75">{item.label}</p>
              <p className="mt-2 text-[13px] leading-6 text-foreground">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="relative mt-5 hidden grid-cols-2 gap-3 border-t border-white/10 pt-4 sm:grid xl:grid-cols-4">
          {mobileHeroHighlights.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-black/15 p-4">
              <p className="text-[10px] tracking-[0.22em] text-primary/75">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-foreground">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-5 grid min-h-0 flex-1 gap-4 lg:mt-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.9fr)] lg:overflow-hidden">
        <div className="space-y-4 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
          {throneArchives.map((realm) => (
            <section
              key={realm.realm}
              className="throne-shell throne-panel-enter throne-afterglow-target relative overflow-hidden rounded-[1.4rem] border border-border/70 p-4 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.65)] sm:p-5"
              style={waveStyle(throneArchives.findIndex((item) => item.realm === realm.realm) + 1, {
                animationDelay: `${throneArchives.findIndex((item) => item.realm === realm.realm) * 120}ms`,
              })}
            >
              <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-100", realm.accent)} />
              <div className="relative">
                <div className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] tracking-[0.24em] text-primary/80">{realm.code}</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">{realm.realm}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{realm.summary}</p>
                  </div>
                  <div className="self-start rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] tracking-[0.2em] text-primary sm:self-auto">
                    {realm.organizations.length} ORGANIZATIONS
                  </div>
                </div>

                <div className="mt-4 grid gap-3 xl:grid-cols-2">
                  {realm.organizations.map((organization) => {
                    const organizationSeats = organization.positions.reduce((sum, position) => sum + position.holders.length, 0)
                    const isFixerArc = organization.code === "FIXER ASCENDANCY"
                    const isEclipseOrder = realm.realm === "엘모라" && organization.code === "ECLIPSE ORDER"

                    return (
                      <article
                        key={organization.name}
                        className={cn(
                          "throne-faction-card throne-panel-enter group relative overflow-hidden rounded-2xl border border-border/70 bg-background/45 p-4 transition-transform duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-background/55",
                          (isFixerArc || isEclipseOrder) && "xl:col-span-2"
                        )}
                        style={{ animationDelay: `${(throneArchives.findIndex((item) => item.realm === realm.realm) * 140) + (realm.organizations.findIndex((item) => item.name === organization.name) * 70)}ms` }}
                      >
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-70" />
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-[10px] tracking-[0.22em] text-muted-foreground">{organization.code}</p>
                            <h4 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-foreground">{organization.name}</h4>
                          </div>
                          <span className={cn("self-start rounded-full border px-2.5 py-1 text-[11px] tracking-[0.16em]", organization.theme)}>
                            {organizationSeats} SEATS
                          </span>
                        </div>

                        {realm.realm === "엘모라" && organization.code === "ECLIPSE ORDER" ? (
                          <div className="mt-4 grid gap-2 sm:hidden">
                            <div className="throne-mobile-summary-card throne-mobile-summary-elmora rounded-[1.1rem] border border-sky-400/15 bg-sky-500/8 p-3.5">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-[10px] tracking-[0.18em] text-sky-100/80">ELMORA CONSTELLATION</p>
                                  <p className="mt-2 text-sm font-medium leading-6 text-foreground">천칭은 기울지 않고, 천축은 흔들리지 않으니.</p>
                                </div>
                                <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-2.5 py-1 text-[10px] tracking-[0.18em] text-sky-100">ELMORA</span>
                              </div>
                              <div className="mt-3 grid grid-cols-3 gap-2">
                                {[
                                  { label: "협회", value: elmoraOrganizations.length, tone: "text-sky-100" },
                                  { label: "천칭·천축", value: elmoraAxisCount, tone: "text-violet-100" },
                                  { label: "봉인", value: elmoraSealedCount, tone: "text-amber-100" },
                                ].map((item) => (
                                  <div key={item.label} className="rounded-xl border border-white/10 bg-black/15 px-2.5 py-2.5">
                                    <p className="text-[10px] tracking-[0.16em] text-muted-foreground">{item.label}</p>
                                    <p className={cn("mt-1.5 text-[1.2rem] font-semibold tracking-[-0.04em]", item.tone)}>{item.value}</p>
                                  </div>
                                ))}
                              </div>
                              <p className="mt-3 text-[12px] leading-5 text-muted-foreground">엘모라 상층 {elmoraSeatCount}석. 월식 정점과 사대협회 천칭·천축으로 구성된다.</p>
                            </div>
                          </div>
                        ) : null}

                        {isFixerArc ? (
                          <>
                            <div className="mt-4 grid gap-2 sm:hidden">
                              <div className="throne-mobile-summary-card throne-mobile-summary-fixer rounded-[1.1rem] border border-primary/20 bg-primary/10 p-3.5">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-[10px] tracking-[0.18em] text-primary/80">FIVE USURPERS</p>
                                    <p className="mt-2 text-sm font-medium leading-6 text-foreground">월식의 가호 아래 명멸의 검을 휘두르고.</p>
                                  </div>
                                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] tracking-[0.18em] text-primary">FIXER ARC</span>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                  {fixerSignalDomains.map((domain) => (
                                    <span key={domain} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-foreground/90">{domain}</span>
                                  ))}
                                </div>
                                <p className="mt-3 text-[12px] leading-5 text-muted-foreground">실전형 권좌 {fixerClaimants.length}석. 공석 감시는 {fixerVacantCount}석이며, 다섯 기능축으로 분산된다.</p>
                              </div>
                            </div>

                            <div className="throne-mobile-scroll mt-4 flex gap-2.5 overflow-x-auto pb-1 sm:hidden">
                              {organization.positions.map((position) => {
                                const holder = position.holders[0]

                                return (
                                  <button
                                    key={`${organization.name}-${position.title}-mobile`}
                                    type="button"
                                    onClick={() => holder && openThroneDetails({
                                      realm: realm.realm,
                                      realmCode: realm.code,
                                      organizationName: organization.name,
                                      organizationCode: organization.code,
                                      organizationTheme: organization.theme,
                                      organizationSeats,
                                      positionTitle: position.title,
                                      positionDomain: position.domain,
                                      holder,
                                    })}
                                    className="throne-clickable-seat throne-position-card throne-mobile-snap-card throne-mobile-snap-fixer min-w-[15.2rem] rounded-[1.05rem] border border-white/8 bg-black/16 p-3"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div>
                                        <p className="text-[13px] font-medium leading-5 text-foreground">{position.title}</p>
                                        <p className="mt-1 text-[10px] tracking-[0.14em] text-muted-foreground">{position.domain}</p>
                                      </div>
                                      <span className="rounded-full border border-primary/15 bg-primary/8 px-2 py-0.5 font-mono text-[10px] text-primary">
                                        {holder?.seal ?? "--"}
                                      </span>
                                    </div>

                                    {holder ? (
                                      <div className="mt-3 space-y-2">
                                        <p className="text-[10px] tracking-[0.14em] text-primary/75">{holder.state}</p>
                                        <p className="throne-chronicle-clamp text-[11px] leading-5 text-muted-foreground">{holder.chronicle}</p>
                                      </div>
                                    ) : null}
                                  </button>
                                )
                              })}
                            </div>

                            <div className="mt-4 hidden gap-2 sm:grid sm:grid-cols-2 xl:grid-cols-5">
                              {organization.positions.map((position, positionIndex) => {
                              const holder = position.holders[0]

                              return (
                                <button
                                  key={`${organization.name}-${position.title}`}
                                  type="button"
                                  onClick={() => holder && openThroneDetails({
                                    realm: realm.realm,
                                    realmCode: realm.code,
                                    organizationName: organization.name,
                                    organizationCode: organization.code,
                                    organizationTheme: organization.theme,
                                    organizationSeats,
                                    positionTitle: position.title,
                                    positionDomain: position.domain,
                                    holder,
                                  })}
                                  className="throne-clickable-seat throne-position-card throne-panel-enter rounded-[1.05rem] border border-white/8 bg-black/14 p-3"
                                  style={{ animationDelay: `${220 + positionIndex * 55}ms` }}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <p className="text-[13px] font-medium leading-5 text-foreground">{position.title}</p>
                                      <p className="mt-1 text-[10px] tracking-[0.14em] text-muted-foreground">{position.domain}</p>
                                    </div>
                                    <span className="rounded-full border border-primary/15 bg-primary/8 px-2 py-0.5 font-mono text-[10px] text-primary">
                                      {holder?.seal ?? "--"}
                                    </span>
                                  </div>

                                  {holder ? (
                                    <div className="mt-3 space-y-2">
                                      <p className="text-[11px] text-muted-foreground">{holder.chronicle}</p>
                                    </div>
                                  ) : null}
                                </button>
                              )
                            })}
                            </div>
                          </>
                        ) : isEclipseOrder ? (
                          <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
                            <div className="rounded-[1.15rem] border border-sky-400/15 bg-sky-500/8 p-3">
                              <p className="text-[10px] tracking-[0.18em] text-sky-100/80">LUNAR SUMMIT</p>
                              <p className="mt-2 text-sm leading-6 text-foreground/90">
                                엘모라 정상부의 시작점. 일요와 월요 찬탈자는 다른 협회 축보다 상위에 놓이는 월식령 직결 권좌다.
                              </p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {Array.from(new Set(organization.positions.map((position) => position.domain))).map((domain) => (
                                  <span key={domain} className="rounded-full border border-sky-300/15 bg-white/[0.04] px-2.5 py-1 text-[11px] text-sky-100/90">
                                    {domain}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="grid gap-2 md:grid-cols-2">
                              {organization.positions.map((position, positionIndex) => (
                                <div
                                  key={`${organization.name}-${position.title}`}
                                  className="throne-position-card throne-panel-enter rounded-[1.1rem] border border-white/8 bg-black/14 p-3"
                                  style={{ animationDelay: `${210 + positionIndex * 60}ms` }}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <p className="text-sm font-medium leading-6 text-foreground">{position.title}</p>
                                      <p className="text-[11px] tracking-[0.14em] text-muted-foreground">{position.domain}</p>
                                    </div>
                                    <span className="rounded-full border border-sky-300/15 bg-sky-500/10 px-2.5 py-1 font-mono text-[11px] text-sky-100">
                                      {position.holders.length.toString().padStart(2, "0")}
                                    </span>
                                  </div>

                                  <div className="mt-3 space-y-2">
                                    {position.holders.map((holder) => (
                                      <button
                                        key={holder.seal}
                                        type="button"
                                        onClick={() => openThroneDetails({
                                          realm: realm.realm,
                                          realmCode: realm.code,
                                          organizationName: organization.name,
                                          organizationCode: organization.code,
                                          organizationTheme: organization.theme,
                                          organizationSeats,
                                          positionTitle: position.title,
                                          positionDomain: position.domain,
                                          holder,
                                        })}
                                        className="throne-clickable-seat throne-seat-shell block w-full rounded-xl border px-3 py-3 text-left"
                                      >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                          <span className="font-mono text-[11px] tracking-[0.16em] text-sky-100/90">{holder.seal}</span>
                                        </div>
                                        <p className="throne-chronicle-clamp mt-2 text-[12px] leading-6 text-muted-foreground">{holder.chronicle}</p>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 space-y-2.5">
                            {organization.positions.map((position) => (
                              <div
                                key={`${organization.name}-${position.title}`}
                                className="throne-position-card rounded-[1.15rem] border border-white/6 bg-black/12 p-3"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-medium leading-6 text-foreground">{position.title}</p>
                                    <p className="text-[11px] tracking-[0.14em] text-muted-foreground">{position.domain}</p>
                                  </div>
                                  <span className="rounded-full border border-primary/15 bg-primary/8 px-2.5 py-1 font-mono text-[11px] text-primary">
                                    {position.holders.length.toString().padStart(2, "0")}
                                  </span>
                                </div>

                                <div className="mt-3 space-y-2.5">
                                  {position.holders.map((holder) => (
                                    <button key={holder.seal} type="button" onClick={() => openThroneDetails({
                                      realm: realm.realm,
                                      realmCode: realm.code,
                                      organizationName: organization.name,
                                      organizationCode: organization.code,
                                      organizationTheme: organization.theme,
                                      organizationSeats,
                                      positionTitle: position.title,
                                      positionDomain: position.domain,
                                      holder,
                                    })} className="throne-clickable-seat throne-seat-shell throne-panel-enter block w-full rounded-xl border px-3 py-3 text-left" style={{ animationDelay: `${(realm.organizations.findIndex((item) => item.name === organization.name) * 80) + (position.holders.findIndex((item) => item.seal === holder.seal) * 55)}ms` }}>
                                      <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="font-mono text-[11px] tracking-[0.16em] text-primary/90">{holder.seal}</span>
                                      </div>
                                      <p className="throne-chronicle-clamp mt-2 text-[12px] leading-6 text-muted-foreground">{holder.chronicle}</p>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </article>
                    )
                  })}
                </div>
                {realm.realm === "녹타르" ? (
                  <div className="mt-4 lg:hidden">
                    <section className="throne-mobile-summary-card throne-mobile-summary-noctar overflow-hidden rounded-[1.25rem] border border-fuchsia-400/20 bg-[linear-gradient(135deg,rgba(36,10,34,0.92)_0%,rgba(54,14,44,0.84)_52%,rgba(18,12,34,0.8)_100%)] p-4 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.65)]">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] tracking-[0.24em] text-fuchsia-100/80">NOCTAR BLOODLINE</p>
                          <p className="mt-2 text-base font-semibold tracking-[-0.03em] text-foreground">그곳에서 첫 복수가 터져나왔다.</p>
                        </div>
                        <Fingerprint className="h-4 w-4 text-fuchsia-200" />
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {[
                          { label: "혈통 유지", value: noctarBloodCount, tone: "text-fuchsia-100" },
                          { label: "총 좌석", value: noctarSeatCount, tone: "text-rose-100" },
                          { label: "변이 흔적", value: noctarMutationCount, tone: "text-red-100" },
                        ].map((item) => (
                          <div key={item.label} className="rounded-xl border border-white/8 bg-secondary/25 px-2.5 py-2.5">
                            <p className="text-[10px] tracking-[0.16em] text-muted-foreground">{item.label}</p>
                            <p className={cn("mt-1.5 text-[1.2rem] font-semibold tracking-[-0.04em]", item.tone)}>{item.value}</p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-[12px] leading-5 text-muted-foreground">녹타르는 {noctarOrganizations.length}개 혈계 조직과 {noctarSeatCount}석으로 유지된다. 기본은 혈통, 일부는 포식 흔적을 남긴다.</p>
                    </section>
                  </div>
                ) : null}
              </div>
            </section>
          ))}
        </div>

        <aside className="hidden space-y-4 lg:min-h-0 lg:overflow-y-auto lg:pl-1 lg:block">
          <section className="throne-hero throne-glint throne-panel-enter throne-afterglow-target overflow-hidden rounded-[1.3rem] border border-sky-400/20 p-4 shadow-[0_18px_48px_-28px_rgba(0,0,0,0.72)] sm:rounded-[1.4rem] sm:p-5" style={waveStyle(3, { animationDelay: "90ms" })}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-[0.24em] text-sky-200/80">ELMORA CONSTELLATION</p>
                <p className="mt-2 text-base font-semibold tracking-[-0.03em] text-foreground">천칭은 기울지 않고, 천축은 흔들리지 않으니.</p>
                <p className="mt-2 text-[12px] leading-6 text-muted-foreground">
                  엘모라의 평형은 영원하리라.
                </p>
              </div>
              <div className="rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-[10px] tracking-[0.22em] text-sky-100">
                ELMORA
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { label: "협회", value: elmoraOrganizations.length, tone: "text-sky-100" },
                { label: "천칭·천축", value: elmoraAxisCount, tone: "text-violet-100" },
                { label: "봉인 상태", value: elmoraSealedCount, tone: "text-amber-100" },
              ].map((item, index) => (
                <div key={item.label} className="throne-faction-card throne-panel-enter rounded-[1.15rem] border border-white/10 bg-black/15 px-3 py-3.5" style={{ animationDelay: `${140 + index * 70}ms` }}>
                  <p className="text-[11px] tracking-[0.16em] text-muted-foreground">{item.label}</p>
                  <p className={cn("mt-2 text-2xl font-semibold tracking-[-0.04em]", item.tone)}>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-[1.1rem] border border-white/10 bg-black/12 px-3 py-3">
              <p className="font-mono text-[11px] tracking-[0.16em] text-sky-100/85">EXECUTIVE MASS</p>
              <p className="mt-2 text-[12px] leading-6 text-muted-foreground">
                엘모라 측 고위 좌석은 총 {elmoraSeatCount}석. 월식의 정점과 사대협회의 천칭 및 천축으로 이루어져있다.
              </p>
            </div>
          </section>

          <section className="throne-hero throne-glint throne-panel-enter throne-afterglow-target overflow-hidden rounded-[1.3rem] border border-primary/20 p-4 shadow-[0_18px_48px_-28px_rgba(0,0,0,0.72)] sm:rounded-[1.4rem] sm:p-5" style={waveStyle(4, { animationDelay: "180ms" })}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-[0.24em] text-primary/80">FIVE USURPERS</p>
                <p className="mt-2 text-base font-semibold tracking-[-0.03em] text-foreground">월식의 가호 아래 명멸의 검을 휘두르고.</p>
                <p className="mt-2 text-[12px] leading-6 text-muted-foreground">
                  서광의 인도에 따라 여명과 황혼의 경계를 걸으리.
                </p>
              </div>
              <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] tracking-[0.22em] text-primary">
                FIXER ARC
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="throne-faction-card throne-panel-enter rounded-[1.15rem] border border-white/10 bg-black/15 px-3 py-3.5" style={{ animationDelay: "240ms" }}>
                <p className="text-[11px] tracking-[0.16em] text-muted-foreground">찬탈자</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {fixerSignalDomains.map((domain) => (
                    <span key={domain} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-foreground/90">
                      {domain}
                    </span>
                  ))}
                </div>
              </div>
              <div className="throne-faction-card throne-panel-enter rounded-[1.15rem] border border-white/10 bg-black/15 px-3 py-3.5" style={{ animationDelay: "300ms" }}>
                <p className="text-[11px] tracking-[0.16em] text-muted-foreground">공석</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-primary">{fixerClaimants.length}</p>
                <p className="mt-2 text-[12px] leading-6 text-muted-foreground">실전형 권좌 {fixerClaimants.length}석 중 공석 감시는 {fixerVacantCount}석.</p>
              </div>
            </div>
            <div className="mt-3 rounded-[1.1rem] border border-white/10 bg-black/12 px-3 py-3">
              <p className="font-mono text-[11px] tracking-[0.16em] text-primary/85">FIELD MOTION</p>
              <p className="mt-2 text-[12px] leading-6 text-muted-foreground">
                해결사 권좌는 타격, 추적, 관문, 계약, 종결의 다섯 기능축으로 퍼져 움직인다. 명부보다 현장 흔적이 먼저 남는 계열이다.
              </p>
            </div>
          </section>

          <section className="throne-shell throne-glint throne-panel-enter throne-afterglow-target overflow-hidden rounded-[1.3rem] border border-fuchsia-400/20 p-4 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.65)] sm:rounded-[1.4rem] sm:p-5" style={waveStyle(5, { animationDelay: "260ms" })}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-[0.24em] text-fuchsia-100/80">NOCTAR BLOODLINE</p>
                <p className="mt-2 text-base font-semibold tracking-[-0.03em] text-foreground">그곳에서 첫 복수가 터져나왔다.</p>
              </div>
              <Fingerprint className="h-4 w-4 text-fuchsia-200" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { label: "혈통 유지", value: noctarBloodCount, tone: "text-fuchsia-100" },
                { label: "총 좌석", value: noctarSeatCount, tone: "text-rose-100" },
                { label: "변이 흔적", value: noctarMutationCount, tone: "text-red-100" },
              ].map((item, index) => (
                <div key={item.label} className="throne-faction-card throne-panel-enter rounded-[1.1rem] border border-white/8 bg-secondary/25 px-3 py-3.5" style={{ animationDelay: `${320 + index * 80}ms` }}>
                  <p className="text-[11px] tracking-[0.16em] text-muted-foreground">{item.label}</p>
                  <p className={cn("mt-2 text-2xl font-semibold tracking-[-0.04em]", item.tone)}>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-[1.1rem] border border-white/8 bg-black/12 px-3 py-3">
              <p className="font-mono text-[11px] tracking-[0.16em] text-fuchsia-100/80">BLOOD TIDE</p>
              <p className="mt-2 text-[12px] leading-6 text-muted-foreground">
                녹타르는 {noctarOrganizations.length}개 혈계 조직, {noctarSeatCount}석의 상층 좌석으로 유지된다. 기본 결은 혈통이지만, 일부는 포식 흔적을 남긴다.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

function ArchivePanel({ introActive = false, aftermathActive = false }: { introActive?: boolean; aftermathActive?: boolean }) {
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

  const isMobileViewport = () => typeof window !== "undefined" && window.innerWidth < 1024
  const selectedDoc = documents.find((doc) => doc.id === selectedDocId) ?? documents[0]
  const mobileSelectedDoc = documents.find((doc) => doc.id === mobileSelectedDocId) ?? documents[0]
  const mobileSelectedDocIndex = documents.findIndex((doc) => doc.id === mobileSelectedDocId)

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
  }, [selectedDocId, selectedDoc.content.length])

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
  }, [selectedDocId])

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

  const renderArchiveDetail = (doc: (typeof documents)[number], mobile = false) => {
    const isSecret = doc.level === "기밀"
    const isDesktopActive = doc.id === selectedDocId
    const bodyLines = mobile
      ? doc.content
      : doc.id === selectedDocId
      ? doc.content.slice(0, revealedLineCount)
      : doc.content

    return (
      <article
        className={cn(
          "archive-panel-shell relative flex min-h-[360px] flex-col overflow-hidden rounded-[1.4rem] border border-border/70",
          mobile
            ? "min-h-[420px]"
            : "lg:min-h-[260px]",
          !mobile && detailPulse && isDesktopActive && "border-primary/40 shadow-[0_0_0_1px_rgba(56,189,248,0.18),0_14px_36px_rgba(15,23,42,0.28)]"
        )}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_70%)] opacity-80" />
        {isSecret && (
          <div className="h-1 w-full bg-gradient-to-r from-red-500/85 via-red-400/70 to-transparent" />
        )}
        <div className={cn("border-b border-border/70", mobile ? "p-4" : "p-4")}>
          <div className="flex items-center gap-2">
            <span className="archive-meta font-mono text-[11px] text-primary">{doc.id}</span>
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] ${
                isSecret
                  ? "border border-red-400/45 bg-red-500/20 text-red-200"
                  : doc.level === "보통"
                  ? "border border-sky-400/40 bg-sky-500/15 text-sky-200"
                  : "border border-border/70 bg-secondary/70 text-foreground/85"
              }`}
            >
              {doc.level}
            </span>
            <span className={cn("archive-meta ml-auto text-muted-foreground", mobile ? "text-[10px]" : "text-[13px] sm:text-xs")}>
              {doc.date}
            </span>
          </div>
          <h3 className={cn("archive-heading font-semibold text-foreground", mobile ? "mt-2 text-[17px] leading-6" : "mt-2 text-[18px] leading-7 sm:text-base sm:leading-normal")}>
            {doc.title}
          </h3>
          <p className={cn("archive-summary", mobile ? "mt-2 text-[12px] leading-5" : "mt-2 text-[13px] leading-6 sm:mt-1 sm:text-xs sm:leading-normal")}>
            {doc.summary}
          </p>
        </div>

        <div
          className={cn(
            "archive-scroll flex-1 overflow-x-hidden p-4 text-foreground/90",
            mobile
              ? "archive-body space-y-3 overflow-y-auto text-[12px] leading-6"
              : "archive-body space-y-2.5 overflow-y-visible pb-6 text-[12px] leading-6 tracking-[-0.01em] sm:text-sm sm:leading-7 lg:overflow-y-auto lg:text-sm lg:leading-relaxed"
          )}
        >
          {bodyLines.map((line, index) => (
            <p
              key={`${doc.id}-${index}`}
              className={cn(
                "break-keep [overflow-wrap:anywhere]",
                !mobile && doc.id === selectedDocId && "animate-in fade-in-0 duration-300"
              )}
            >
              {line}
            </p>
          ))}

          {!mobile && doc.id === selectedDocId && revealedLineCount < doc.content.length && (
            <p className="font-mono text-xs text-primary/80">
              기록 열람 중<span className="animate-pulse">▋</span>
            </p>
          )}
        </div>
      </article>
    )
  }

  return (
    <div
      className={cn(
        "archive-vault relative flex h-full flex-col p-4 sm:p-6",
        introActive && "archive-intro-live",
        aftermathActive && "archive-afterglow-live"
      )}
    >
      <div
        aria-hidden
        className={cn(
          "archive-intro-overlay pointer-events-none absolute inset-0 z-20 transition-opacity duration-500",
          introActive ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="archive-intro-backdrop absolute inset-0" />
        <div className="archive-intro-panel isolate absolute inset-x-4 top-4 overflow-hidden rounded-[1.5rem] border border-amber-200/20 px-5 py-5 sm:inset-x-6 sm:top-6 sm:px-6 sm:py-6">
          <div className="archive-intro-vault absolute inset-x-4 top-4 h-[10.5rem] sm:inset-x-6 sm:top-5 sm:h-[12rem]">
            <div className="archive-intro-core absolute inset-[12%] rounded-[1.35rem]">
              <div className="archive-intro-chamber absolute inset-[11%] rounded-[1rem]" />
              <div className="archive-intro-shelves absolute inset-x-[18%] top-[18%] bottom-[18%] flex flex-col justify-between">
                <span className="archive-intro-shelf" />
                <span className="archive-intro-shelf" />
                <span className="archive-intro-shelf" />
              </div>
            </div>
            <div className="archive-intro-spine absolute left-1/2 top-[12%] h-[76%] w-[8%] -translate-x-1/2 rounded-full" />
            <div className="archive-intro-lock absolute left-1/2 top-1/2 z-[3] h-[4.9rem] w-[4.9rem] -translate-x-1/2 -translate-y-1/2 sm:h-[5.6rem] sm:w-[5.6rem]">
              <div className="archive-intro-lock-assembly relative h-full w-full">
                <div className="archive-intro-seal-orbit absolute inset-[-12%] rounded-full" />
                <div className="archive-intro-seal-glyph absolute inset-[6%] rounded-full">
                  <span className="archive-intro-seal-line archive-intro-seal-line-a" />
                  <span className="archive-intro-seal-line archive-intro-seal-line-b" />
                  <span className="archive-intro-seal-line archive-intro-seal-line-c" />
                  <span className="archive-intro-seal-line archive-intro-seal-line-d" />
                </div>
                <div className="archive-intro-lock-ring absolute inset-0 rounded-full" />
                <div className="archive-intro-lock-core absolute inset-[22%] rounded-full" />
                <div className="archive-intro-lock-scan absolute inset-x-[24%] top-1/2 h-[2px] -translate-y-1/2 rounded-full" />
              </div>
            </div>
            <div className="archive-intro-door archive-intro-door-left absolute inset-y-[10%] left-[8%] w-[42%] rounded-[1.2rem]">
              <div className="archive-intro-door-label absolute left-4 top-4 text-[9px] tracking-[0.22em] text-amber-50/55 sm:left-5 sm:top-5">VAULT GATE A</div>
              <div className="archive-intro-wheel absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-16 sm:w-16" />
            </div>
            <div className="archive-intro-door archive-intro-door-right absolute inset-y-[10%] right-[8%] w-[42%] rounded-[1.2rem]">
              <div className="archive-intro-door-label absolute right-4 top-4 text-[9px] tracking-[0.22em] text-amber-50/55 sm:right-5 sm:top-5">VAULT GATE B</div>
              <div className="archive-intro-bolts absolute inset-y-[22%] left-5 flex flex-col justify-between sm:left-6">
                <span className="archive-intro-bolt" />
                <span className="archive-intro-bolt" />
                <span className="archive-intro-bolt" />
              </div>
            </div>
          </div>
          <div className="archive-intro-index absolute inset-0" />
          <div className="archive-intro-scan absolute inset-x-0 top-0 h-full" />
          <div className="archive-intro-seal absolute right-5 top-5 rounded-full border border-amber-200/20 px-3 py-1 text-[10px] tracking-[0.22em] text-amber-100/80 sm:right-6 sm:top-6">
            LEVEL SIGMA
          </div>
          <p className="archive-intro-kicker relative z-[1] pt-[9.25rem] text-[10px] tracking-[0.32em] text-amber-100/75 sm:pt-[10.5rem]">VAULT INDEX DECLASSIFICATION</p>
          <div className="relative z-[1] mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="archive-intro-title text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-3xl">보관소 서가를 재정렬합니다.</p>
              <p className="archive-intro-summary mt-2 max-w-xl text-sm leading-6 text-amber-50/70">문서 봉인 등급과 기록 인덱스를 한 번 더 검증한 뒤 열람 슬롯을 개방합니다.</p>
            </div>
            <div className="rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[10px] tracking-[0.22em] text-amber-100/80">
              INDEXING RECORDS
            </div>
          </div>

          <div className="archive-intro-rail mt-5 grid gap-2 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] sm:gap-3">
            <div className="archive-intro-slots grid gap-2 sm:grid-cols-3">
              {[
                ["01", "SEAL CHECK", "봉인 등급 검증"],
                ["02", "LEDGER TRACE", "열람 경로 대조"],
                ["03", "SHELF UNLOCK", "서가 슬롯 개방"],
              ].map(([code, title, detail]) => (
                <div key={code} className={`archive-intro-slot archive-intro-slot-step-${code} rounded-[1rem] border border-white/10 bg-black/18 px-3.5 py-3.5`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] tracking-[0.18em] text-amber-100/85">{code}</span>
                    <span className="text-[9px] tracking-[0.16em] text-amber-50/55">{title}</span>
                  </div>
                  <div className="archive-intro-slot-bar mt-3 h-[3px] overflow-hidden rounded-full bg-white/8">
                    <span className="archive-intro-slot-fill block h-full rounded-full bg-gradient-to-r from-amber-300 via-amber-100 to-white" />
                  </div>
                  <p className="mt-3 text-[11px] leading-5 text-amber-50/80">{detail}</p>
                </div>
              ))}
            </div>

            <div className="archive-intro-ledger rounded-[1rem] border border-amber-200/12 bg-black/18 px-3.5 py-3.5">
              <p className="text-[10px] tracking-[0.2em] text-amber-100/70">RECORD PATH</p>
              <div className="mt-3 space-y-2.5">
                {[
                  "CLASSIFIED STACK A-13",
                  "AUTHORIZED BY LUMINANCE",
                  "CROSSCHECK: LEDGER / ACCESS / SEAL",
                ].map((line) => (
                  <div key={line} className="archive-intro-ledger-line rounded-lg border border-white/8 px-3 py-2 text-[10px] tracking-[0.15em] text-amber-50/78">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

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
          "archive-mobile-banner mb-3 flex items-center justify-between rounded-xl border border-border/60 px-3 py-2 transition-all duration-500 lg:hidden",
          mobileHintVisible ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-70"
        )}
      >
        <div>
          <p className="archive-kicker text-[10px]">ARCHIVE SLIDE</p>
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

      <div className="lg:hidden">
        <div className="archive-mobile-banner archive-scan mb-3 flex items-center justify-between rounded-xl border border-border/60 px-3 py-3">
          <div>
            <p className="archive-kicker text-[10px]">CURRENT RECORD</p>
            <p className="archive-heading mt-1 text-[15px] leading-5 text-foreground">{mobileSelectedDoc.title}</p>
          </div>
          <div className="text-right">
            <p className="archive-meta text-[10px] text-muted-foreground">{String(mobileSelectedDocIndex + 1).padStart(2, "0")} / {String(documents.length).padStart(2, "0")}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">좌우로 문서를 전환</p>
          </div>
        </div>

        <Carousel
          setApi={setMobileCarouselApi}
          opts={{ align: "start", dragFree: false, containScroll: "trimSnaps", skipSnaps: false }}
          className={cn("transition-transform duration-500", mobileNudgeActive && "translate-x-1")}
        >
          <CarouselContent className="-ml-0">
            {documents.map((doc) => (
              <CarouselItem key={doc.id} className="pl-0">
                {renderArchiveDetail(doc, true)}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-3 flex items-center justify-center gap-1.5">
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
      </div>

      <div className="hidden gap-3 pb-0 lg:grid lg:flex-1 lg:grid-cols-2 lg:overflow-hidden">
        <div className="order-1 lg:space-y-3 lg:overflow-y-auto lg:pr-1">
          {documents.map((doc) => {
            const isActive = selectedDocId === doc.id

            return (
              <button
                type="button"
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`group relative w-[84vw] shrink-0 cursor-pointer overflow-hidden rounded-xl border p-3 text-left transition-all sm:w-[68vw] lg:w-full lg:p-4 ${
                  isActive
                    ? "archive-panel-shell border-primary/55 shadow-[0_0_0_1px_rgba(56,189,248,0.25)]"
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
                        <span className="archive-meta font-mono text-xs text-primary">{doc.id}</span>
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
                      <p className="archive-heading mt-0.5 line-clamp-1 text-sm text-foreground">{doc.title}</p>
                      <p className="archive-summary mt-1 line-clamp-1 text-[11px] lg:hidden">{doc.summary}</p>
                    </div>
                  </div>
                  <span className="archive-meta text-xs text-muted-foreground">{doc.date}</span>
                </div>
                {isActive && (
                  <p className="archive-kicker mt-2 text-primary lg:hidden">SELECTED RECORD</p>
                )}
              </button>
            )
          })}
        </div>

        <div className="order-2 min-h-0">
          {renderArchiveDetail(selectedDoc)}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("chat")
  const [introReady, setIntroReady] = useState(false)
  const [booting, setBooting] = useState(true)
  const [bootShattering, setBootShattering] = useState(false)
  const [worldviewIntroActive, setWorldviewIntroActive] = useState(false)
  const [worldviewAfterglowActive, setWorldviewAfterglowActive] = useState(false)
  const [archiveIntroActive, setArchiveIntroActive] = useState(false)
  const [archiveAfterglowActive, setArchiveAfterglowActive] = useState(false)
  const [auditIntroActive, setAuditIntroActive] = useState(false)
  const [auditIntroStage, setAuditIntroStage] = useState(0)
  const [auditAfterglowActive, setAuditAfterglowActive] = useState(false)
  const [glassShatter, setGlassShatter] = useState(false)
  const previousMenuRef = useRef(activeMenu)

  useEffect(() => {
    const previousMenu = previousMenuRef.current
    previousMenuRef.current = activeMenu
    const compactMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches

    if (activeMenu !== "worldview") {
      setWorldviewIntroActive(false)
      setWorldviewAfterglowActive(false)
    }

    if (activeMenu !== "archive") {
      setArchiveIntroActive(false)
      setArchiveAfterglowActive(false)
    }

    if (activeMenu === "worldview" && previousMenu !== "worldview") {
      setWorldviewIntroActive(true)
      setWorldviewAfterglowActive(false)

      const glowTimer = setTimeout(() => {
        setWorldviewAfterglowActive(true)
      }, compactMobile ? 920 : 1220)

      const closeTimer = setTimeout(() => {
        setWorldviewIntroActive(false)
        setWorldviewAfterglowActive(false)
      }, compactMobile ? 2100 : 2550)

      return () => {
        clearTimeout(glowTimer)
        clearTimeout(closeTimer)
      }
    }

    if (activeMenu === "archive" && previousMenu !== "archive") {
      setArchiveIntroActive(true)
      setArchiveAfterglowActive(false)

      const glowTimer = setTimeout(() => {
        setArchiveAfterglowActive(true)
      }, compactMobile ? 980 : 1320)

      const closeTimer = setTimeout(() => {
        setArchiveIntroActive(false)
        setArchiveAfterglowActive(false)
      }, compactMobile ? 2200 : 2660)

      return () => {
        clearTimeout(glowTimer)
        clearTimeout(closeTimer)
      }
    }

    if (activeMenu !== "audit") {
      setAuditIntroActive(false)
      setAuditIntroStage(0)
      setAuditAfterglowActive(false)
      return
    }

    if (previousMenu === "audit") {
      return
    }

    setAuditIntroActive(true)
    setAuditIntroStage(1)
    setAuditAfterglowActive(false)

    const stageTwoDelay = compactMobile ? 620 : 950
    const stageThreeDelay = compactMobile ? 1260 : 1900
    const aftermathDelay = compactMobile ? 1820 : 2880
    const closeDelay = compactMobile ? 2920 : 4480

    const stageTwoTimer = setTimeout(() => {
      setAuditIntroStage(2)
    }, stageTwoDelay)

    const stageThreeTimer = setTimeout(() => {
      setAuditIntroStage(3)
    }, stageThreeDelay)

    const aftermathTimer = aftermathDelay
      ? setTimeout(() => {
          setAuditAfterglowActive(true)
        }, aftermathDelay)
      : null

    const closeTimer = setTimeout(() => {
      setAuditIntroActive(false)
      setAuditIntroStage(0)
      setAuditAfterglowActive(false)
    }, closeDelay)

    return () => {
      clearTimeout(stageTwoTimer)
      clearTimeout(stageThreeTimer)
      if (aftermathTimer) clearTimeout(aftermathTimer)
      clearTimeout(closeTimer)
    }
  }, [activeMenu])

  // ── 오디오 ────────────────────────────────────────────────────
  const audioCtxRef = useRef<AudioContext | null>(null)

  const getAudioCtx = () => {
    try {
      const Ctor: typeof AudioContext | undefined =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      if (!audioCtxRef.current) audioCtxRef.current = new Ctor()
      if (audioCtxRef.current.state === "suspended") void audioCtxRef.current.resume()
      return audioCtxRef.current
    } catch { return null }
  }

  const playTone = (frequency: number, durationMs: number, volume = 0.018) => {
    const ctx = getAudioCtx()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.value = frequency
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + durationMs / 1000 + 0.01)
    } catch { /* 무시 */ }
  }

  const playGlassShatter = () => {
    const ctx = getAudioCtx()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      const bufferSize = ctx.sampleRate * 0.28
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) ** 1.6
      }
      const noiseSource = ctx.createBufferSource()
      noiseSource.buffer = noiseBuffer
      const hpf = ctx.createBiquadFilter()
      hpf.type = "highpass"
      hpf.frequency.value = 3200
      hpf.Q.value = 0.8
      const bpf = ctx.createBiquadFilter()
      bpf.type = "bandpass"
      bpf.frequency.value = 6800
      bpf.Q.value = 2.2
      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.0001, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.38, now + 0.008)
      noiseGain.gain.exponentialRampToValueAtTime(0.12, now + 0.06)
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28)
      noiseSource.connect(hpf)
      hpf.connect(bpf)
      bpf.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      noiseSource.start(now)
      ;[2200, 3100, 4400, 1800].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.0001, now + i * 0.012)
        gain.gain.exponentialRampToValueAtTime(0.022, now + i * 0.012 + 0.004)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.012 + 0.055)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.012)
        osc.stop(now + i * 0.012 + 0.08)
      })
      for (let i = 0; i < 6; i++) {
        const d = 0.06 + i * 0.055 + Math.random() * 0.04
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.value = 1400 + Math.random() * 1800
        gain.gain.setValueAtTime(0.0001, now + d)
        gain.gain.exponentialRampToValueAtTime(0.014, now + d + 0.003)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + d + 0.055)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + d)
        osc.stop(now + d + 0.08)
      }
    } catch { /* 무시 */ }
  }

  // ── 지문 홀드 입력 ────────────────────────────────────────────
  const [holding, setHolding] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [holdDone, setHoldDone] = useState(false)
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const holdProgressRef = useRef(0)
  const milestonePlayed = useRef(new Set<number>())
  const decayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const holdPointerIdRef = useRef<number | null>(null)

  const HOLD_DURATION_MS = 1400
  const DECAY_RATE = 4

  const startHold = () => {
    if (holdDone || holdTimerRef.current) return
    if (decayTimerRef.current) {
      clearInterval(decayTimerRef.current)
      decayTimerRef.current = null
    }
    // 사용자 제스처 안에서 AudioContext 초기화
    getAudioCtx()
    setHolding(true)

    holdTimerRef.current = setInterval(() => {
      holdProgressRef.current = Math.min(100, holdProgressRef.current + (100 / (HOLD_DURATION_MS / 30)))
      const p = Math.round(holdProgressRef.current)
      setHoldProgress(p)

      for (const milestone of [25, 50, 75]) {
        if (p >= milestone && !milestonePlayed.current.has(milestone)) {
          milestonePlayed.current.add(milestone)
          playTone(680 + milestone * 4, 55)
        }
      }

      if (holdProgressRef.current >= 100) {
        clearInterval(holdTimerRef.current!)
        holdTimerRef.current = null
        setHoldDone(true)
        setHolding(false)
        playTone(1040, 80, 0.02)
        setTimeout(() => playTone(1320, 120, 0.02), 90)
        playGlassShatter()
        setBootShattering(true)
        setGlassShatter(true)
        setTimeout(() => {
          setBooting(false)
          setBootShattering(false)
          requestAnimationFrame(() => setIntroReady(true))
        }, 300)
        setTimeout(() => setGlassShatter(false), 1300)
      }
    }, 30)
  }

  const endHold = () => {
    if (holdDone) return
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current)
      holdTimerRef.current = null
    }
    setHolding(false)
    decayTimerRef.current = setInterval(() => {
      holdProgressRef.current = Math.max(0, holdProgressRef.current - DECAY_RATE)
      const p = Math.round(holdProgressRef.current)
      setHoldProgress(p)
      if (holdProgressRef.current <= 0) {
        clearInterval(decayTimerRef.current!)
        decayTimerRef.current = null
        milestonePlayed.current.clear()
      }
    }, 30)
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (holdDone) return
    holdPointerIdRef.current = event.pointerId
    event.currentTarget.setPointerCapture(event.pointerId)
    startHold()
  }

  const handlePointerRelease = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (holdPointerIdRef.current !== null && event.pointerId !== holdPointerIdRef.current) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    holdPointerIdRef.current = null
    endHold()
  }

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current)
      if (decayTimerRef.current) clearInterval(decayTimerRef.current)
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        void audioCtxRef.current.close()
      }
    }
  }, [])

  const mobileMenuItems = dashboardMenuItems.map((item) => ({
    id: item.id,
    label:
      item.id === "worldview"
        ? "세계관"
        : item.id === "audit"
        ? "권좌"
        : item.id === "archive"
        ? "보관소"
        : item.label,
    icon: item.icon,
  }))

  const renderContent = () => {
    switch (activeMenu) {
      case "worldview":
        return <WorldviewPanel introActive={worldviewIntroActive} aftermathActive={worldviewAfterglowActive} />
      case "audit":
        return <AuditPanel introActive={auditIntroActive} introStage={auditIntroStage} aftermathActive={auditAfterglowActive} />
      case "archive":
        return <ArchivePanel introActive={archiveIntroActive} aftermathActive={archiveAfterglowActive} />
      default:
        return <ChatInterface />
    }
  }

  return (
    <div className="flex min-h-screen w-full items-stretch p-2 sm:p-4">
      <div
        className={cn(
          "fixed inset-0 z-40",
          bootShattering
            ? "boot-shattering pointer-events-none"
            : "transition-opacity duration-500 " + (booting ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")
        )}
      >
        <div className="absolute inset-0 bg-background/90 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="w-full max-w-xs rounded-2xl border border-primary/30 bg-card/85 p-5 shadow-2xl shadow-primary/20">
            <p className="text-center text-[10px] tracking-[0.28em] text-muted-foreground">BIOMETRIC AUTH</p>

            {/* 지문 홀드 버튼 */}
            <div
              className={cn("fingerprint-btn relative mx-auto mt-4 flex h-28 w-28 select-none items-center justify-center rounded-full border border-primary/25 bg-primary/5", holding && "is-holding")}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerRelease}
              onPointerCancel={handlePointerRelease}
              onLostPointerCapture={handlePointerRelease}
              onContextMenu={(event) => event.preventDefault()}
            >
              <div className="absolute inset-2 rounded-full border border-primary/20" />

              {/* 홀드 진행 링 */}
              <div
                className={cn("fingerprint-ring absolute inset-0 rounded-full", holding && "is-holding", holdDone && "is-complete")}
                style={{ "--fp-progress": holdProgress } as React.CSSProperties}
              />

              {/* 리플 애니메이션 */}
              {holding && <div className="fingerprint-ripple absolute inset-0 rounded-full" />}

              <Fingerprint
                className={cn(
                  "h-12 w-12 text-primary/85 transition-transform",
                  holding && "fingerprint-icon-holding",
                  holdDone && "fingerprint-icon-complete"
                )}
              />

              {/* 스캔 라인 */}
              {!holdDone && (
                <span
                  className="absolute left-3 right-3 h-[2px] rounded-full bg-primary/80 shadow-[0_0_12px_rgba(56,189,248,0.55)] transition-all duration-150"
                  style={{ top: `${10 + holdProgress * 0.76}%` }}
                />
              )}
            </div>

            <div className="mt-4">
              <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-150"
                  style={{ width: `${holdProgress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] tracking-wider text-muted-foreground">
                <span>SCAN</span>
                <span>{holdProgress}%</span>
              </div>
              <p className="mt-2 text-center text-[10px] tracking-[0.18em] text-primary/90">
                {holdDone
                  ? "ACCESS GRANTED"
                  : holding
                  ? "VERIFYING..."
                  : holdProgress > 0
                  ? "KEEP HOLDING"
                  : "HOLD TO AUTHENTICATE"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <GlassShatterOverlay active={glassShatter} />

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
