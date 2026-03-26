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
    label: "권좌 명부",
    labelEn: "THRONE REGISTRY",
    icon: Shield,
    description: "고위직 인물 열람고",
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
        "relative flex h-full flex-col border-r border-border/70 bg-sidebar/85 backdrop-blur-md transition-all duration-300",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Header */}
      <div className="flex h-20 items-center border-b border-border/70 px-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/15 blur-[1px]" />
            <Activity className="h-6 w-6 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xs font-medium tracking-[0.2em] text-primary">
                SEOGWANG
              </span>
              <span className="text-[10px] tracking-[0.15em] text-muted-foreground/90">
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
                  "group relative flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-200",
                  isActive
                    ? "border-primary/40 bg-primary/10 text-primary shadow-[0_0_24px_rgba(56,189,248,0.07),inset_0_0_12px_rgba(56,189,248,0.04)]"
                    : "border-transparent text-muted-foreground hover:border-primary/20 hover:bg-secondary/70 hover:text-foreground hover:shadow-[0_0_12px_rgba(56,189,248,0.04)]"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                )}

                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary/20 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                      : "bg-secondary/80 group-hover:bg-secondary"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-all",
                      isActive && "drop-shadow-[0_0_4px_rgba(56,189,248,0.9)]"
                    )}
                  />
                </div>

                {!collapsed && (
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span
                      className={cn(
                        "text-[10px] tracking-wider transition-colors",
                        isActive ? "text-primary/60" : "text-muted-foreground"
                      )}
                    >
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
      <div className="border-t border-border/70 p-4">
        {!collapsed && (
          <div className="mb-3 rounded-xl border border-border/70 bg-card/60 p-3 space-y-2">
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
          className="flex h-9 w-full items-center justify-center rounded-lg bg-secondary/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
