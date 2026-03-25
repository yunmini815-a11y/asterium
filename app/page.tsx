"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { ChatInterface } from "@/components/dashboard/chat-interface"
import { Globe, Shield, Lock, FileText, Users, AlertTriangle } from "lucide-react"

function WorldviewPanel() {
  const worldviewData = [
    { label: "등록된 세계", value: "147", change: "+3" },
    { label: "관측 중인 이상현상", value: "23", change: "+1" },
    { label: "활성 게이트", value: "8", change: "0" },
  ]

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6">
        <h2 className="flex items-center gap-3 text-lg font-semibold text-foreground">
          <Globe className="h-5 w-5 text-primary" />
          세계관 조회
        </h2>
        <p className="mt-1 text-xs tracking-wider text-muted-foreground">
          WORLDVIEW DATABASE ACCESS
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {worldviewData.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border bg-card p-4"
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

      <div className="mt-6 flex-1 rounded-xl border border-border bg-card p-4">
        <h3 className="mb-4 text-sm font-medium text-foreground">최근 관측 기록</h3>
        <div className="space-y-3">
          {[
            { id: "W-147", name: "신규 세계 발견", status: "분석 중", time: "2시간 전" },
            { id: "W-089", name: "차원 불안정 감지", status: "모니터링", time: "5시간 전" },
            { id: "W-112", name: "게이트 활성화 완료", status: "완료", time: "1일 전" },
          ].map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between rounded-lg bg-secondary/50 p-3"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-primary">{record.id}</span>
                <span className="text-sm text-foreground">{record.name}</span>
              </div>
              <div className="flex items-center gap-3">
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
    <div className="flex h-full flex-col p-6">
      <div className="mb-6">
        <h2 className="flex items-center gap-3 text-lg font-semibold text-foreground">
          <Shield className="h-5 w-5 text-primary" />
          역량 감사
        </h2>
        <p className="mt-1 text-xs tracking-wider text-muted-foreground">
          CAPABILITY AUDIT SYSTEM
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">총 활성 요원</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">247</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">평균 역량 지수</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">84.7</p>
        </div>
      </div>

      <div className="mt-6 flex-1 overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <h3 className="text-sm font-medium text-foreground">요원 목록</h3>
        </div>
        <div className="divide-y divide-border">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center justify-between p-4 transition-colors hover:bg-secondary/30"
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
              <div className="flex items-center gap-6">
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
    { id: "DOC-2847", title: "프로젝트 오로라 보고서", level: "기밀", date: "266.03.15" },
    { id: "DOC-1923", title: "차원 게이트 연구 논문", level: "일반", date: "266.03.10" },
    { id: "DOC-3156", title: "요원 훈련 프로토콜 v3", level: "보통", date: "266.03.08" },
    { id: "DOC-0847", title: "이상현상 대응 매뉴얼", level: "기밀", date: "266.02.28" },
  ]

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6">
        <h2 className="flex items-center gap-3 text-lg font-semibold text-foreground">
          <Lock className="h-5 w-5 text-primary" />
          기밀 보관소
        </h2>
        <p className="mt-1 text-xs tracking-wider text-muted-foreground">
          CLASSIFIED ARCHIVE ACCESS
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center gap-2 text-primary">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-medium">보안 경고</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          본 영역의 모든 접근 및 열람 기록은 보안 시스템에 의해 자동 기록됩니다.
          무단 복제 또는 외부 유출 시 협회 규정에 따라 처리됩니다.
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="group flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:bg-card/80"
          >
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
                        ? "bg-red-500/10 text-red-400"
                        : doc.level === "보통"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {doc.level}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-foreground">{doc.title}</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{doc.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("chat")

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
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={(menu) => setActiveMenu(menu === activeMenu ? "chat" : menu)}
      />
      <main className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-hidden">{renderContent()}</div>
      </main>
    </div>
  )
}
