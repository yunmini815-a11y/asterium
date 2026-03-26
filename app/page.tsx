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
  const throneArchives = [
    {
      realm: "엘모라",
      code: "ELMORA EXECUTIVE CONSTELLATION",
      summary: "협회 체계를 지배하는 찬탈자와 각 협회의 천칭, 천축 계열을 봉인 기록한 고위직 명부.",
      accent: "from-sky-400/18 via-cyan-400/8 to-transparent",
      organizations: [
        {
          name: "월식협회",
          code: "LUNAR ECLIPSE",
          theme: "border-sky-400/20 bg-sky-500/10 text-sky-100",
          positions: [
            { title: "일요의 찬탈자", seats: 1 },
            { title: "월요의 찬탈자", seats: 1 },
          ],
        },
        {
          name: "황혼협회",
          code: "DUSK ORDER",
          theme: "border-violet-400/20 bg-violet-500/10 text-violet-100",
          positions: [
            { title: "황혼의 천칭", seats: 1 },
            { title: "황혼의 천축", seats: 1 },
          ],
        },
        {
          name: "여명협회",
          code: "DAYBREAK ORDER",
          theme: "border-amber-400/20 bg-amber-500/10 text-amber-100",
          positions: [
            { title: "여명의 천칭", seats: 1 },
            { title: "여명의 천축", seats: 1 },
          ],
        },
        {
          name: "서광협회",
          code: "AURORA ORDER",
          theme: "border-emerald-400/20 bg-emerald-500/10 text-emerald-100",
          positions: [
            { title: "서광의 천칭", seats: 1 },
            { title: "서광의 천축", seats: 1 },
          ],
        },
        {
          name: "명멸협회",
          code: "GLIMMER ORDER",
          theme: "border-rose-400/20 bg-rose-500/10 text-rose-100",
          positions: [
            { title: "명멸의 천칭", seats: 1 },
            { title: "명멸의 천축", seats: 1 },
          ],
        },
        {
          name: "해결사",
          code: "FIXER ASCENDANCY",
          theme: "border-primary/25 bg-primary/10 text-primary",
          positions: [
            { title: "화요의 찬탈자", seats: 1 },
            { title: "수요의 찬탈자", seats: 1 },
            { title: "목요의 찬탈자", seats: 1 },
            { title: "금요의 찬탈자", seats: 1 },
            { title: "토요의 찬탈자", seats: 1 },
          ],
        },
      ],
    },
    {
      realm: "녹타르",
      code: "NOCTAR BLOODLINE LEDGER",
      summary: "네메시스와 뤼네의 상층 혈통권, 실질 권한 계보, 복수 좌석이 허용된 고정 권좌를 묶은 야권 명부.",
      accent: "from-fuchsia-400/18 via-rose-400/8 to-transparent",
      organizations: [
        {
          name: "네메시스",
          code: "NEMESIS",
          theme: "border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-100",
          positions: [
            { title: "카사 프리마", seats: 2 },
            { title: "카르멘", seats: 3 },
          ],
        },
        {
          name: "뤼네",
          code: "LUNE",
          theme: "border-rose-400/20 bg-rose-500/10 text-rose-100",
          positions: [
            { title: "헤더 뤼네", seats: 2 },
            { title: "메시아 뤼네", seats: 2 },
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
        (inner, organization) => inner + organization.positions.reduce((seatSum, position) => seatSum + position.seats, 0),
        0
      ),
    0
  )
  const seatDistribution = throneArchives.map((realm) => {
    const seats = realm.organizations.reduce(
      (sum, organization) => sum + organization.positions.reduce((seatSum, position) => seatSum + position.seats, 0),
      0
    )

    return {
      realm: realm.realm,
      seats,
      ratio: Math.round((seats / totalSeats) * 100),
    }
  })

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto p-4 sm:p-6 lg:overflow-hidden">
      <div className="mb-5 sm:mb-6">
        <h2 className="flex items-center gap-3 text-base font-semibold text-foreground sm:text-lg">
          <Shield className="h-5 w-5 text-primary" />
          권좌 명부
        </h2>
        <p className="mt-1 text-xs tracking-wider text-muted-foreground">
          THRONE REGISTRY
        </p>
      </div>

      <section className="relative overflow-hidden rounded-[1.6rem] border border-primary/20 bg-[linear-gradient(135deg,rgba(8,17,32,0.96),rgba(13,27,42,0.84))] px-4 py-5 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.75)] sm:px-5 sm:py-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(244,63,94,0.12),transparent_28%)]" />
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] tracking-[0.28em] text-primary/80">EXECUTIVE SEAT ARCHIVE</p>
            <h3 className="mt-3 text-[1.7rem] font-semibold leading-tight tracking-[-0.04em] text-foreground sm:text-[2.15rem]">
              엘모라와 녹타르의 정상부를 한 장의 명부로 봉인합니다.
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
              협회의 찬탈자, 천칭과 천축, 그리고 녹타르 상층 혈통권까지. 실질 권한을 보유한 좌석만을 선별해 보관하는
              최상위 열람 구역입니다.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[420px]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-primary">
                <Users className="h-4 w-4" />
                <span className="text-[11px] tracking-[0.18em] text-muted-foreground">소속 기관</span>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">{totalOrganizations}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-[11px] tracking-[0.18em] text-muted-foreground">직위군</span>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">{totalTitles}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-primary">
                <Lock className="h-4 w-4" />
                <span className="text-[11px] tracking-[0.18em] text-muted-foreground">지정 권좌</span>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">{totalSeats}</p>
            </div>
          </div>
        </div>

        <div className="relative mt-5 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
            <p className="text-[10px] tracking-[0.22em] text-primary/75">LUNAR CLAIMANTS</p>
            <p className="mt-2 text-sm leading-6 text-foreground">월식협회 및 해결사 계통 찬탈자 7석 보관</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
            <p className="text-[10px] tracking-[0.22em] text-primary/75">BALANCE / AXIS</p>
            <p className="mt-2 text-sm leading-6 text-foreground">황혼, 여명, 서광, 명멸의 천칭·천축 8석 보관</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
            <p className="text-[10px] tracking-[0.22em] text-primary/75">NOCTAR BLOOD SEATS</p>
            <p className="mt-2 text-sm leading-6 text-foreground">네메시스와 뤼네의 상층 혈통권 9석 기록</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
            <p className="text-[10px] tracking-[0.22em] text-primary/75">ACCESS GRADE</p>
            <p className="mt-2 text-sm leading-6 text-foreground">의전 등급 알파 이상 열람 권한 필요</p>
          </div>
        </div>
      </section>

      <div className="mt-5 grid min-h-0 flex-1 gap-4 lg:mt-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.9fr)] lg:overflow-hidden">
        <div className="space-y-4 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
          {throneArchives.map((realm) => (
            <section
              key={realm.realm}
              className="relative overflow-hidden rounded-[1.4rem] border border-border/70 bg-card/75 p-4 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.65)] sm:p-5"
            >
              <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-100", realm.accent)} />
              <div className="relative">
                <div className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] tracking-[0.24em] text-primary/80">{realm.code}</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">{realm.realm}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{realm.summary}</p>
                  </div>
                  <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] tracking-[0.2em] text-primary">
                    {realm.organizations.length} ORGANIZATIONS
                  </div>
                </div>

                <div className="mt-4 grid gap-3 xl:grid-cols-2">
                  {realm.organizations.map((organization) => {
                    const organizationSeats = organization.positions.reduce((sum, position) => sum + position.seats, 0)

                    return (
                      <article
                        key={organization.name}
                        className="group relative overflow-hidden rounded-2xl border border-border/70 bg-background/45 p-4 transition-transform duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-background/55"
                      >
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-70" />
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] tracking-[0.22em] text-muted-foreground">{organization.code}</p>
                            <h4 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-foreground">{organization.name}</h4>
                          </div>
                          <span className={cn("rounded-full border px-2.5 py-1 text-[11px] tracking-[0.16em]", organization.theme)}>
                            {organizationSeats} SEATS
                          </span>
                        </div>

                        <div className="mt-4 space-y-2.5">
                          {organization.positions.map((position) => (
                            <div
                              key={`${organization.name}-${position.title}`}
                              className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/10 px-3 py-3"
                            >
                              <div>
                                <p className="text-sm font-medium leading-6 text-foreground">{position.title}</p>
                                <p className="text-[11px] tracking-[0.14em] text-muted-foreground">{position.seats > 1 ? "복수 좌석 지정" : "단일 권좌 지정"}</p>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {Array.from({ length: position.seats }).map((_, index) => (
                                  <span
                                    key={`${position.title}-${index}`}
                                    className={cn("h-2.5 w-2.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.14)]", position.seats > 1 ? "bg-primary/85" : "bg-foreground/80")}
                                  />
                                ))}
                                <span className="ml-2 font-mono text-xs text-primary">{position.seats.toString().padStart(2, "0")}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            </section>
          ))}
        </div>

        <aside className="space-y-4 lg:min-h-0 lg:overflow-y-auto lg:pl-1">
          <section className="rounded-[1.4rem] border border-border/70 bg-card/75 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-primary">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-[11px] tracking-[0.18em] text-muted-foreground">권역 점유율</span>
            </div>
            <div className="mt-4 space-y-4">
              {seatDistribution.map((item) => (
                <div key={item.realm}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.realm}</span>
                    <span className="font-mono text-primary">{item.seats} / {totalSeats}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary/80">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary via-sky-400 to-cyan-300"
                      style={{ width: `${item.ratio}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] tracking-[0.14em] text-muted-foreground">{item.ratio}% OF REGISTERED SEATS</p>
                </div>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-[1.4rem] border border-primary/20 bg-[linear-gradient(180deg,rgba(6,14,24,0.92),rgba(9,19,35,0.78))] p-4 shadow-[0_18px_48px_-28px_rgba(0,0,0,0.72)] sm:p-5">
            <p className="text-[10px] tracking-[0.24em] text-primary/80">ARCHIVAL DIRECTIVES</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-foreground/90">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                권좌 명부는 실질 권한과 상징 권한이 동시에 부여된 직위만을 보존합니다.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                복수 좌석 허용 직위는 네메시스 카사 프리마, 카르멘, 헤더 뤼네, 메시아 뤼네로 제한됩니다.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                찬탈자와 천칭, 천축 계열은 조직의 방향성과 사법적 무게를 동시에 대표하는 상징 권좌로 분류됩니다.
              </div>
            </div>
          </section>

          <section className="rounded-[1.4rem] border border-border/70 bg-card/75 p-4 sm:p-5">
            <p className="text-[10px] tracking-[0.24em] text-primary/80">SEALED INDEX</p>
            <div className="mt-4 space-y-3">
              {[
                "월식협회 및 해결사 찬탈자 계열",
                "황혼·여명·서광·명멸 협회 천칭/천축",
                "네메시스 카사 프리마 / 카르멘",
                "뤼네 헤더 뤼네 / 메시아 뤼네",
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-3 rounded-xl bg-secondary/30 px-3 py-3">
                  <span className="mt-0.5 font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-sm leading-6 text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
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
    { id: "audit", label: "권좌", icon: Shield },
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
