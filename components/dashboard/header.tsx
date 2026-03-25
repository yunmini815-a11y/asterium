"use client"

import { useState, useEffect } from "react"
import { Radio } from "lucide-react"

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
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-emerald-500" />
          <span className="text-[11px] tracking-[0.16em] text-muted-foreground sm:text-xs sm:tracking-widest">
            SYSTEM ONLINE
          </span>
        </div>
        <div className="hidden h-4 w-px bg-border sm:block" />
        <TimeDisplay />
      </div>

      <span className="text-[10px] tracking-[0.18em] text-muted-foreground/80">
        AKASHIC
      </span>
    </header>
  )
}
