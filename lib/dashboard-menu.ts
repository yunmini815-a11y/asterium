import { Globe, Lock, Shield, Sparkles, type LucideIcon } from "lucide-react"

export type DashboardMenuItem = {
  id: string
  label: string
  labelEn?: string
  icon: LucideIcon
  description?: string
}

export const dashboardMenuItems: DashboardMenuItem[] = [
  {
    id: "chat",
    label: "아카식",
    labelEn: "AKASHIC",
    icon: Sparkles,
    description: "대화형 기록 열람",
  },
  {
    id: "worldview",
    label: "교단",
    labelEn: "SANCTUM",
    icon: Globe,
    description: "유스트리아 국교 열람고",
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