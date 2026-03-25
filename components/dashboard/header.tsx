"use client"

import { useState, useEffect } from "react"
import { Bell, Settings, User, Radio } from "lucide-react"

function TimeDisplay() {
  const [mounted, setMounted] = useState(false)
  const [displayTime, setDisplayTime] = useState({ date: "", time: "" })

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      const month = String(now.getMonth() + 1).padStart(2, "0")
      const day = String(now.getDate()).padStart(2, "0")
      // 유스트리아력 (고정 연도 266년, 월·일만 실시간)
      const date = `266. ${month}. ${day}.`
      setDisplayTime({
        date,
        time: now.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      })
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="tracking-wider">266. --.--</span>
        <span className="font-mono tracking-wider text-primary">--:--:--</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="tracking-wider">{displayTime.date}</span>
      <span className="font-mono tracking-wider text-primary">{displayTime.time}</span>
    </div>
  )
}

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border/70 bg-card/35 px-4 backdrop-blur-md sm:px-6">
      {/* Left - Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-emerald-500" />
          <span className="text-xs tracking-widest text-muted-foreground">
            SYSTEM ACTIVE
          </span>
        </div>
        <div className="hidden h-4 w-px bg-border sm:block" />
        <TimeDisplay />
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-muted-foreground transition-colors hover:border-border/70 hover:bg-secondary/70 hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-muted-foreground transition-colors hover:border-border/70 hover:bg-secondary/70 hover:text-foreground">
          <Settings className="h-4 w-4" />
        </button>
        <div className="ml-1 hidden h-4 w-px bg-border sm:block" />
        <button className="flex items-center gap-2 rounded-xl border border-transparent px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:border-border/70 hover:bg-secondary/70 hover:text-foreground sm:px-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary">
            <User className="h-3.5 w-3.5" />
          </div>
          <span className="hidden text-xs tracking-wider sm:block">AGENT-001</span>
        </button>
      </div>
    </header>
  )
}
