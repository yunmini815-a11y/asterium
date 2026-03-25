"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Globe, Shield, Lock, ChevronLeft, ChevronRight, Activity } from "lucide-react"

interface SidebarProps {
  activeMenu: string
  onMenuChange: (menu: string) => void
}

const menuItems = [
  {
    id: "worldview",
    label: "세계관 조회",
    labelEn: "WORLDVIEW",
    icon: Globe,
    description: "협회 세계관 데이터베이스",
  },
  {
    id: "audit",
    label: "역량 감사",
    labelEn: "CAPABILITY AUDIT",
    icon: Shield,
    description: "인원 역량 평가 시스템",
  },
  {
    id: "archive",
    label: "기밀 보관소",
    labelEn: "CLASSIFIED ARCHIVE",
    icon: Lock,
    description: "기밀 문서 저장소",
  },
]

export function Sidebar({ activeMenu, onMenuChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Header */}
      <div className="flex h-20 items-center border-b border-border px-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
            <Activity className="h-6 w-6 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xs font-medium tracking-[0.2em] text-primary">
                SEOGWANG
              </span>
              <span className="text-[10px] tracking-[0.15em] text-muted-foreground">
                CENTRAL CONTROL
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenu === item.id

            return (
              <button
                key={item.id}
                onClick={() => onMenuChange(item.id)}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                )}

                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isActive ? "bg-primary/20" : "bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {!collapsed && (
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-[10px] tracking-wider text-muted-foreground">
                      {item.labelEn}
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Status Footer */}
      <div className="border-t border-border p-4">
        {!collapsed && (
          <div className="mb-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">STATUS</span>
              <span className="flex items-center gap-1.5 text-emerald-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                ONLINE
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">ACCESS LEVEL</span>
              <span className="text-primary">ALPHA</span>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-9 w-full items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  )
}
