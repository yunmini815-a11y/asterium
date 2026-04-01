"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Send, Sparkles, User, RotateCcw, Copy, Check } from "lucide-react"

type MessageSource = "system" | "live-ai" | "fallback" | "pending"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  source?: MessageSource
}

interface ApiMessage {
  role: "user" | "assistant"
  content: string
}

type LoreTone = "default" | "elmora" | "noktar" | "neutral"

function detectLoreTone(text: string): LoreTone {
  const lower = text.toLowerCase()

  const forceNoktarKeys = ["소울", "soul", "어비스", "abyss", "a·b·s", "공멸무구"]
  const forceNeutralKeys = ["플뤼겔", "중립지대", "회색지대", "안개지대", "gray zone"]

  const elmoraKeys = [
    "엘모라",
    "에클리시아",
    "인덱시리온",
    "팬텀마이어",
    "세인츠포드",
    "프라가라흐",
    "월식",
    "서광",
    "여명",
    "명멸",
    "황혼",
    "샤텐라우그",
  ]
  const noktarKeys = [
    "녹타르",
    "네메시스",
    "뤼네",
    "소울",
    "soul",
    "어비스",
    "abyss",
    "a·b·s",
    "공멸무구",
    "호라이즌",
    "에스카톤",
    "암시장",
    "불법경매장",
    "명경",
    "범죄",
    "무법",
  ]
  const neutralKeys = ["플뤼겔", "중립지대", "회색지대", "바실라", "게이트", "마물"]

  // SOUL/ABYSS는 설명에 엘모라 키워드가 섞여 있어도 녹타르 톤을 우선 적용한다.
  if (forceNoktarKeys.some((key) => lower.includes(key))) return "noktar"
  // 플뤼겔/회색지대는 본문에 엘모라가 함께 언급되어도 중립(보라) 톤을 우선 적용한다.
  if (forceNeutralKeys.some((key) => lower.includes(key))) return "neutral"

  if (elmoraKeys.some((key) => lower.includes(key))) return "elmora"
  if (noktarKeys.some((key) => lower.includes(key))) return "noktar"
  if (neutralKeys.some((key) => lower.includes(key))) return "neutral"
  return "default"
}

function getToneMeta(tone: LoreTone) {
  if (tone === "elmora") {
    return {
      label: "ELMORA // LUMEN PROTOCOL",
      avatar: "bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30",
      bubble:
        "rounded-tl-sm border-sky-400/40 bg-gradient-to-br from-sky-500/10 via-cyan-500/5 to-card/90 text-card-foreground shadow-[0_0_28px_rgba(56,189,248,0.12)]",
      accent: "bg-sky-300/80",
      time: "text-sky-200/70",
    }
  }

  if (tone === "noktar") {
    return {
      label: "NOKTAR // SHADOW DOSSIER",
      avatar: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30",
      bubble:
        "rounded-tl-sm border-rose-500/40 bg-gradient-to-br from-rose-500/12 via-amber-500/5 to-card/90 text-card-foreground shadow-[0_0_32px_rgba(244,63,94,0.14)]",
      accent: "bg-rose-300/80",
      time: "text-rose-200/70",
    }
  }

  if (tone === "neutral") {
    return {
      label: "GRAY ZONE // FIELD LOG",
      avatar: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/30",
      bubble:
        "rounded-tl-sm border-violet-400/35 bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-card/90 text-card-foreground shadow-[0_0_26px_rgba(167,139,250,0.12)]",
      accent: "bg-violet-300/80",
      time: "text-violet-200/70",
    }
  }

  return {
    label: "AKASHIC // STANDARD",
    avatar: "bg-primary/20 text-primary",
    bubble: "rounded-tl-sm border-border/70 bg-card/80 text-card-foreground",
    accent: "bg-primary/80",
    time: "text-muted-foreground",
  }
}

// 유스트리아 세계관 지식 베이스
const WORLD_KNOWLEDGE = {
  history: {
    year0: "유스트리아력 0년: 세계 창조자의 안배로 인간이 이능력을 얻게 되었으며, 물질의 유한성으로 인한 불평등이 첫 전쟁을 촉발하였습니다.",
    year186: "유스트리아력 186년: 통일국가 '인베스티아'가 건립되었으나, '마물'의 등장으로 패권이 무너지기 시작하였습니다.",
    year200: "유스트리아력 200년: '마물'이 '게이트'를 통해 유스트리아 대륙에 침입하였고, 대륙의 1/3이 침식되었습니다.",
    year220: "유스트리아력 220년: 안전한 도시 엘모라에 인베스티아인들이 집결하였으며 엘모라가 도시국가로 발돋움하였습니다. 녹타르는 범죄조직 네메시스가 체제를 전복시켜 무법지대로 독립하였습니다.",
    year266: "유스트리아력 266년 (현재): 엘모라가 녹타르를 반국가 세력으로 지정하고 범죄도시와의 전쟁을 선포한 상태입니다."
  },
  regions: {
    elmora: "엘모라(Elmora): 인베스티아를 계승한 도시국가로, 다양한 문화가 조화롭게 섞인 안전한 중심 도시입니다. 협회와 해결사들이 활동합니다.",
    noktar: "녹타르: 범죄도시이자 무법지대로, 네메시스와 뤼네 두 세력이 패권 전쟁을 벌이고 있습니다. 불분명한 힘으로 인해 소속원들의 힘이 강화되어 있습니다.",
    basila: "바실라: 마물지대로, 마물들이 점령한 위험 구역입니다."
  },
  detailedRegions: {
    elmora: {
      climate:
        "엘모라는 온난 기후와 뚜렷한 사계절을 유지하며, 수도 에클리시아 중심의 대규모 마나 흐름이 기온 안정에 기여합니다.",
      districts: [
        "에클리시아(중앙): 월식협회 중심 수도. 샤텐라우그, 크리세우스, 에인라드, 그리폰 전투사관학교가 위치.",
        "인덱시리온(동부): 서광 중심 권역. 대도서관 아반티르와 아르테미스 생텀이 대표 시설.",
        "팬텀마이어(서부): 황혼 중심 권역. 플뤼겔 경계인 황혼선과 감시시설 더스크메어가 핵심.",
        "세인츠포드(남부): 명멸 중심 권역. 칠성연합과 상공업 네트워크가 밀집.",
        "프라가라흐(북부): 여명 중심 권역. 바실라 접경 결계 금실, 유물감정소 프레펜데르 운용.",
      ],
      systems: [
        "행정구역별 협회는 고유 업무 외 출생/사망 신고, 경범죄 수사 등 기초 행정을 겸임.",
        "워프게이트는 각 협회 인근 약 30m 지점에 위치하며 100엘라로 타 권역 이동 가능.",
        "대표 교육기관: 그리폰 전투사관학교, 아르테미스 생텀.",
      ],
      schattenruge:
        "샤텐라우그(만월을 가리는 눈)는 월식 옥상의 대형 마나 장치로, 평시 자기장을 전개하고 필요 시 월식령 발동 마나를 도시 전역으로 확산합니다.",
    },
    noktar: {
      overview:
        "녹타르는 공기 중 마나 특성으로 전반적으로 어두운 분위기를 띠며, 행정기관 대신 네메시스와 뤼네가 통제권을 분할합니다.",
      horizon: [
        "지상 호라이즌: 법과 질서가 약한 고위험 권역.",
        "네메시스 본부: 중앙 거점 중심의 무기 보관/훈련/병력 양성 허브.",
        "뤼네 본부: 위장 거점형 구조. 지하에 타뷸라 뤼네 관리 라인이 존재.",
        "신상/묘지: 암묵적 불가침 관습이 남은 상징 지점.",
      ],
      eschaton: [
        "지하 에스카톤: 지하 개발 이후 범죄 경제가 심화된 심층 권역.",
        "암시장/카지노/불법경매장: 무기·폭발물·희귀 기물 거래의 핵심 축.",
        "명경 본부(루머): 네메시스·뤼네 외 제3세력 가능성이 거론되는 비가시 조직 거점.",
      ],
    },
    neutral: {
      flugel:
        "플뤼겔은 엘모라-녹타르 사이 회색 중립지대로, 양측이 직접 행정 개입을 자제하는 완충지대입니다.",
      anomalies: [
        "전역에 사라지지 않는 옅은 안개가 존재하며, 원인은 고밀도 대기 마나로 추정됩니다.",
        "이능력 변형·폭주·강화 등 예측 불가 현상이 빈번합니다.",
        "플뤼겔 호흡 자체가 제논 과부하를 유발할 수 있어 등급별 체류·제어 한계가 명확합니다.",
      ],
      limits:
        "공식 원인은 비공개이며 수뇌부만 진실을 안다는 설이 지배적입니다. 유물·아티팩트 기원설은 검증되지 않았습니다.",
    },
    basila: {
      overview:
        "바실라는 게이트와 마물에 잠식된 땅으로, 인베스티아 멸망 이후 인류가 상실한 고위험 지대입니다.",
      value:
        "아티팩트와 유물, 마정석 등 고가치 보상이 존재해 엘모라·녹타르 모두 높은 관심을 보입니다.",
      hazard:
        "접경에서 멀어질수록 고위 마물이 증가하며, 직접 개입이 어려운 정치 지형 때문에 중립지대 이상으로 위험해질 수 있습니다.",
    },
  },
  factions: {
    nemesis: "네메시스: 녹타르의 주요 범죄조직으로, '해방의 날'을 주도하여 체제를 전복시킨 세력입니다.",
    lune: "뤼네: 녹타르 내 새로운 세력으로, 네메시스와 패권 전쟁을 벌이고 있습니다.",
    association: "협회: 엘모라 소속의 공식 조직으로, 마물 토벌과 범죄도시 척결을 담당합니다."
  },
  concepts: {
    abiliy: "이능력: 세계 창조자의 안배로 인간이 얻은 초자연적 능력으로, 문명 발전의 원동력이자 전쟁의 원인이 되었습니다.",
    mamul: "마물: 세계 바깥에서 온 불순한 존재들로, 게이트를 통해 유스트리아에 침입합니다.",
    gate: "게이트: 마물들이 유스트리아에 진입하는 공간의 균열로, 깨어진 파편 형상을 띱니다."
  },
  // 월식협회 상세 정보
  lunarEclipse: {
    overview: "월식협회: 엘모라의 입법, 사법, 행정을 총괄하는 최상위 통치 기구이자 도시의 해결사들을 공인하고 관리하는 총괄 협회입니다. '천칭은 기울지 않고, 천축은 흔들리지 않으니. 엘모라의 평형은 영원하리라.'",
    members: "월식협회는 전설적인 해결사였거나 현재도 전설을 써내려가는 해결사들로만 구성되어 있습니다. 복도에서 마주친 인자한 청소부 할아버지조차 오닉스 등급의 해결사였을 수 있습니다.",
    leadership: "월식협회는 다른 협회들과 달리 천칭과 천축이 존재하지 않으며, 대신 엘모라 해결사들 중 가장 강한 두 정점인 '일요의 찬탈자'와 '월요의 찬탈자'가 협회를 다스립니다.",
    duties: [
      "모든 해결사들에 대한 관리. 명멸협회와 함께 이클립스 기어 전반 관리.",
      "엘모라의 모든 법 제정 및 관리. 해결사들에게 일정 수준의 면책권 부여.",
      "입법, 사법, 행정 총괄. 다른 협회들과 위권을 분담하여 엘모라 전반 관리.",
      "화폐 조폐 및 유통. 켈레네(마정석 신용카드) 배포로 간편한 거래 지원."
    ]
  },
  currency: {
    unit: "엘라(Ella): 엘모라의 화폐 단위. 1 엘라 = 100원 가치.",
    hellen: {
      description: "헬렌(Hellen): 은은한 빛의 푸른 동전. 마정석 가루와 특수 합금을 압착하여 제작. 어두운 곳에서 은은한 빛 발광.",
      values: "청색 헬렌 = 1 엘라, 녹색 헬렌 = 10 엘라, 적색 헬렌 = 100 엘라, 금색 헬렌 = 1000 엘라"
    },
    kellene: "켈레네(Kellene): 반투명 마정석 카드. 고유 마나 회로가 각인된 신용카드 형태. 중앙에 엘라 잔액 표시. 초승달 문양이 새겨진 월식협회 공인 카드."
  },
  threeTaboos: {
    origin: "삼대금기: 2대 '서광의 천칭' 벤자민 아타락시아가 저지른 참혹한 죄악에서 비롯. 도시의 정점인 천칭들조차 이 금기 앞에서는 한 명의 시민에 불과. 위반 시 모든 협회의 척살 대상.",
    taboo1: "첫째 금기 - 죽은 자의 영혼을 더럽히지 말 것: 벤자민은 죽은 영웅들의 영혼을 사후 세계에서 강제로 끌어올려 인공 육체에 집어넣어 부활시키는 실험을 강행. 영혼들은 본래 자아를 잃고 끝없는 고통에 비명을 지르는 원념으로 전락.",
    taboo2: "둘째 금기 - 인간 이외의 지성체를 창조하지 말 것: 더럽혀진 원념들로 창조된 인공 생명체 '호문쿨루스'들은 인간에 대한 증오를 품고 대학살을 시작. 모든 해결사와 협회 요원들이 이를 막기 위해 출동.",
    taboo3: "셋째 금기 - 다른 도시로의 망명을 시도하지 말 것: 벤자민은 협회 정보와 호문쿨루스 데이터를 들고 녹타르로 망명 시도. 도시 경계를 넘기 직전 황혼의 천칭에게 처참한 최후를 맞이."
  },
  lunarEdict: {
    description: "월식령: 월식협회 두 정점이 엘모라의 평화와 균형을 유지하기 위해 선포하는 최상위 강제 명령. 도시 법률보다 우선되며, 선포 즉시 엘모라 내 모든 의지 위에 군림.",
    effects: [
      "도시의 모든 소음이 제거됨",
      "도시의 하늘이 보라색 빛으로 물듦",
      "도시의 중력이 평소보다 무거워짐",
      "모든 해결사와 협회원의 계약, 의뢰, 업무가 즉시 무효 또는 유예"
    ],
    motto: "'우리는 언제나, 어느 곳에든 존재한다.'"
  },
  // 황혼협회 상세 정보
  twilight: {
    overview: "황혼협회: 엘모라의 월식 산하 직할기관으로, 명멸, 여명, 서광과 동등한 위치에 있습니다. 엘모라의 규율을 책임지며 선을 넘은 자들을 심판하는 자들이며, 칠흑빛 제복에 반달 팬던트를 착용합니다.",
    motto: "인간은 죄를 지으며 살아가나, 그 죄가 영원한 쐐기로 남아서는 안됩니다. 우리는 그것을 뽑아내고, 씻어내며, 그 자가 용서받은 자로 살아가기를 바랍니다. 하지만 그렇지 않는다면, 그 쐐기를 심장까지 쑤셔넣어 죄 그대로 심연에 돌려보내야 합니다. - 황혼협회 초대 협회장 엔디미온",
    role: "황혼협회는 판결을 내리지는 않으나, 그 판결을 위한 정보를 탐색하고 제공합니다. 월식협회가 완성된 명령을 하달하며, 황혼협회는 그 명령을 반드시 완수합니다.",
    units: {
      shaLeh: {
        name: "샤 레흐 (Chien L'Heure, 들개의 시간)",
        fullName: "엘모라 직속 도시균형유지조직대 E.D Maintaining Urban Balance Unit",
        description: "황혼협회 직속 특수 해결사. 명칭과 존재는 알려져 있으나 부대 인원 정보는 비공개. 서광협회와 긴밀한 관계.",
        duties: "도시 규율 검토, 주기적 순찰, 규율 위반 감시/추적/심문, 범죄 수사 지원",
        authority: "특수 통행권 보유. 마나 또는 신체로 복제 불가능한 인증 방식 사용."
      },
      luLeh: {
        name: "루 레흐 (Loup L'Heure, 늑대의 시간)",
        fullName: "황혼 직속 특수임무수행조직대 T.D Special Commission Commitment Unit",
        description: "극비 소수정예 3인 부대. 클리포트의 나무에서 비롯된 클리파를 코드네임으로 사용 (제01번~제03번).",
        members: "격이 다른 절대적인 무력과 지력을 가진 인물들. 존재를 아는 자: 각 협회 부협회장 이상, 황혼 협회장/부협회장, 샤 레흐 행동대장.",
        authority: "일반 행정업무 없음. 신원 노출 금지 전제 하에 대부분의 행동 허용. 협회장의 소집 명령 시 즉시 출동하여 명령 이행."
      }
    },
    leadership: {
      president: "황혼의 천칭 '펜리르': 황혼협회 총괄. 제일 날카로운 이빨을 가진 늑대. 월식협회 정점들과 가까운 관계. 천명을 내릴 수 있는 권한 보유.",
      vicePresident: "황혼의 천축 '글레이프니르': 협회장 보조 및 업무 대행. 늑대들을 묶는 족쇄이자 무기. 늑대대장으로서 루 레흐 통솔. 직명을 내릴 수 있는 권한 보유.",
      dogCaptain: "들개대장: 샤 레흐 통솔 및 요원 파견. 전투/행동 능력 교육 담당. 실력은 늑대요원과 거의 동등."
    }
  },
  // 처분 명령 체계
  disposalOrders: {
    description: "황혼협회의 규격화된 물리적 행동 명령. 불분명한 무력 행사와 권력 남용 방지를 위해 지정.",
    regularOrders: {
      order01: "처분 명령 01호: 대상 제압. 저항 시 신체 속박 허용. 피해 불허. 필요 시 02호 자동 승격.",
      order02: "처분 명령 02호: 대상 제압. 저항 시 물리적 충격 허용. 살해 불허. 필요 시 03호 자동 승격.",
      order03: "처분 명령 03호: 대상 제압. 저항 시 경상 수준 피해 허용. 살해 불허.",
      order04: "처분 명령 04호 (직명: 어스름 뚫기): 대상 제압. 저항 시 중상 수준 피해 허용. 살해 불허. [협회장/부협회장 승인 필요]",
      order05: "처분 명령 05호 (직명: 어스름 꿰기): 대상 제압. 저항 시 신체 결손 수준 피해 허용. 테러급 피해 우려 시 살해 허용. [협회장/부협회장 승인 필요]",
      order06: "처분 명령 06호 (직명: 어스름 끊기): 대상 제압. 저항 시 빈사 상태까지 피해 허용. 대량 손실 우려 시 살해 허용. [협회장/부협회장 승인 필요]"
    },
    executionOrders: {
      order07: "집행 명령 07호 (천명: 늑대 사냥): 대상 제압. 생존 상태 생포 권장. 미약한 피해 우려라도 살해 허용. [황혼협회장 천명 필요]",
      order08: "집행 명령 08호 (천명: 백귀야행): 대상 반드시 살해. 항복/도주 불문. 시신과 모든 자료 파쇄하여 존재 말소. [황혼협회장 천명 필요]",
      order09: "집행 명령 09호 (핌불베트르): 대상을 반드시 멸한다. [황혼협회장 천명 필요]",
      order00: "처분 명령 제0호 (라그나로크): 대상을 반드시 멸한다. 황혼의 천칭이 직접 나서는 것이 허락된다. [협회장만 인지]"
    },
    commandTypes: {
      chunmyung: "천명: 황혼협회장만이 내릴 수 있는 최고 위권 명령. 루 레흐에게 하달.",
      jikmyung: "직명: 협회장/부협회장이 승인하여 하달하는 명령. 04호~06호 처분 명령에 필요."
    }
  },
  // 서광협회 상세 정보
  seogwang: {
    overview: "서광협회: 엘모라의 월식 산하 직할기관으로, 명멸, 여명, 황혼과 동등한 위치에 있습니다. 도시 내외부의 정보를 수집, 기록, 판단, 보관하는 것을 주 목적으로 하며, 사건의 인과 파악 및 해결방안 모색을 담당합니다.",
    motto: {
      main: "동이 튼다. 동이 트는 새벽과 아침의 아이들아... 우리는 오늘의 마지막이자 내일의 시작이니, 모든 날의 시작과 끝은 서광이다.",
      meaning: "서광: 상서로운 빛이나 좋은 일이 일어날 조짐, 혹은 새벽에 동이 틀 무렵의 빛을 뜻하며 희망을 의미하는 말."
    },
    principles: [
      "1. 업무 외 서광에 속하지 않은 이에게 서광에 대하여 입을 열지 마시기 바랍니다. 동의도, 부정도 말씀하지 마시기 바랍니다. 거짓을 고하지 않되 진실 또한 쉬이 고하지 마시기 바랍니다.",
      "2. 서광 내의 인원들은 항시 서로를 존중하시기 바랍니다. 사적인 감정을 배제하지 않되, 일에 영향을 주지 마시기 바랍니다.",
      "3. 서광의 긍지를 항시 몸에 담고 살아가시기 바랍니다. 허나 그 긍지가 아집이 되어 시야를 흐리게 하지 마시기 바랍니다.",
      "4. 업무상의 이유로 서광 외의 존재와 대화하게 되실 경우에는, 첫 말은 신분을 밝히는 것으로 하시기 바랍니다.",
      "5. 공과 사를 명확히 구분하시고, 그 어떤 시련 앞에서도 냉철히 판단하시기 바랍니다. 진실과 서광을 제1순위로, 정보와 생명을 제2순위로 판단하시기 바랍니다.",
      "6. 행복한 무지의 삶보다 고통스러운 지식이 바람직합니다."
    ],
    characteristics: "정보 유출에 극도로 보수적이며, 같은 월식 산하의 명멸, 여명, 황혼에게도 보수적입니다. 타 협회와 사적인 교류는 금지되어 있습니다. 협회 내 질서를 중시하며 엄격한 수직적 구조를 강조합니다.",
    leadership: {
      president: "서광의 천칭 '사서(司書)': 서광을 이끄는 협회장. 서고의 관리자. 대외적인 출장 및 중대사 처리.",
      vicePresident: "서광의 천축 '서기(書記)': 협회장 직할 부하. 협회 내부 업무 처리. 협회장 부재 시 대리인."
    },
    departments: {
      dept0: "제0과: 비밀 잠입, 기밀, 암살 등 특수업무 전담. 제3과와 협력. 대외적 활동 없음.",
      dept1: "제1과: 실시간 정보 수집 및 가치 판단. 전투등급 측정 및 재해등급 판단. 타 협회와의 정보 교류 전담.",
      dept2: "제2과: 수집된 정보 보관 및 판단. 전략가와 분석가 포진. 서광 내부 관리. 에이전트 등록 및 관리.",
      dept3: "제3과: 전투 및 교전 담당. 정보 유출 시 물리적 처단 집행. 대외적으로 알려진 유일한 부서."
    },
    ranks: {
      danjang: "단장: 각 과의 대표자. 관할권과 총지휘권 보유. 과 전체를 자신의 판단 하에 움직일 수 있음.",
      bujang: "부장: 단장 아래의 준 관리자. 단장 부재 시 권한 대행. 단장과 함께 과 전체 통솔.",
      agent: "에이전트: 서광 협회의 모든 요원. 신입부터 고참까지 포함. 엄격한 수직적 구조 하에 운영."
    }
  },
  // 서고 시스템
  archive: {
    overview: "서고: 서광협회가 수집, 기록한 모든 정보가 영구적으로 보관되는 곳으로, 변경, 삭제, 조작이 불가합니다. 정보는 '책'의 형태로 보관되며 키워드를 제목으로 자동 생성됩니다.",
    motto: "목숨이 다 하기 전, 마지막 한 글자라도 더.",
    secrets: "서고의 위치, 창조자, 사서의 계승 방법 등 모든 것이 비밀이며, 서고에 출입 가능한 이는 오직 사서와 그가 허락한 이들뿐입니다.",
    artifacts: {
      baekseo: "[백서]: 종이 형태의 아티팩트. 정보 기록 및 서고 전달용. 사용자 등록 필요. 접촉 상태에서 정보를 정한 후 손을 떼면 기록 완료. 되돌릴 수 없음.",
      gwangwon: "[광원]: 소형 구체 형태의 아티팩트. 정보 열람용. 마나로 사용자 인증 시 홀로그램 터치 인터페이스 표시. 정보 열람 등급에 따라 접근 가능."
    },
    accessLevels: {
      level0: "정보 열람 0급: 서광의 천칭, 협회장만 열람 가능. 존재 자체가 기밀. 금지된 기록들의 집합.",
      level1: "정보 열람 1급: 부협회장부터 열람 가능. 고위 인사들의 비밀과 약점. 유출 시 사회에 큰 파장을 일으킬 정보.",
      level2: "정보 열람 2급: 단장과 부장에게 부여. 타 협회 정보 및 협회 차원에서만 수집 가능한 정보.",
      level3: "정보 열람 3급: 일반 에이전트 부여. 마물 정보, 사회 시스템 등 평범하지만 자세한 정보. 타 협회에 공유 가능한 최대 등급."
    }
  },
  // 명멸협회 · 엑시드 · 칠성연합
  myungmyeol: {
    quotes: [
      "우리는 태양 아래에서도, 달 아래에서도 우리만의 빛을 내야 한다.",
      "우리는 미지를 파헤칠 자격을 받은 별이다.",
    ],
    brief:
      "엘모라의 무구·기술·공방을 총괄하는 협회입니다. 도시 시설·해결사 장비, 연구와 안전 규제로 도시를 돕습니다. 천칭 「슈나이더」, 천축 「에이트리」가 이끕니다.",
    overview:
      "명멸협회는 엘모라의 무구와 기술을 담당하며, 끊임없는 연구를 통해 엘모라의 발전에 기여하는 공방 협회입니다. 산하 기관을 통한 다방면 탐구, 건물·시설·국가 소속 해결사의 장비·무구 제작, 산업 분야 종사자에 대한 편의·서비스, 기술 이용 안전 점검과 위험 요소 배제를 수행합니다. 도시의 기반을 쌓고 헌신하며 시간과 지식을 부딪치는 이들이 바로 명멸협회이며, 부유·명예·평온한 미래를 소망하되 다른 이들도 그 미래에 함께하기를 바랍니다.",
    forgeMotto: "한 번의 단조가 강철을 가르고, 한 번의 제련이 칼날을 벤다.",
    duties: [
      "도시 기반 점검: 시설·장치 점검, 노후 보수·신축, 필요와 개선을 계획·실행.",
      "무구 및 장치 기준·혼란 통제: 불완전 마도장치, 광역 피해 장비·대형 화기·폭발물·마나 장비·기물의 무분별 개발·제조 규제, 확인 시 처리·해체.",
      "약제 기준·혼란 통제: 마약류, 신체·마나 강화 부작용 약물 등 미검수 물질 분석·규제.",
      "장비 제작·거래: 마물 등 위협에 맞설 장비 개발·배포, 필요 시 거래로 판매.",
      "개인 공방 시스템: 허가·심사·인증, 등급에 따른 신뢰·지원. 위험물 통제이자 독점 구조 완화.",
      "기술 개발·연구·기록·배포: 공업·산업·약물·식품·건설·운송·마나·마물 분석. 자료를 서광·월식 등과 공유, 여명협회와 마물 관련 긍정적 교류.",
    ],
    leadership: {
      president:
        "명멸의 천칭 「슈나이더」: 협회장. 엑시드 단조 책임자로 엑시드 단조에 큰 영향력. 완벽에 가까운 기술을 가진 유일한 대상.",
      vicePresident:
        "명멸의 천축 「에이트리」: 부협회장. 협회장 보조, 부재 시 업무 대행. 엑시드 단조 기술을 일부 습득, 정상급에 가까운 무구 단조. 필요 시 협회장 보조로 엑시드 단조 동행.",
      danjang:
        "명멸협회 단장: 대부분의 사안 총괄·관리. 중대 안건은 부협회장·협회장 보고, 입사·지위 관리. 엑시드 단조 극소 일부 습득, 우수한 무구 단조. 필요 시 천칭·천축 보조로 엑시드 단조 동행, 대규모 단조 작업 동행·관리.",
      gwajang:
        "명멸협회 과장: 각 부서 총책임. 분야 최강 또는 실적자 선출. 신입 교육, 상급 지시 전달.",
      agent:
        "명멸협회 요원: 입사 시 역량·적성에 따라 부서 배정, 과장 산하에서 성장. 요원 간 실적 차는 있으나 등급·지위는 없고 평등 대우.",
    },
    departments: {
      dept0:
        "명멸 0과 (특수행동과): 대부분 업무 총괄·정리, 직접 행동 시 출동. 천칭·천축·단장(대행)이 실질 0과 소속이라 단장 직은 없음. 타 부서 동행·교육, 전산·통계 보관·공유, 기술 연구·실험. 인원은 적으나 타 부서 업무 처리 가능한 역량. 3~5과 기술을 세 가지 모두 다루는 요원과 전문 요원이 배치.",
      dept1:
        "명멸 1과 (특수관리과): 0과 보조, 내부 사건·사고 처리, 공방 등급·평가, 타 기업·협회 교류, 위험 기물 처리. 공학·화학·마나 학문 인재, 위험 기물 해체·무력화. 전투 역량 연마자 다수.",
      dept2:
        "명멸 2과 (특수감시과): 산하 기업·승인 공방 점검·파견, 미승인 공방 위험 기물 안전 검수. 사고 시 초기 긴급 처치, 정보를 관리과(1과 등)와 공유.",
      dept3:
        "명멸 3과 (제련공업과): 장비 제조 주력. 칠성연합의 천선공단과 깊은 협력. 0과 일부와 장비 기능·효율·내구·재료 연구.",
    },
    excid: {
      fullName: "제논 카탈리스트 데시메이터 (Xenon · Catalyst · Decimator)",
      short: "엑시드(X·C·D) · 명멸무구",
      intro:
        "제논 카탈리스트 데시메이터(Xenon · Catalyst · Decimator)는 본 장비의 정식 명칭이며, 앞글자를 따 X·C·D로 읽어 엑시드(Excid)라 부릅니다. 명멸협회가 제작하는 고위 능력자 전용 맞춤형 장비를 통틀어 명멸무구라고도 합니다.",
      absolute:
        "이능력자 마나는 【절대성】이라 불리는 붕괴력을 품고 있습니다. 일반 장비는 일정 절대성 이상에 견디지 못해 파손·무반응하게 됩니다. 급박한 상황에서 장비가 파손될 경우 치명적 결과로 이어질 수 있어, 헤프타 등급 이상에는 엑시드 착용이 강력히 권장됩니다.",
      material:
        "주 재료는 바실라에서 채굴 가능한 특수 광물 오리하르콘이며, 고농도 마나를 견딥니다. 마정석 융합으로 마물의 힘을 활용하거나 새로운 방식의 힘을 이끌어내는 것도 가능합니다. 검·화기·방어구·반지·팔찌·신체 일부 등으로 가공됩니다.",
      value:
        "복잡한 공정과 고가치 재료로 천문학적 가치를 지니며, 극소수에 의해서만 단조되고 지위의 상징으로 쓰이기도 합니다.",
      recommendation:
        "「추천서」가 있어야 단조가 시작됩니다. 각 협회 천칭 또는 동급 해결사의 공인 승인이 필요하며, 지위·실적·성품 등을 종합한 훈장과 같은 자격이 요구됩니다. 돈과 직위만으로는 불가합니다.",
    },
    polaris: {
      overview:
        "칠성연합(七星聯合, The Polaris Cyndicates): 명멸협회 산하 일곱 기관으로, 명멸의 보호·지원 아래 분야별 인프라를 운영하며 도시의 흐름을 주도합니다.",
      dubhe: "천추건축 (天樞建築) — Dubhe Architecture",
      merak: "천선공단 (天璇工團) — Merak Industrials (명멸 3과와 깊은 협력)",
      phecda: "천기상단 (天璣商團) — Phecda Merchants",
      megrez: "천권의학 (天權醫學) — Megrez Medicine",
      alioth: "옥형연금 (玉衡鍊金) — Alioth Alchemy",
      mizar: "개양운송 (開陽運送) — Mizar Transportation",
      alkaid: "요광의류 (搖光衣類) — Alkaid Clothing",
    },
  },
  // 여명협회 (바실라 · 마물)
  yeomyeong: {
    brief:
      "월식 산하 직할기관으로 바실라·마물 전반을 담당합니다. 국경 수호, 마물 포획·제거, 생체·시체 연구, 마광석·무기·타 협회 물자 지원. 하늘의 빛은 구호의 다음 절이 가리키듯 보랏빛 일렁임에 비유됩니다.",
    summary:
      "여명협회는 엘모라의 월식 산하 직할기관으로, 바실라와 마물의 전반을 다룹니다. 바실라와 엘모라 사이의 국경을 수호하고, 바실라로 직접 나가 마물을 포획하거나 제거합니다. 생포 또는 인도된 시체를 바탕으로 연구를 이어가며, 명멸협회를 포함한 여러 협회와 협력합니다.",
    quotes: [
      "여명의 하늘은 무슨 빛의 색을 띄는가?",
      "냉기를 담은 얼음과 그 위를 잔잔히 돌아치는 보랏빛 일렁임 속에서 살아남을 자신이 있다면, 스스로를 차출해라, 하늘에게 가담해라.",
    ],
    skyAnswer:
      "같은 쌍의 다음 문장이 색을 가리킵니다. 차가운 얼음 위를 도는 보랏빛(보라) 일렁임이 여명의 하늘이 띄는 빛의 은유로 제시됩니다.",
    forgeMotto: "힘을 모아서 응축한 뒤, 정확한 곳에 내리꽂는다.",
    overview:
      "여명협회는 명멸, 서광, 황혼과 어깨를 나란히 하는 월식 산하 직할기관입니다. 바실라에서 요구되는 대부분의 업무를 담당하며, 미개발 지역 탐사, 마정석 연구, 엘모라와 바실라를 잇는 접견 구역의 봉쇄·수비를 수행합니다. 마물에 맞서는 무력과 굳건한 방위로 엘모라를 수호하고, 마물학자들과 협업하여 마광석 무기 제조나 명멸협회에 필요한 물자를 제공합니다. 바실라와 마물에 관해서는 그들보다 더 많은 지식과 전투 경험을 가진 이가 없다고 평가받습니다.",
    leadership: {
      president:
        "여명의 천칭 「데스테라」: 협회장. 여명 내부 전반을 감독하며 엘모라 내에서 바실라 구조에 대해 가장 잘 아는 총책임자입니다. 승계는 퇴임 시 자손에게 물리거나 정년 퇴임 10년 전 점지된 적임자, 혹은 보좌관의 승격 등으로 이루어집니다. 수직 체계에서 막대한 권한을 가지며 바실라 권한 관련 사안은 대개 협회장의 의견을 따릅니다. 타 협회와 연구·탐구 성과를 공유하도록 지시하기도 하며, 고위급 마물 출현 시 예외적으로 현장 파견에 나서기도 하나 협회장 성향에 따라 사무 중심·현장 중심으로 갈립니다.",
      vicePresident:
        "여명의 천축 「달리움」: 부협회장·보좌관. 협회장을 가장 가까이에서 보필합니다. 세대가 바뀔 때마다 협회장의 빈자리를 보완하는 역량을 가진 이가 차출됩니다. 협회장이 파견을 자주 나가면 서류 업무를, 사무를 선호하면 무력·사냥 능력을 갖춘 이가 보좌관이 됩니다. 보좌관은 자손에게 물려주기도 하나 부재 시 협회장이 직접 축출하는 것이 일반적입니다. 협회장 곁에 상시 대기하며 지시를 이행하거나, 하위 요원에게 협회장을 대신한 임무를 전달합니다.",
      seonja:
        "선자(先子): 5좌 각 좌마다 두목 직책이 있으며, 나머지 선자들과 교류해 파견을 구축·계획합니다. 보좌관을 제외하고 협회장과 직접 마주할 수 있는 직급으로, 호명 시 「先」을 앞에 붙여 포획 선자·개척 선자 등으로 부릅니다. 상호 협력이 필수라 교류가 잦으며, 파견 등급이 2·1에 가까우면 현장 차출됩니다.",
    },
    fiveSeats: [
      "1좌 포획자: 마물·바실라 생명체와 직접 대면합니다. 위협이 될 마물을 제거하고 생포하거나 시체를 보존·운반해 연구 자재로 넘깁니다. 강한 무력과 포획에 특화된 능력이 요구됩니다.",
      "2좌 개척자: 미지의 구역 탐구, 유물·유적 발굴·탐사를 담당합니다. 필수적으로 무력이 요구되지는 않으나 개척을 위해 바실라에 들어가므로 목숨을 지킬 만한 단련은 필수입니다. 개척자·기록자와 함께 이동하며 유물이 있으면 지도에 기재하기도 합니다.",
      "3좌 기록자: 포획자·개척자와 동행해 현장에서 1차 기록을 남깁니다. 정보는 여명으로 모여 검증·배분 후 문서로 보존되며 문서보관소로 이관됩니다.",
      "4좌 탐구자: 생포체·시체·유물 감정과 연구를 담당합니다. DNA 추출·부가 활용, 마정석 보관·배분을 맡습니다.",
      "5좌 수호자: 엘모라와 바실라 사이 국경(벽)을 방위합니다. 파견 이동을 지원하고 필요 시 바실라 내 일정 구역 수호를 맡습니다. 협회장·보좌관 다음으로 지리·주변 환경에 능통해야 하며, 마물에 맞설 무력과 공간 지각 능력이 요구됩니다.",
    ],
    deploymentMotto: "미개한 생물의 숨을 끊어라, 그 목을 증거로 지녀라.",
    dispatch: {
      hunt: "마물 포획 파견: 생포·시체·자재 확보를 목적으로 마물 사냥을 전제로 합니다. 1좌 포획자 다수와 3좌 기록자 소수가 기본이며 난이도에 따라 2좌·5좌가 가세합니다.",
      survey: "지리 탐구 파견: 신규 지역·유물·유적 발굴입니다. 2좌 개척자 2인 이상 필수, 1좌·3좌 소수 동행. 마물 접촉을 최소화합니다. 난이도에 따라 5좌가 추가됩니다.",
      security: "치안 유지 파견: 국경 주민 등에 대한 위협 판단 시 협회장·보좌관이 발령합니다. 1좌 포획자와 5좌 수호자만 투입됩니다. 일상적 국경 순환과 구분되며 위험이 커 파견 경보 수치가 따릅니다.",
    },
    grades: {
      p1: "P-1: 오직 협회장만 발령 가능한 최상위 경보입니다. 신속 대응이 없으면 도시가 반파될 수 있는 위협에 대응하며, 유효한 타격이 가능한 요원이 총동원되고 타 협회에도 자문을 구합니다.",
      p2: "P-2: 협회장·보좌관이 발령합니다. P-1보다 파괴력은 낮으나 파장이 거의 맞먹는 경우입니다. 모든 1좌·5좌가 차출되고 필요 시 3좌 기록자 일부가 동원됩니다.",
      p3: "P-3: 협회장·보좌관이 발령합니다. 국경 배치를 넘어 추가 인력이 필요하거나 약한 급 마물의 엘모라 침입이 우려될 때입니다. 주로 5좌가 불리고 필요에 따라 나머지 좌가 파견됩니다.",
    },
  },
  /** 엘모라 주요 협회·기관 색인 */
  associationIndex: {
    intro:
      "월식협회를 정점으로 두고, 산하 직할기관과 연합 기관이 역할을 나눕니다. 아래 항목명으로 개별 질의하시면 상세 기록을 불러옵니다.",
    lines: [
      "월식협회 — 입법·사법·행정 총괄, 해결사 공인·관리, 최상위 통치 기구.",
      "명멸협회 — 무구·기술·공방, 도시 시설·장비·연구. 칠성연합을 산하에 둠.",
      "여명협회 — 바실라·마물, 국경·포획·연구.",
      "서광협회 — 정보 수집·기록·서고. 아카식레코드의 모체.",
      "황혼협회 — 규율·심판·집행, 처분·집행 명령 체계.",
      "칠성연합 — 명멸 산하 일곱 기관(천추건축 등), 도시 인프라.",
    ],
  },
  resolver: {
    oath: "월식의 가호 아래 명멸의 검을 휘두르고, 서광을 따라 여명과 황혼의 경계를 걸으리.",
    overview:
      "해결사는 엘모라에서 사건 해결, 마물 저지, 범죄자 척결을 수행하는 월식협회 공인 보안관입니다. 단순 용병이 아니라 도시 질서 수호를 위한 공적 서약을 짊어진 집단입니다.",
    roles: [
      "운영 유연성: 협회 정규 무력보다 빠른 현장 투입과 즉응 대응.",
      "전문성 보완: 표준화 전력이 다루기 어려운 특이 사건 해결.",
      "사회적 완충: 협회와 시민 사이의 신뢰 연결고리 역할.",
    ],
    grades: [
      "가넷(견습): 해결사 입문 단계. 숙련자와 팀 단위 임무 수행.",
      "앰버(정식): 독자 임무 수행 가능. 해결사 다수 분포 구간.",
      "토파즈(숙련): 자기 노하우 확립. 마물지대 탐방 및 출세 구간.",
      "사파이어(정예): 상위 5%. 잠입·장기 작전급 의뢰 담당.",
      "오닉스(일류): 승급 시험 통과자. 도시 존망 임무 참여 가능.",
      "마그눔오푸스(특급): 10명 내외. 단장급 발언권과 압도적 무력.",
    ],
    requestTiers: [
      "속삭임: 작은 마을 혼란급. 보수 1천~3천 엘라.",
      "소음: 도시 일부 위협급. 보수 1만 엘라 이상.",
      "비명: 도시 대위험급. 보수 2만~4만 엘라.",
      "불협화음: 도시 시스템 마비 가능급. 협회 간 합동 대응.",
      "침묵: 월식 지정 최고 위험. 도시 최우선 제거 대상.",
    ],
    eclipseGear:
      "이클립스 기어는 인증 해결사 전용 장치(시계형)로, 의뢰 조회/수주/공유/커뮤니티 기능을 제공합니다. 착용자 뇌파를 인식해 개인 홀로그램 인터페이스를 호출합니다.",
    sevenUsurpers:
      "칠요의 찬탈자는 앙그라마이뉴 토벌 7인을 기리기 위해 시작된, 월식이 해결사에게 부여하는 최고 명예 칭호입니다.",
  },
  nemesisDetail: {
    intro:
      "네메시스는 녹타르의 가장 오래된 조직으로, 창립자 마키엘 프라디우스와 카사 프리마의 계보를 잇는 세력입니다. 뤼네와 함께 양대산맥을 이룹니다.",
    core:
      "네메시스는 피라미드형 광물을 운용하며, 의식을 통해 힘을 각성합니다. 모래·혈흔·섭취 후 심상 세계에서 마나를 '납득'시켜야 하며, 의식을 마친 자들은 서로를 인지할 수 있습니다.",
    hierarchy: [
      "지도자(Causa Prima/군주) 2인: 조직 최고권력.",
      "부지도자(Karmen/집정관) 3인: 지도자 직하의 부총책.",
      "부서장/보좌관/요원 체계: 6개 부대, 3개 서단으로 분할 운용.",
    ],
    divisions: [
      "제1서단 Ratio: 계획·시뮬레이션·선동·정보작전.",
      "제2서단 Potentia: 군수·재정·마물 연구·마광석 활용.",
      "제3서단 Actus: 전투·암살·사냥·의무지원.",
    ],
    mentorSystem:
      "조직원은 멘토/멘티 체계로 운영되며, 입단 일수·연령·테스트·상위 승인에 따라 전환됩니다.",
  },
  ruinae: {
    intro:
      "뤼네(Ruinæ)는 약 30년 전 뤼네 J. 그레안더의 칙령 아래 녹타르에 자리 잡은 대형 조직으로, 네메시스와 함께 녹타르 양대 축으로 평가됩니다.",
    slogan: "BLACK HAWK DO NOT BETRAY.",
    doctrine: [
      "Realize: 나는 뤼네 산하의 영예로운 직급임을 인지한다.",
      "Understand: 뤼네의 명령이 곧 법칙이며, 질서 앞에서 입을 닫는다.",
      "Inherit: 피로 이어진 명예와 불명예를 계승한다.",
      "Never betray: 어떤 상황에서도 뤼네를 배신하지 않으며 배신자는 척결한다.",
      "Act: 타뷸라 앞에서는 입보다 몸을 먼저 움직인다.",
      "Erase: 뤼네에서의 삶이 끝나는 날 스스로 흔적을 지운다.",
    ],
    tabula:
      "타뷸라 루이네는 S~E 6단계 임무 체계입니다. 일반 요원은 주당 최소 3회 수행 의무가 있으며, 등급별 차출 자단·휴가·임무 성격이 엄격히 갈립니다.",
    hierarchy:
      "최고위는 Header Ruinæ 2인, 보좌는 Header's servant 2인, 양육·육성 체계는 Mesia Ruinæ 2인으로 구성됩니다.",
    squads:
      "요원은 제1·제2·제3자단으로 나뉘며 연차·숙련도·승급 심사에 따라 이동합니다. 제1자단일수록 고위 임무와 혜택이 집중됩니다.",
    eden:
      "특수의술부대 에덴(EDEN)은 치료계 이능력자·의술사를 중심으로 운용되며, 수문장 Celest와 요원 Sylph 체계를 사용합니다.",
  },
}

// 독립 조직: 공방 SOUL
const SOUL_KNOWLEDGE = {
  name: "공방 SOUL",
  fullName: "SOUL · Clandestine Forge Network",
  overview:
    "공방 SOUL은 녹타르 지하의 비공개 단조 공방입니다. 뤼네와 독립적으로 운영되며, 고가치 의뢰자 대상 주문제작을 수행합니다.",
  operator: "현 세대 단조자는 소니아 세르핀입니다.",
  specialty:
    "고대 기술과 마정석 융합 기술을 바탕으로 고위 능력자 전용 무구를 제작합니다. 단조 수준은 명멸협회의 엑시드에 필적합니다.",
  location:
    "녹타르 지하 깊숨한 곳에 위치하며, 접근 경로와 정체는 극도로 비밀입니다.",
}

// 독립 아티팩트: 어비스 · 공멸무구
const ABYSS_KNOWLEDGE = {
  name: "어비스 · A·B·S",
  fullName: "Abyss · Annihilation Breakdown Singularity | A·B·S · 공멸무구",
  overview:
    "어비스는 공방 SOUL에서 단조되는 오리하르콘 기반 고내구 무구로, 고농도 마나와 마정석 융합 운용을 전제로 합니다.",
  material:
    "주 재료는 바실라에서 채굴 가능한 특수 광물 오리하르콘입니다. 마정석 융합으로 마물의 힘을 활용하거나 새로운 방식의 힘을 이끌어내는 것이 가능합니다.",
  forms:
    "검·화기·방어구·반지·팔찌·신체 일부 등으로 가공되며, 고위 능력자의 절대성을 견딜 수 있도록 특화 제작됩니다.",
  requirement:
    "사용자 잠재력·사상·명예 검증을 통과한 자에게만 단조됩니다. 이는 권력이나 치부로 취득 불가능한 영예의 상징입니다.",
}

// 간단 요약: 네메시스
const NEMESIS_SIMPLE = {
  name: "네메시스",
  brief:
    "녹타르의 가장 오래된 범죄조직. 창립자 마키엘 프라디우스와 카사 프리마의 계보를 잇는 세력으로, 뤼네와 함께 녹타르 양대 축을 이룹니다.",
  founding:
    "「해방의 날」을 주도하여 녹타르의 체제를 전복시킨 세력으로, 현재도 도시 절반의 통제권을 보유 중입니다.",
}

const TABULA_RUINAE_DETAILS = `Tabula Ruinae는 뤼네의 임무 분류 체계입니다.

【운용 원칙】
▸ 임무 단계: S ~ E
▸ 기본 차출: 주당 최소 3회
▸ 단계가 높을수록 소수 정예/고위직 동반 비율 상승

【등급별 요약】

S // 최고위 단일 발령권
▸ 발령: 헤더 직명으로만 개시
▸ 차출: 최소 1자단, 고위직 참여 사실상 필수
▸ 보상: 2주 ~ 1달 휴가
▸ 예시: 최고위 표적 암살, 대테러 핵심 작전

A // 전략 타격 단계
▸ 발령: 희소 발령, 단독 수행은 고위 역량자 한정
▸ 차출: 최소 1자단
▸ 보상: 1주 휴가
▸ 예시: 준고위 표적 처분, 중규모 테러 작전, 회유 공작

B // 고위험 전투 단계
▸ 발령: 빈번한 실전 단계
▸ 차출: 최소 2자단
▸ 보상: 2일 휴가
▸ 예시: 외부 조직 다수 암살, 국지 교전, 테러 후속 처리

C // 실무 위험 단계
▸ 발령: 주간 상시 편성
▸ 차출: 최소 2자단
▸ 보상: 휴가 없음
▸ 예시: 정보 암행, 외부 잠입 출장, 접선/전서 임무

D // 지원 운용 단계
▸ 발령: 일일 고정 편성
▸ 차출: 최소 3자단
▸ 보상: 휴가 없음
▸ 예시: 테러 시뮬레이션 보조, 함정 점검, 군수 조달

E // 기초 집행 단계
▸ 발령: 일일 고정 편성
▸ 차출: 최소 3자단
▸ 보상: 휴가 없음
▸ 예시: 사전 설치, 물밑 거래, 현장 세팅 및 잡무`

const MANA_SYSTEM_GUIDE = `## 1. 마나와 제논

인간에게는 좌뇌에 마나를 사용할 수 있도록 하는 기관 "제논"이 존재합니다.

신체기관으로서 유전의 영향을 받으나, 이는 개인의 편차에 따라 다른 양상을 보입니다. 이능력을 사용한다는 것은 기본적으로 제논을 이용해 마나를 몸 밖으로 방출하고 구현하는 행위를 뜻합니다. 제논은 제2의 심장이라는 명칭으로도 불립니다.

이능력을 반복적으로 쉼 없이 오랜 시간 사용하거나, 자신의 한계를 뛰어넘는 이능력을 억지로 사용하는 등 제논을 혹사시키는 행위를 반복하면 제논이 손상될 수 있습니다. 이를 "제논의 과부하"라고 하며, 옅은 어지럼증부터 기절, 혼수상태까지 다양한 형태로 증상이 나타납니다. 대기 중 고밀도의 마나에 노출된 채 숨을 쉬는 행위만으로도 제논은 마나를 받아들이기에 과부하 위험이 존재합니다. 마나 사용자 등급이 높다는 것은 제논이 받아들이고 버틸 수 있는 마나 농도와 한계치가 하위 등급보다 높음을 의미합니다.

제논이 손상되었을 때의 기본 해결법은 제논 사용을 중단하고 회복 시간을 확보하는 것입니다. 손상 상태에서 재사용을 시도하면 마나 운용이 불안정해 어떤 결과를 초래할지 예측할 수 없으며, 회복 기간이 기하급수적으로 늘어날 수 있습니다. 회복 기간은 손상 수준에 따라 상이합니다.

마나는 선천적으로 각 개인마다 고유하며, 사회적으로는 지문처럼 개인을 상징하고 입증하는 식별값으로 취급됩니다.

## 2. 마나와 이능력

먼 과거부터 인간에게 주어진 이능력은 시간이 지남에 따라 여러 갈래로 발전했습니다. 그러나 이능력은 모든 인간마다 타고나는 요소이기에 통제가 이루어지지 않을 때 발생하는 문제가 지속되었고, 시대와 집단을 막론하고 통제 필요성이 제기되었습니다. 이에 따라 인류는 시대와 사회에 맞는 서로 다른 방식의 통제를 시행해 왔습니다.

엘모라는 인베스티아를 계승한 도시로서, 인베스티아의 통제 체계를 이어받아 이능력의 절대적인 위력을 나누는 단위인 "절대성"을 도입했습니다. 엘모라에서는 만 14세 이상을 대상으로 서광협회 주관의 위력 시험을 진행합니다.

## 3. 절대성

절대성은 아래 기준으로 총 10단계로 분류됩니다.
- 마나로 구현된 이능력이 자신의 신체를 얼마나 강화할 수 있는가
- 마나로 구현된 이능력이 최대 어느 정도 수준의 피해를 입힐 수 있는가
- 마나로 구현된 이능력이 전장에 얼마나 영향을 미칠 수 있는가
- 마나로 구현된 이능력을 어느 수준까지 다룰 수 있는가
- 마나 자체를 이용해 어떤 효과를 낼 수 있는가 (신체강화, 공격 등)

절대성 1: 가벼운 갑옷이나 방패를 뚫는 위력 수준
절대성 2: 얇은 콘크리트 벽에 균열을 내는 위력 수준
절대성 3: 석조 벽에 균열을 내는 위력 수준
절대성 4: 작은 건물 내부 절반을 파괴하는 위력 수준
절대성 5: 단층 건물을 완전 붕괴시키는 위력 수준
절대성 6: 철근 콘크리트 구조를 붕괴시키는 위력 수준
절대성 7: 작은 건물 여러 채를 파괴하는 위력 수준
절대성 8: 일부 대형 구조물을 파괴하는 위력 수준
절대성 9: 대형 철근 콘크리트 7층 건물 1동을 심각 붕괴시키는 위력 수준
절대성 10: 강화 콘크리트 기반 대형 공공시설 및 요새화 건물을 완전 붕괴시키는 위력 수준

## 4. 마나 사용자 등급 제도

마나 사용자 등급 제도는 서광협회가 엘모라의 모든 마나 사용자를 대상으로 전투력을 측정해 부여하는 분류 체계입니다.

등급은 총 10가지로 나뉘며, 같은 등급 내에서도 절대성 차이로 위력 편차가 존재합니다.

## 5. 등급

I. Mono (모노)
- 허용 최대 절대성: 1
- 상시 1배, 최대 2배 신체강화
- 역량심사 불필요

II. Dio (디오)
- 허용 최대 절대성: 2
- 상시 2배, 최대 4배 신체강화
- 역량심사 불필요

III. Tria (트리아)
- 허용 최대 절대성: 3
- 상시 3배, 최대 5배 신체강화
- 역량심사 불필요

IV. Tetra (테트라)
- 허용 최대 절대성: 4
- 상시 3배, 최대 6배 신체강화
- 역량심사 불필요

V. Pende (펜데)
- 허용 최대 절대성: 5
- 상시 4배, 최대 7배 신체강화
- 역량심사 불필요

VI. Exi (엑시)
- 허용 최대 절대성: 6
- 상시 4배, 최대 8배 신체강화
- 준고위직 역량심사 필요

VII. Hepta (헤프타)
- 허용 최대 절대성: 7
- 상시 5배, 최대 10배 신체강화
- 준고위직 역량심사 필요

VIII. Oktane (옥테인)
- 허용 최대 절대성: 8
- 상시 6배, 최대 12배 신체강화
- 고위직 역량심사 필요

IX. Ennea (엔네아)
- 허용 최대 절대성: 9
- 상시 7배, 최대 14배 신체강화
- 고위직 역량심사 필요

X. Deka (데카)
- 허용 최대 절대성: 10
- 상시 8배, 최대 16배 신체강화
- 최고위직 역량심사 필요`

const MANA_SYSTEM_SUMMARY = `마나와 이능력 체계는 제논, 절대성, 마나 사용자 등급 제도로 구성됩니다.

빠르게 확인할 수 있는 세부 항목은 아래와 같습니다.

▸ 제논 - 마나 운용 기관과 과부하
▸ 절대성 - 위력 측정 기준 1~10
▸ 마나 사용자 등급 제도 - 측정 방식과 운영 기준
▸ 마나 사용자 등급 - Mono ~ Deka 등급표
▸ 마나 상세 - 전체 브리핑`

const XENON_GUIDE = `【마나와 제논】

인간에게는 좌뇌에 마나를 사용할 수 있도록 하는 기관 "제논"이 존재합니다.

이능력을 사용한다는 것은 기본적으로 제논을 이용해 마나를 몸 밖으로 방출하고 구현하는 행위를 뜻합니다. 제논은 제2의 심장이라는 명칭으로도 불립니다.

이능력을 반복적으로 사용하거나 한계를 넘는 출력을 강제로 운용하면 제논이 손상될 수 있습니다. 이를 "제논의 과부하"라고 하며, 옅은 어지럼증부터 기절, 혼수상태까지 다양한 증상이 발생합니다.

대기 중 고밀도의 마나에 노출된 채 숨을 쉬는 것만으로도 제논은 영향을 받을 수 있으며, 상위 등급일수록 받아들이고 버틸 수 있는 마나 농도 한계가 높습니다.

제논이 손상되었을 때는 사용을 중단하고 회복 시간을 확보해야 합니다. 손상 상태에서 재사용을 시도하면 마나 운용 불안정으로 인해 회복 기간이 크게 늘어날 수 있습니다.

마나는 개인마다 고유하며, 사회적으로는 지문처럼 자신을 입증하는 식별값으로 취급됩니다.`

const ABSOLUTENESS_GUIDE = `【절대성】

절대성은 이능력의 절대적 위력을 측정하는 10단계 기준입니다.

판단 기준:
▸ 신체 강화 폭
▸ 최대 피해량
▸ 전장 영향력
▸ 운용 숙련도
▸ 마나 자체 활용 효과

절대성 1: 가벼운 갑옷/방패를 뚫는 수준
절대성 2: 얇은 콘크리트 벽 균열 수준
절대성 3: 석조 벽 균열 수준
절대성 4: 작은 건물 내부 절반 파괴 수준
절대성 5: 단층 건물 완전 붕괴 수준
절대성 6: 철근 콘크리트 구조 붕괴 수준
절대성 7: 작은 건물 여러 채 파괴 수준
절대성 8: 일부 대형 구조물 파괴 수준
절대성 9: 대형 철근 콘크리트 7층 건물 1동 심각 붕괴 수준
절대성 10: 강화 콘크리트 기반 대형 공공시설 및 요새화 건물 완전 붕괴 수준`

const MANA_RANK_SYSTEM_GUIDE = `【마나 사용자 등급 제도】

마나 사용자 등급 제도는 서광협회가 엘모라의 모든 마나 사용자를 대상으로 전투력을 측정해 부여하는 분류 체계입니다.

인베스티아에서 이어진 통제 체계를 계승해, 엘모라는 절대성 기준과 함께 만 14세 이상 인간을 대상으로 위력 시험을 시행합니다.

등급은 총 10가지이며, 같은 등급 안에서도 절대성 차이로 위력 편차가 존재합니다.`

const MANA_RANKS_GUIDE = `【마나 사용자 등급】

I. Mono (모노)
▸ 허용 최대 절대성: 1
▸ 상시 1배, 최대 2배 신체강화
▸ 역량심사 불필요

II. Dio (디오)
▸ 허용 최대 절대성: 2
▸ 상시 2배, 최대 4배 신체강화
▸ 역량심사 불필요

III. Tria (트리아)
▸ 허용 최대 절대성: 3
▸ 상시 3배, 최대 5배 신체강화
▸ 역량심사 불필요

IV. Tetra (테트라)
▸ 허용 최대 절대성: 4
▸ 상시 3배, 최대 6배 신체강화
▸ 역량심사 불필요

V. Pende (펜데)
▸ 허용 최대 절대성: 5
▸ 상시 4배, 최대 7배 신체강화
▸ 역량심사 불필요

VI. Exi (엑시)
▸ 허용 최대 절대성: 6
▸ 상시 4배, 최대 8배 신체강화
▸ 준고위직 역량심사 필요

VII. Hepta (헤프타)
▸ 허용 최대 절대성: 7
▸ 상시 5배, 최대 10배 신체강화
▸ 준고위직 역량심사 필요

VIII. Oktane (옥테인)
▸ 허용 최대 절대성: 8
▸ 상시 6배, 최대 12배 신체강화
▸ 고위직 역량심사 필요

IX. Ennea (엔네아)
▸ 허용 최대 절대성: 9
▸ 상시 7배, 최대 14배 신체강화
▸ 고위직 역량심사 필요

X. Deka (데카)
▸ 허용 최대 절대성: 10
▸ 상시 8배, 최대 16배 신체강화
▸ 최고위직 역량심사 필요`

const SEARCH_MANUAL = `검색이 막막하실 때는 아래 키워드부터 바로 입력하시면 됩니다.

【빠른 시작】
▸ 도움말
▸ 메뉴얼
▸ 예시
▸ 협회 목록

【지역】
▸ 엘모라 / 엘모라 상세
▸ 녹타르 / 녹타르 상세
▸ 플뤼겔
▸ 바실라

【세력 / 조직】
▸ 네메시스 / 네메시스 상세
▸ 뤼네 / 뤼네 상세
▸ 황혼 / 서광 / 여명 / 명멸 / 월식
▸ 공방 SOUL
▸ 어비스

【뤼네 세부】
▸ 파타르키아 뤼네
▸ 타뷸라 뤼네
▸ 뤼네 EDEN

【마나 / 이능력】
▸ 마나
▸ 마나 상세
▸ 제논
▸ 절대성
▸ 마나 사용자 등급 제도
▸ 마나 사용자 등급

【기록 / 시스템】
▸ 서고
▸ 백서
▸ 광원
▸ 열람 등급
▸ 화폐
▸ 월식령

【추천 예시】
▸ "엘모라 상세"
▸ "네메시스 상세"
▸ "타뷸라 뤼네"
▸ "절대성"
▸ "마나 사용자 등급"
▸ "협회 목록"`

// 키워드 기반 응답 생성
function generateContextualResponse(userInput: string): string {
  const input = userInput.toLowerCase()
  const m = WORLD_KNOWLEDGE.myungmyeol
  const y = WORLD_KNOWLEDGE.yeomyeong
  const assocIdx = WORLD_KNOWLEDGE.associationIndex
  const resolver = WORLD_KNOWLEDGE.resolver
  const nemesisDetail = WORLD_KNOWLEDGE.nemesisDetail
  const ruinae = WORLD_KNOWLEDGE.ruinae
  const detailedRegions = WORLD_KNOWLEDGE.detailedRegions
  const soul = SOUL_KNOWLEDGE
  const abyss = ABYSS_KNOWLEDGE
  const nemesisSimple = NEMESIS_SIMPLE

  const isProvocativeInput =
    input.includes("바보") ||
    input.includes("멍청") ||
    input.includes("stupid") ||
    input.includes("idiot")

  if (isProvocativeInput) {
    return `[아카식레코드: 감정 안정 프로토콜]

요원님의 발언은 기록되었습니다. 모욕적 언행은 협회 표준 커뮤니케이션 규약 제3조에 따라 감점 대상이 될 수 있습니다.

원하신다면 임무 브리핑 모드로 전환하여,
지금 가장 궁금한 주제를 즉시 정리해드리겠습니다.

예시: 「월식령 43초 공백 요약해줘」`
  }

  const wantsSearchManual =
    input.includes("도움말") ||
    input.includes("메뉴얼") ||
    input.includes("매뉴얼") ||
    input.includes("검색어") ||
    input.includes("예시") ||
    input.includes("어떻게 검색") ||
    input.includes("뭘 검색")

  if (wantsSearchManual) {
    return `[아카식레코드: 검색 메뉴얼]\n\n${SEARCH_MANUAL}`
  }

  const wantsManaGuideDetail =
    input.includes("마나 상세") ||
    input.includes("마나와 이능력 상세") ||
    input.includes("마나 전체")

  const wantsManaXenon =
    input.includes("마나와 제논") ||
    input.includes("제논") ||
    input.includes("제논 과부하")

  const wantsManaAbsoluteness =
    input.includes("절대성") ||
    input.includes("절대성 1") ||
    input.includes("절대성 10")

  const wantsManaRankSystem =
    input.includes("마나 사용자 등급 제도") ||
    input.includes("등급 제도") ||
    input.includes("역량심사")

  const wantsManaRanks =
    input.includes("마나 사용자 등급") ||
    input.includes("마나 등급") ||
    input.includes("등급표") ||
    input.includes("모노") ||
    input.includes("디오") ||
    input.includes("트리아") ||
    input.includes("테트라") ||
    input.includes("펜데") ||
    input.includes("엑시") ||
    input.includes("헤프타") ||
    input.includes("옥테인") ||
    input.includes("엔네아") ||
    input.includes("데카")

  const wantsManaSystemGuide =
    input.includes("마나와 제논") ||
    input.includes("마나와 이능력") ||
    input.includes("마나 사용자 등급") ||
    input.includes("마나 사용자 등급 제도") ||
    input.includes("제논") ||
    input.includes("절대성") ||
    input.includes("모노") ||
    input.includes("디오") ||
    input.includes("트리아") ||
    input.includes("테트라") ||
    input.includes("펜데") ||
    input.includes("엑시") ||
    input.includes("헤프타") ||
    input.includes("옥테인") ||
    input.includes("엔네아") ||
    input.includes("데카")

  const wantsManaSystemSummary = input.includes("마나") && !wantsManaGuideDetail && !wantsManaXenon && !wantsManaAbsoluteness && !wantsManaRankSystem && !wantsManaRanks

  if (wantsManaGuideDetail) {
    return `[아카식레코드: 마나와 이능력 상세 브리핑]\n\n${MANA_SYSTEM_GUIDE}`
  }

  if (wantsManaXenon) {
    return `[아카식레코드: 제논 · 마나 운용 기관]\n\n${XENON_GUIDE}`
  }

  if (wantsManaAbsoluteness) {
    return `[아카식레코드: 절대성 기준표]\n\n${ABSOLUTENESS_GUIDE}`
  }

  if (wantsManaRankSystem) {
    return `[아카식레코드: 마나 사용자 등급 제도]\n\n${MANA_RANK_SYSTEM_GUIDE}`
  }

  if (wantsManaRanks) {
    return `[아카식레코드: 마나 사용자 등급표]\n\n${MANA_RANKS_GUIDE}`
  }

  if (wantsManaSystemSummary) {
    return `[아카식레코드: 마나와 이능력 요약]\n\n${MANA_SYSTEM_SUMMARY}`
  }

  if (wantsManaSystemGuide) {
    return `[아카식레코드: 마나와 이능력 브리핑]\n\n${MANA_SYSTEM_GUIDE}`
  }

  const wantsResolver =
    input.includes("해결사") ||
    input.includes("가넷") ||
    input.includes("앰버") ||
    input.includes("토파즈") ||
    input.includes("사파이어") ||
    input.includes("오닉스") ||
    input.includes("마그눔오푸스") ||
    input.includes("의뢰 등급") ||
    input.includes("속삭임") ||
    input.includes("소음") ||
    input.includes("비명") ||
    input.includes("불협화음") ||
    input.includes("침묵") ||
    input.includes("이클립스 기어") ||
    input.includes("칠요의 찬탈자")

  if (wantsResolver) {
    return `[아카식레코드: 해결사 브리핑]\n\n"${resolver.oath}"\n\n${resolver.overview}\n\n【운용 목적】\n${resolver.roles.map((line) => `▸ ${line}`).join("\n")}\n\n【보석 등급】\n${resolver.grades.map((line) => `▸ ${line}`).join("\n")}\n\n【의뢰 위험도】\n${resolver.requestTiers.map((line) => `▸ ${line}`).join("\n")}\n\n【이클립스 기어】\n${resolver.eclipseGear}\n\n【최고 칭호】\n${resolver.sevenUsurpers}`
  }

  const wantsNemesisDeep =
    input.includes("네메시스 상세") ||
    input.includes("네메시스 전체") ||
    input.includes("네메시스 조직") ||
    input.includes("마키엘") ||
    input.includes("카사 프리마") ||
    input.includes("causa prima") ||
    input.includes("카르멘") ||
    input.includes("집정관") ||
    input.includes("ratio") ||
    input.includes("potentia") ||
    input.includes("actus") ||
    input.includes("멘토") ||
    input.includes("멘티") ||
    input.includes("피라미드") ||
    input.includes("의식")

  const wantsNemesisSimple = input.includes("네메시스") && !wantsNemesisDeep

  if (wantsNemesisDeep) {
    return `[아카식레코드: 네메시스 · 전체 기록]\n\n${nemesisDetail.intro}\n\n【핵심 전력 메커니즘】\n${nemesisDetail.core}\n\n【조직 위계】\n${nemesisDetail.hierarchy.map((line) => `▸ ${line}`).join("\n")}\n\n【3개 서단】\n${nemesisDetail.divisions.map((line) => `▸ ${line}`).join("\n")}\n\n【인사 체계】\n${nemesisDetail.mentorSystem}\n\n필요 시 항목별 상세 질의: 「네메시스 조직도 상세」, 「피라미드 의식 절차」, 「멘토/멘티 전환 조건」`
  }

  if (wantsNemesisSimple) {
    return `[아카식레코드: 네메시스 · 녹타르 양대축]\n\n${nemesisSimple.name}\n\n${nemesisSimple.brief}\n\n${nemesisSimple.founding}\n\n전체 기록은 「네메시스 상세」로 요청하세요.`
  }

  const wantsRuinaeLore =
    input.includes("뤼네") ||
    input.includes("ruinae") ||
    input.includes("black hawk") ||
    input.includes("peitharchia") ||
    input.includes("realize") ||
    input.includes("never betray") ||
    input.includes("tabula") ||
    input.includes("자단") ||
    input.includes("header ruin") ||
    input.includes("mesia") ||
    input.includes("에덴") ||
    input.includes("eden") ||
    input.includes("tabula")

  const wantsRuinaeFull =
    input.includes("뤼네 상세") ||
    input.includes("뤼네 전체") ||
    input.includes("뤼네 조직") ||
    input.includes("black hawk")

  const wantsRuinaeDoctrine =
    input.includes("파타르키아 뤼네") ||
    input.includes("파타르키아") ||
    input.includes("뤼네 규율") ||
    input.includes("peitharchia") ||
    input.includes("never betray") ||
    input.includes("realize") ||
    input.includes("understand") ||
    input.includes("inherit") ||
    input.includes("act") ||
    input.includes("erase")

  const wantsRuinaeTabula =
    input.includes("타뷸라") ||
    input.includes("타뷸라 뤼네") ||
    input.includes("타뷸라뤼네") ||
    input.includes("tabula ruinae") ||
    input.includes("s~e")

  const wantsSoul =
    input.includes("공방 SOUL") ||
    input.includes("공방 소울") ||
    input.includes("soul") ||
    input.includes("소울") ||
    (input.includes("소니아") && input.includes("세르핀"))

  const wantsAbyss =
    input.includes("어비스") ||
    input.includes("abyss") ||
    input.includes("공멸무구") ||
    input.includes("a·b·s")

  if (wantsSoul) {
    return `[아카식레코드: 공방 SOUL]\n\n${soul.fullName}\n\n${soul.overview}\n\n【운영자】\n${soul.operator}\n\n【특화 분야】\n${soul.specialty}\n\n【위치】\n${soul.location}`
  }

  if (wantsAbyss) {
    return `[아카식레코드: 어비스 · 공멸무구]\n\n${abyss.fullName}\n\n${abyss.overview}\n\n【재료】\n${abyss.material}\n\n【형태】\n${abyss.forms}\n\n【제작 요건】\n${abyss.requirement}`
  }

  if (wantsRuinaeDoctrine) {
    return `[아카식레코드: 파타르키아 뤼네 · Peitharchia Ruinæ]\n\n【조직 표어】\n${ruinae.slogan}\n\n【6규율】\n${ruinae.doctrine.map((line) => `▸ ${line}`).join("\n")}\n\n규율 이행 상태와 처벌 기준이 필요하면 「뤼네 상세」로 조회하십시오.`
  }

  if (wantsRuinaeTabula) {
    return `[아카식레코드: 타뷸라 뤼네 · Tabula Ruinæ]\n\n${TABULA_RUINAE_DETAILS}`
  }

  if (wantsRuinaeFull) {
    return `[아카식레코드: 뤼네 · 전체 기록]\n\n${ruinae.intro}\n\n【조직 표어】\n${ruinae.slogan}\n\n【Peitharchia Ruinæ (6규율)】\n${ruinae.doctrine.map((line) => `▸ ${line}`).join("\n")}\n\n【Tabula Ruinæ】\n${ruinae.tabula}\n\n【조직도】\n${ruinae.hierarchy}\n\n【부대 체계】\n${ruinae.squads}\n\n【특수의술부대 EDEN】\n${ruinae.eden}`
  }

  if (wantsRuinaeLore) {
    return `[아카식레코드: 뤼네 · 녹타르 양대축]\n\n${ruinae.intro}\n\n${ruinae.slogan}\n\n전체 기록은 「뤼네 상세」로 요청하시거나, 특정 항목을 문의하세요.\n\n▸ 「파타르키아 뤼네」 - Peitharchia Ruinæ\n▸ 「뤼네 EDEN」 - 특수의술부대\n▸ 「타뷸라 뤼네」 - 임무 단계 S~E 기준`
  }

  const wantsAssociationIndex =
    input.includes("협회 목록") ||
    input.includes("협회 색인") ||
    input.includes("협회 정리") ||
    input.includes("직할기관") ||
    (input.includes("산하") && input.includes("협회"))

  const myungmyeolWantsFull =
    input.includes("명멸 상세") ||
    input.includes("명멸 전체") ||
    input.includes("명멸 부서") ||
    input.includes("명멸 업무") ||
    input.includes("명멸 조직") ||
    input.includes("슈나이더") ||
    input.includes("에이트리") ||
    (input.includes("명멸") &&
      (input.includes("0과") ||
        input.includes("1과") ||
        input.includes("2과") ||
        input.includes("3과"))) ||
    (input.includes("공방") && (input.includes("협회") || input.includes("엘모라"))) ||
    (input.includes("단조") && input.includes("엑시드"))

  /** 엑시드·명멸무구·XCD·제논 카탈리스트 데시메이터 등 동일 주제로 통합 응답 */
  const wantsExcid =
    input.includes("엑시드") ||
    input.includes("명멸무구") ||
    input.includes("x·c·d") ||
    input.includes("xcd") ||
    input.includes("오리하르콘") ||
    input.includes("헤프타") ||
    input.includes("제논") ||
    input.includes("카탈리스트") ||
    input.includes("데시메이터") ||
    input.includes("추천서") ||
    input.includes("xenon") ||
    input.includes("catalyst") ||
    input.includes("decimator")

  // 명멸협회 — 짧은 질문은 요약만, 상세 키워드·인물명 등이면 전체 기록
  if (myungmyeolWantsFull) {
    return `[아카식레코드: 명멸협회 · 전체 기록]\n\n【협회 구호】\n"${m.quotes[0]}"\n"${m.quotes[1]}"\n\n${m.overview}\n\n【업무】\n${m.duties.map((d) => `▸ ${d}`).join("\n")}\n\n【조직】\n▸ ${m.leadership.president}\n▸ ${m.leadership.vicePresident}\n▸ ${m.leadership.danjang}\n▸ ${m.leadership.gwajang}\n▸ ${m.leadership.agent}\n\n【부서 요약】\n▸ ${m.departments.dept0}\n▸ ${m.departments.dept1}\n▸ ${m.departments.dept2}\n▸ ${m.departments.dept3}\n\n>"${m.forgeMotto}"`
  }
  if (wantsExcid) {
    const x = m.excid
    return `[아카식레코드: 엑시드 · 명멸무구]\n\n${x.intro}\n\n【절대성과 장비】\n${x.absolute}\n\n【재료·형태】\n${x.material}\n\n【가치】\n${x.value}\n\n【추천서】\n${x.recommendation}`
  }
  if (input.includes("명멸") || input.includes("명멸협회")) {
    return `[아카식레코드: 명멸협회]\n\n${m.brief}\n\n전체 기록은 「명멸 상세」 또는 「명멸 부서」로 요청하십시오.`
  }

  if (
    input.includes("칠성") ||
    input.includes("polaris") ||
    input.includes("천추건축") ||
    input.includes("천선공단") ||
    input.includes("천기상단") ||
    input.includes("천권의학") ||
    input.includes("옥형연금") ||
    input.includes("개양운송") ||
    input.includes("요광의류") ||
    input.includes("cyndicates")
  ) {
    const p = m.polaris
    return `[아카식레코드: 칠성연합 (The Polaris Cyndicates)]\n\n${p.overview}\n\n【일곱 기관】\n▸ ${p.dubhe}\n▸ ${p.merak}\n▸ ${p.phecda}\n▸ ${p.megrez}\n▸ ${p.alioth}\n▸ ${p.mizar}\n▸ ${p.alkaid}`
  }

  const yeomyeongWantsFull =
    input.includes("여명 상세") ||
    input.includes("여명 전체") ||
    input.includes("여명 부서") ||
    input.includes("여명 조직") ||
    input.includes("여명 파견") ||
    input.includes("데스테라") ||
    input.includes("달리움") ||
    input.includes("5좌") ||
    input.includes("선자") ||
    input.includes("파견 등급") ||
    input.includes("p-1") ||
    input.includes("p-2") ||
    input.includes("p-3") ||
    input.includes("마물 포획 파견") ||
    input.includes("지리 탐구 파견") ||
    input.includes("치안 유지 파견") ||
    input.includes("마광석") ||
    input.includes("접견 구역") ||
    (input.includes("1좌") && input.includes("포획")) ||
    (input.includes("2좌") && input.includes("개척")) ||
    (input.includes("3좌") && input.includes("기록")) ||
    (input.includes("4좌") && input.includes("탐구")) ||
    (input.includes("5좌") && input.includes("수호"))

  const wantsYeomyeong = input.includes("여명") || yeomyeongWantsFull

  if (wantsYeomyeong) {
    if (yeomyeongWantsFull) {
      return `[아카식레코드: 여명협회 · 바실라 · 전체 기록]\n\n【구호】\n"${y.quotes[0]}"\n"${y.quotes[1]}"\n\n【하늘의 빛】\n${y.skyAnswer}\n\n>${y.forgeMotto}\n\n${y.summary}\n\n【개요】\n${y.overview}\n\n【지도부】\n▸ ${y.leadership.president}\n▸ ${y.leadership.vicePresident}\n▸ ${y.leadership.seonja}\n\n【5좌】\n${y.fiveSeats.map((s) => `▸ ${s}`).join("\n")}\n\n>${y.deploymentMotto}\n\n【파견 유형】\n▸ ${y.dispatch.hunt}\n▸ ${y.dispatch.survey}\n▸ ${y.dispatch.security}\n\n【파견 등급】\n▸ ${y.grades.p1}\n▸ ${y.grades.p2}\n▸ ${y.grades.p3}`
    }
    return `[아카식레코드: 여명협회 · 바실라]\n\n"${y.quotes[0]}"\n"${y.quotes[1]}"\n\n>${y.forgeMotto}\n\n${y.brief}\n\n전체 기록은 「여명 상세」 또는 「여명 부서」로 요청하십시오.`
  }

  if (wantsAssociationIndex) {
    return `[아카식레코드: 협회 · 기관 색인]\n\n${assocIdx.intro}\n\n${assocIdx.lines.map((line) => `▸ ${line}`).join("\n")}`
  }

  const wantsElmoraDetail =
    input.includes("엘모라 상세") ||
    input.includes("엘모라 세부") ||
    input.includes("엘모라 지역") ||
    input.includes("에클리시아") ||
    input.includes("인덱시리온") ||
    input.includes("팬텀마이어") ||
    input.includes("세인츠포드") ||
    input.includes("프라가라흐") ||
    input.includes("샤텐라우그") ||
    input.includes("크리세우스") ||
    input.includes("에인라드") ||
    input.includes("아반티르") ||
    input.includes("아르테미스 생텀") ||
    input.includes("워프게이트")

  const wantsElmoraSimple = input.includes("엘모라") && !wantsElmoraDetail

  if (wantsElmoraDetail) {
    const e = detailedRegions.elmora
    return `[아카식레코드: 엘모라 세부 지역 브리핑]\n\nLUMEN/ELMORA REPORT // 도시 질서·행정 기준 문서\n\n${e.climate}\n\n【5개 행정구역】\n${e.districts.map((line) => `▸ ${line}`).join("\n")}\n\n【도시 운영 체계】\n${e.systems.map((line) => `▸ ${line}`).join("\n")}\n\n【핵심 장치】\n${e.schattenruge}`
  }

  if (wantsElmoraSimple) {
    return `[아카식레코드: 엘모라 요약]\n\n${WORLD_KNOWLEDGE.regions.elmora}\n\n세부 기록은 아래 키워드로 조회 가능합니다.\n\n▸ 엘모라 상세\n▸ 에클리시아\n▸ 워프게이트\n▸ 샤텐라우그`
  }

  const wantsNoktarDetail =
    input.includes("녹타르 상세") ||
    input.includes("녹타르 세부") ||
    input.includes("녹타르 지역") ||
    input.includes("호라이즌") ||
    input.includes("에스카톤") ||
    input.includes("암시장") ||
    input.includes("카지노") ||
    input.includes("불법경매장") ||
    input.includes("명경") ||
    input.includes("신상") ||
    input.includes("묘지")

  const wantsNoktarSimple = input.includes("녹타르") && !wantsNoktarDetail

  if (wantsNoktarDetail) {
    const n = detailedRegions.noktar
    return `[아카식레코드: 녹타르 세부 지역 브리핑]\n\nSHADOW/NOKTAR DOSSIER // 현장 침투·생존 기준 문서\n\n${n.overview}\n\n【지상 『호라이즌』】\n${n.horizon.map((line) => `▸ ${line}`).join("\n")}\n\n【지하 『에스카톤』】\n${n.eschaton.map((line) => `▸ ${line}`).join("\n")}`
  }

  if (wantsNoktarSimple) {
    return `[아카식레코드: 녹타르 요약]\n\n${WORLD_KNOWLEDGE.regions.noktar}\n\n세부 기록은 아래 키워드로 조회 가능합니다.\n\n▸ 녹타르 상세\n▸ 호라이즌\n▸ 에스카톤\n▸ 암시장`
  }

  const wantsNeutralDetail =
    input.includes("중립지대") ||
    input.includes("플뤼겔") ||
    input.includes("회색지대") ||
    input.includes("안개지대") ||
    input.includes("제논 과부하") ||
    input.includes("제논")

  if (wantsNeutralDetail) {
    const z = detailedRegions.neutral
    return `[아카식레코드: 중립지대 『플뤼겔』 브리핑]\n\n${z.flugel}\n\n【핵심 이상현상】\n${z.anomalies.map((line) => `▸ ${line}`).join("\n")}\n\n【공식 결론 상태】\n${z.limits}`
  }

  const wantsBasilaDetail =
    input.includes("바실라") ||
    input.includes("유물") ||
    input.includes("인베스티아") ||
    input.includes("마물지대")

  if (wantsBasilaDetail) {
    const b = detailedRegions.basila
    return `[아카식레코드: 바실라 브리핑]\n\n${b.overview}\n\n【전략 가치】\n${b.value}\n\n【위험도】\n${b.hazard}`
  }

  // 서광협회 관련
  if (input.includes("서광") || input.includes("서광협회") || input.includes("정보 수집") || input.includes("정보수집")) {
    return `[아카식레코드 내부 데이터베이스: 서광협회]\n\n"${WORLD_KNOWLEDGE.seogwang.motto.main}"\n\n${WORLD_KNOWLEDGE.seogwang.motto.meaning}\n\n${WORLD_KNOWLEDGE.seogwang.overview}\n\n【특성】\n${WORLD_KNOWLEDGE.seogwang.characteristics}\n\n【지도부】\n▸ ${WORLD_KNOWLEDGE.seogwang.leadership.president}\n▸ ${WORLD_KNOWLEDGE.seogwang.leadership.vicePresident}\n\n서광협회는 아카식레코드의 모체입니다. 본 시스템은 서광의 서고를 기반으로 구동됩니다.`
  }
  
  // 서광의 원칙 관련
  if (input.includes("원칙") || input.includes("서광의 원칙") || input.includes("규율") && input.includes("서광")) {
    return `[아카식레코드 내부 데이터베이스: 서광의 원칙]\n\n서광협회는 내부에서 '원칙'을 규정하여 협회 내 질서를 다집니다.\n\n【서광의 6대 원칙】\n${WORLD_KNOWLEDGE.seogwang.principles.map(p => `▸ ${p}`).join('\n\n')}\n\n이상의 원칙은 서광 소속 요원께서는 반드시 숙지하시고 준수하시기 바랍니다.`
  }
  
  // 서고 관련
  if (input.includes("서고") || input.includes("아카이브") || input.includes("기록") || input.includes("보관")) {
    return `[아카식레코드 내부 데이터베이스: 서고]\n\n"${WORLD_KNOWLEDGE.archive.motto}"\n\n${WORLD_KNOWLEDGE.archive.overview}\n\n${WORLD_KNOWLEDGE.archive.secrets}\n\n본 아카식레코드 시스템은 서고와 직접 연결되어 있습니다. 요원님의 정보 열람 등급에 따라 접근 가능한 정보가 제한됩니다.`
  }
  
  // 백서/광원 아티팩트 관련
  if (input.includes("백서") || input.includes("광원") || input.includes("아티팩트")) {
    return `[아카식레코드 내부 데이터베이스: 서광 아티팩트]\n\n【아티팩트 [백서]】\n${WORLD_KNOWLEDGE.archive.artifacts.baekseo}\n\n【아티팩트 [광원]】\n${WORLD_KNOWLEDGE.archive.artifacts.gwangwon}\n\n두 아티팩트 모두 서광 협회 제2과에서 사용자 등록을 진행하셔야 이용하실 수 있습니다. 요원님께서는 현재 [광원]을 통해 아카식레코드에 접속 중이십니다.`
  }
  
  // 정보 열람 등급 관련
  if (input.includes("열람") || input.includes("등급") || input.includes("기밀") || input.includes("접근") || input.includes("권한")) {
    return `[아카식레코드 보안 프로토콜: 정보 열람 등급]\n\n서광협회는 직급에 따라 열람 가능한 정보에 차등을 둡니다.\n\n${WORLD_KNOWLEDGE.archive.accessLevels.level0}\n\n${WORLD_KNOWLEDGE.archive.accessLevels.level1}\n\n${WORLD_KNOWLEDGE.archive.accessLevels.level2}\n\n${WORLD_KNOWLEDGE.archive.accessLevels.level3}\n\n요원님께 허락된 등급을 초과하여 정보를 열람하실 경우에는 사유서 제출 및 권한자 승인이 필요합니다.`
  }
  
  // 서광 부서 관련
  if (input.includes("부서") || input.includes("제0과") || input.includes("제1과") || input.includes("제2과") || input.includes("제3과") || input.includes("과")) {
    return `[아카식레코드 내부 데이터베이스: 서광협회 조직도]\n\n서광협회의 부서는 다음과 같이 구성됩니다.\n\n【제0과 - 특수업무】\n${WORLD_KNOWLEDGE.seogwang.departments.dept0}\n\n【제1과 - 정보 수집】\n${WORLD_KNOWLEDGE.seogwang.departments.dept1}\n\n【제2과 - 정보 보관】\n${WORLD_KNOWLEDGE.seogwang.departments.dept2}\n\n【제3과 - 전투】\n${WORLD_KNOWLEDGE.seogwang.departments.dept3}\n\n각 과는 단장, 부장, 에이전트로 구성됩니다.`
  }
  
  // 단장/부장/에이전트 관련
  if (input.includes("단장") || input.includes("부장") || input.includes("에이전트") || input.includes("직급") || input.includes("직위")) {
    return `[아카식레코드 내부 데이터베이스: 서광협회 직급]\n\n【단장】\n${WORLD_KNOWLEDGE.seogwang.ranks.danjang}\n\n【부장】\n${WORLD_KNOWLEDGE.seogwang.ranks.bujang}\n\n【에이전트】\n${WORLD_KNOWLEDGE.seogwang.ranks.agent}\n\n서광협회는 엄격한 수직적 구조를 강조합니다. 연차나 강함과 관계없이 명령 불복종은 엄중한 책임을 지게 됩니다.`
  }
  
  // 사서/서기 관련
  if (input.includes("사서") || input.includes("서기")) {
    return `[아카식레코드 최고 기밀: 서광 지도부]\n\n【서광의 천칭 - 사서(司書)】\n${WORLD_KNOWLEDGE.seogwang.leadership.president}\n\n사서는 서고의 유일한 관리자이며, 서광협회의 모든 정보에 대한 최고 권한을 보유합니다.\n\n【서광의 천축 - 서기(書記)】\n${WORLD_KNOWLEDGE.seogwang.leadership.vicePresident}\n\n서기는 사서와 달리 서고와 직접적인 연관이 없으나, 협회 내부 업무의 실질적인 총괄자입니다.`
  }
  
  // 황혼협회 관련
  if (input.includes("황혼") || input.includes("황혼협회") || input.includes("심판")) {
    return `[아카식레코드 기밀 데이터베이스: 황혼협회]\n\n${WORLD_KNOWLEDGE.twilight.overview}\n\n【협회 이념】\n"${WORLD_KNOWLEDGE.twilight.motto}"\n\n【역할】\n${WORLD_KNOWLEDGE.twilight.role}\n\n【지도부】\n▸ ${WORLD_KNOWLEDGE.twilight.leadership.president}\n▸ ${WORLD_KNOWLEDGE.twilight.leadership.vicePresident}\n▸ ${WORLD_KNOWLEDGE.twilight.leadership.dogCaptain}\n\n황혼협회는 엘모라의 그림자 속에서 암약하며 도시의 질서를 수호합니다.`
  }
  
  // 샤 레흐 / 들개 부대 관련
  if (input.includes("샤 레흐") || input.includes("들개") || input.includes("샤레흐") || input.includes("도시균형")) {
    const unit = WORLD_KNOWLEDGE.twilight.units.shaLeh
    return `[아카식레코드 기밀 데이터베이스: 샤 레흐]\n\n【${unit.name}】\n${unit.fullName}\n\n${unit.description}\n\n【주요 임무】\n${unit.duties}\n\n【권한】\n${unit.authority}\n\n들개 부대원들은 상당한 역량을 가진 이들이며, 한 분야에서 상위권 이상 또는 정점에 다다른 자들로 구성되어 있습니다.`
  }
  
  // 루 레흐 / 늑대 부대 관련
  if (input.includes("루 레흐") || input.includes("늑대") || input.includes("루레흐") || input.includes("특수임무") || input.includes("클리파")) {
    const unit = WORLD_KNOWLEDGE.twilight.units.luLeh
    return `[아카식레코드 최고 기밀: 루 레흐]\n\n⚠️ 경고: 이 정보는 최고 기밀 등급입니다.\n\n【${unit.name}】\n${unit.fullName}\n\n${unit.description}\n\n【구성원 특성】\n${unit.members}\n\n【권한 및 제약】\n${unit.authority}\n\n루 레흐의 존재를 아시는 분은 극소수이며, 이들은 오로지 펜리르의 명령에만 따릅니다.`
  }
  
  // 펜리르 / 글레이프니르 관련
  if (input.includes("펜리르") || input.includes("글레이프니르") || input.includes("천칭") || input.includes("천축")) {
    return `[아카식레코드 최고 기밀: 황혼 지도부]\n\n【황혼의 천칭 - 펜리르】\n${WORLD_KNOWLEDGE.twilight.leadership.president}\n\n【황혼의 천축 - 글레이프니르】\n${WORLD_KNOWLEDGE.twilight.leadership.vicePresident}\n\n【들개대장】\n${WORLD_KNOWLEDGE.twilight.leadership.dogCaptain}\n\n펜리르와 글레이프니르는 황혼협회의 양대 축으로, 엘모라의 규율 수호에 있어 핵심적인 역할을 수행합니다.`
  }
  
  // 처분 명령 관련
  if (input.includes("처분") || input.includes("집행") || input.includes("어스름") || input.includes("라그나로크") || input.includes("핌불베트르") || input.includes("백귀야행")) {
    const orders = WORLD_KNOWLEDGE.disposalOrders
    return `[아카식레코드 최고 기밀: 처분 명령 체계]\n\n⚠️ 경고: 이 정보는 최고 기밀 등급입니다.\n\n${orders.description}\n\n【일반 처분 명령 (01~03호)】\n▸ ${orders.regularOrders.order01}\n▸ ${orders.regularOrders.order02}\n▸ ${orders.regularOrders.order03}\n\n【직명 처분 명령 (04~06호)】\n▸ ${orders.regularOrders.order04}\n▸ ${orders.regularOrders.order05}\n▸ ${orders.regularOrders.order06}\n\n【천명 집행 명령 (07~09호)】\n▸ ${orders.executionOrders.order07}\n▸ ${orders.executionOrders.order08}\n▸ ${orders.executionOrders.order09}\n\n【제0호 - 라그나로크】\n▸ ${orders.executionOrders.order00}\n\n【명령 체계】\n${orders.commandTypes.chunmyung}\n${orders.commandTypes.jikmyung}`
  }
  
  // 천명/직명 관련
  if (input.includes("천명") || input.includes("직명")) {
    return `[아카식레코드 권한 데이터베이스: 명령 체계]\n\n【천명】\n${WORLD_KNOWLEDGE.disposalOrders.commandTypes.chunmyung}\n\n【직명】\n${WORLD_KNOWLEDGE.disposalOrders.commandTypes.jikmyung}\n\n천명을 내릴 수 있는 권한은 오로지 월식협회의 두 정점과 황혼협회의 협회장만이 보유합니다. 이는 엘모라에서 가장 강력한 명령 권한입니다.`
  }
  
  // 월식협회 관련
  if (input.includes("월식") || input.includes("월식협회") || input.includes("총괄") || input.includes("통치")) {
    return `[아카식레코드 기밀 데이터베이스: 월식협회]\n\n${WORLD_KNOWLEDGE.lunarEclipse.overview}\n\n【구성원】\n${WORLD_KNOWLEDGE.lunarEclipse.members}\n\n【지도부】\n${WORLD_KNOWLEDGE.lunarEclipse.leadership}\n\n【주요 업무】\n${WORLD_KNOWLEDGE.lunarEclipse.duties.map(d => `▸ ${d}`).join('\n')}\n\n월식협회는 엘모라의 최상위 기관으로, 모든 협회 위에 군림합니다.`
  }
  
  // 찬탈자 관련
  if (input.includes("찬탈자") || input.includes("정점") || input.includes("일요") || input.includes("월요")) {
    return `[아카식레코드 최고 기밀: 정점]\n\n${WORLD_KNOWLEDGE.lunarEclipse.leadership}\n\n일요의 찬탈자와 월요의 찬탈자는 엘모라의 모든 해결사를 통틀어 가장 강력한 존재들입니다. 이들은 월식협회를 다스리며, 월식령을 선포할 권한을 보유합니다.\n\n경고: 정점들에 대한 상세 정보는 최고 기밀로 분류되어 있습니다.`
  }
  
  // 화폐/엘라/헬렌/켈레네 관련
  if (input.includes("화폐") || input.includes("엘라") || input.includes("헬렌") || input.includes("켈레네") || input.includes("돈") || input.includes("금전")) {
    return `[아카식레코드 경제 데이터베이스: 엘모라 화폐]\n\n${WORLD_KNOWLEDGE.currency.unit}\n\n【헬렌(Hellen)】\n${WORLD_KNOWLEDGE.currency.hellen.description}\n\n화폐 가치:\n▸ ${WORLD_KNOWLEDGE.currency.hellen.values}\n\n【켈레네(Kellene)】\n${WORLD_KNOWLEDGE.currency.kellene}\n\n월식협회 조폐실은 안전과 보안을 위해 협회 지하에 위치하고 있습니다.`
  }
  
  // 삼대금기 관련
  if (input.includes("금기") || input.includes("삼대") || input.includes("벤자민") || input.includes("아타락시아") || input.includes("호문쿨루스")) {
    return `[아카식레코드 최고 기밀: 삼대금기]\n\n⚠️ 경고: 이 정보는 최고 기밀 등급입니다.\n\n${WORLD_KNOWLEDGE.threeTaboos.origin}\n\n【첫째 금기】\n${WORLD_KNOWLEDGE.threeTaboos.taboo1}\n\n【둘째 금기】\n${WORLD_KNOWLEDGE.threeTaboos.taboo2}\n\n【셋째 금기】\n${WORLD_KNOWLEDGE.threeTaboos.taboo3}\n\n이 선을 밟는 자는 그가 누구든, 어떤 업적을 세웠든 상관없이 모든 협회의 척살 대상이 됩니다.`
  }
  
  // 월식령 관련
  if (input.includes("월식령") || input.includes("명령") || input.includes("강제")) {
    return `[아카식레코드 비상 프로토콜: 월식령]\n\n${WORLD_KNOWLEDGE.lunarEdict.motto}\n\n${WORLD_KNOWLEDGE.lunarEdict.description}\n\n【월식령 선포 시 현상】\n${WORLD_KNOWLEDGE.lunarEdict.effects.map(e => `▸ ${e}`).join('\n')}\n\n월식령은 도시의 모든 의지 위에 군림하는 절대 명령입니다. 선포되는 순간, 엘모라의 모든 존재는 이에 복종해야 합니다.`
  }
  
  // 해결사 관련
  if (input.includes("해결사") || input.includes("등급") || input.includes("오닉스")) {
    return `[아카식레코드 인사 데이터베이스: 해결사]\n\n해결사는 엘모라에서 공인된 전문가 집단입니다. 월식협회에서 이들을 관리하며, 이클립스 기어에 대한 전반적인 관리도 담당합니다.\n\n${WORLD_KNOWLEDGE.lunarEclipse.members}\n\n해결사들은 임무 수행 중 불가항력으로 법을 어겨야 하는 상황에 대비해 일정 수준의 면책권을 부여받습니다.\n\n해결사 상층 권좌 체계 열람이 필요하시면 '권좌 명부' 메뉴를 이용해 주십시오.`
  }
  
  // 역사 관련
  if (input.includes("역사") || input.includes("유스트리아력") || input.includes("과거") || input.includes("기원")) {
    return `[아카식레코드 역사 데이터베이스 접근]\n\n유스트리아 대륙의 역사를 보고합니다.\n\n▸ ${WORLD_KNOWLEDGE.history.year0}\n\n▸ ${WORLD_KNOWLEDGE.history.year186}\n\n▸ ${WORLD_KNOWLEDGE.history.year200}\n\n▸ ${WORLD_KNOWLEDGE.history.year220}\n\n▸ ${WORLD_KNOWLEDGE.history.year266}\n\n현재 대륙은 엘모라, 녹타르, 바실라로 삼분되어 있습니다.`
  }
  
  // 엘모라 관련
  if (input.includes("엘모라") || input.includes("도시국가") || input.includes("협회")) {
    return `[아카식레코드 지역 데이터베이스: 엘모라]\n\n${WORLD_KNOWLEDGE.regions.elmora}\n\n【통치 기구: 월식협회】\n${WORLD_KNOWLEDGE.lunarEclipse.overview}\n\n현재 엘모라는 범죄도시 녹타르와의 전쟁을 선포한 상태입니다. 월식협회의 지휘 아래 해결사들이 녹타르 척결 임무에 투입되고 있습니다.\n\n요원님의 다음 임무에 대한 브리핑이 필요하시면 말씀해 주십시오.`
  }
  
  // 녹타르 관련
  if (input.includes("녹타르") || input.includes("범죄") || input.includes("무법") || input.includes("네메시스") || input.includes("뤼네")) {
    return `[아카식레코드 기밀 데이터베이스: 녹타르]\n\n${WORLD_KNOWLEDGE.regions.noktar}\n\n▸ ${WORLD_KNOWLEDGE.factions.nemesis}\n\n▸ ${WORLD_KNOWLEDGE.factions.lune}\n\n경고: 녹타르 침투 임무는 최고 위험 등급으로 분류됩니다. 해당 지역에서는 적대 세력의 강화된 이능력에 주의하십시오.`
  }
  
  // 마물 관련
  if (input.includes("마물") || input.includes("게이트") || input.includes("바실라") || input.includes("몬스터")) {
    return `[아카식레코드 위협 데이터베이스: 마물]\n\n${WORLD_KNOWLEDGE.concepts.mamul}\n\n${WORLD_KNOWLEDGE.concepts.gate}\n\n${WORLD_KNOWLEDGE.regions.basila}\n\n현재 마물지대 바실라는 대륙의 약 1/3을 차지하고 있으며, 게이트 출현 빈도가 증가 추세입니다. 협회는 마물 토벌과 게이트 봉쇄 임무를 병행하고 있습니다.`
  }
  
  // 이능력 관련
  if (input.includes("이능") || input.includes("능력") || input.includes("힘") || input.includes("초능력")) {
    return `[아카식레코드 이능력 아카이브]\n\n${WORLD_KNOWLEDGE.concepts.abiliy}\n\n이능력은 인베스티아 시대부터 전해져 온 인간의 고유한 힘입니다. 각 개인마다 발현되는 형태가 다르며, 협회에서는 요원들의 이능력을 '역량'으로 분류하여 관리합니다.\n\n각 세력의 상층 권좌와 지휘 체계를 보시려면 '권좌 명부' 메뉴를 이용해 주십시오.`
  }
  
  // 현재 상황
  if (input.includes("현재") || input.includes("상황") || input.includes("지금") || input.includes("266")) {
    return `[아카식레코드 현황 보고: 유스트리아력 266년]\n\n${WORLD_KNOWLEDGE.history.year266}\n\n▸ 엘모라: 체제 안정, 범죄도시 전쟁 진행 중\n▸ 녹타르: 네메시스 vs 뤼네 패권 전쟁, 반국가 세력 지정\n▸ 바실라: 마물 점령지, 게이트 활동 증가\n\n유스트리아 대륙은 세 지역이 서로 영토를 맞대고 있는 살얼음판 상태입니다. 협회의 모든 요원은 경계 태세를 유지해 주십시오.`
  }
  
  // 세계관 전체
  if (input.includes("세계") || input.includes("대륙") || input.includes("유스트리아") || input.includes("전체") || input.includes("알려")) {
    return `[아카식레코드 종합 브리핑]\n\n유스트리아 대륙 현황을 종합 보고합니다.\n\n【지역 구분】\n▸ 엘모라 - 도시국가, 협회 본부\n▸ 녹타르 - 범죄도시, 무법지대\n▸ 바실라 - 마물지대, 위험구역\n\n【주요 세력】\n▸ 협회 - 엘모라 소속, 질서 유지\n▸ 네메시스 - 녹타르 범죄조직\n▸ 뤼네 - 녹타르 신흥 세력\n\n【핵심 개념】\n▸ 이능력 - 인간의 초자연적 능력\n▸ 마물 - 외부에서 온 적대적 존재\n▸ 게이트 - 마물 출현 통로\n\n추가 정보가 필요하시면 특정 항목에 대해 질문해 주십시오.`
  }
  
  // 기본 응답
  const defaultResponses = [
    "요청하신 정보를 아카식레코드에서 검색 중입니다.\n\n현재 유스트리아력 266년, 엘모라 협회는 범죄도시 녹타르와의 전쟁을 수행 중입니다. 필요하신 특정 정보가 있으시면 말씀해 주십시오.\n\n막막하시면 「도움말」 또는 「메뉴얼」로 검색 가이드를 먼저 열어보십시오.",
    "아카식레코드가 관련 기록을 분석하고 있습니다.\n\n현재 대륙 상황은 삼분된 세력 간의 긴장 상태입니다. 엘모라 협회 소속 요원으로서 임무 수행에 필요한 정보를 제공해 드릴 수 있습니다.\n\n검색 예시가 필요하면 「예시」 또는 「협회 목록」을 입력해 주십시오.",
    "협회 데이터베이스 접근이 승인되었습니다.\n\n유스트리아 대륙의 모든 기록이 아카식레코드에 저장되어 있습니다. 역사, 지역, 세력, 이능력, 마물 등 원하시는 정보를 요청해 주십시오.\n\n무엇을 검색할지 모르겠다면 「도움말」을 입력하십시오."
  ]
  
  return `${defaultResponses[Math.floor(Math.random() * defaultResponses.length)]}`
}

const getInitialMessages = (): Message[] => [
  {
    id: "1",
    role: "assistant",
    content: "안녕하십니까, 요원님. 여기는 아카식레코드 중앙 열람 콘솔입니다.\n\n현재 유스트리아력 266년, 모든 시스템이 정상 가동 중이며 지령을 대기하고 있습니다. 월식 및 산하·직할 협회 데이터베이스는 구축이 완료되어 있습니다.\n\n▸ 세계관 및 역사 정보\n▸ 지역 정보 (엘모라, 녹타르, 바실라)\n▸ 세력 및 위협 정보\n▸ 협회 개별 질의 (명멸 · 엑시드 · 칠성 · 여명 · 서광 · 황혼 · 월식 등)\n▸ 전체 색인 — 「협회 목록」으로 질의\n▸ 검색 가이드 — 「도움말」 또는 「메뉴얼」로 질의\n▸ 빠른 시작 — 하단 추천 검색어 선택\n\n무엇을 도와드릴까요?",
    timestamp: new Date(),
    source: "system",
  },
]

interface QuickQuery {
  query: string
  label: string
  mobileLabel: string
}

const DEFAULT_QUICK_QUERIES = ["도움말", "엘모라", "녹타르", "네메시스", "뤼네", "서고", "마나", "월식령"]

const QUICK_QUERY_LABELS: Record<string, string> = {
  "도움말": "GUIDE // 도움말",
  "엘모라": "CITY DOSSIER // 엘모라",
  "녹타르": "SHADOW DOSSIER // 녹타르",
  "뤼네": "RUINÆ FILE // 뤼네",
  "네메시스": "NEMESIS FILE // 네메시스",
  "마나": "ARCANE BRIEF // 마나",
  "협회 목록": "FACTION INDEX // 협회 목록",
  "월식령": "ECLIPSE EDICT // 월식령",
  "엘모라 상세": "CITY DOSSIER+ // 엘모라 상세",
  "에클리시아": "CAPITAL NODE // 에클리시아",
  "인덱시리온": "ARCHIVE DISTRICT // 인덱시리온",
  "팬텀마이어": "DUSK FRONTIER // 팬텀마이어",
  "세인츠포드": "INDUSTRIAL BELT // 세인츠포드",
  "프라가라흐": "NORTHERN WALL // 프라가라흐",
  "워프게이트": "TRANSIT GATE // 워프게이트",
  "샤텐라우그": "LUNAR ENGINE // 샤텐라우그",
  "월식": "ECLIPSE ORDER // 월식",
  "녹타르 상세": "NOKTAR DOSSIER+ // 녹타르 상세",
  "호라이즌": "SURFACE ZONE // 호라이즌",
  "에스카톤": "UNDER ZONE // 에스카톤",
  "암시장": "BLACK MARKET // 암시장",
  "뤼네 상세": "RUINÆ DOSSIER+ // 뤼네 상세",
  "파타르키아 뤼네": "RUINÆ CODE // 파타르키아 뤼네",
  "타뷸라 뤼네": "TABULA FILE // 타뷸라 뤼네",
  "뤼네 EDEN": "EDEN MEDIC // 뤼네 EDEN",
  "네메시스 상세": "NEMESIS DOSSIER+ // 네메시스 상세",
  "네메시스 조직도 상세": "NEMESIS CHAIN // 조직도 상세",
  "카사 프리마": "CAUSE PRIMA // 카사 프리마",
  "멘토": "MENTOR CHAIN // 멘토",
  "멘토/멘티 전환 조건": "MENTOR SHIFT // 전환 조건",
  "피라미드 의식": "RITUAL CORE // 피라미드 의식",
  "피라미드 의식 절차": "RITUAL STEPS // 의식 절차",
  "마나 상세": "ARCANE DOSSIER+ // 마나 상세",
  "제논": "XENON CORE // 제논",
  "절대성": "POWER SCALE // 절대성",
  "마나 사용자 등급 제도": "RANK FRAME // 등급 제도",
  "마나 사용자 등급": "RANK TABLE // 사용자 등급",
  "플뤼겔": "GRAY ZONE // 플뤼겔",
  "서광": "LUMINANCE ORDER // 서광",
  "황혼": "TWILIGHT ORDER // 황혼",
  "명멸": "NIGHTFALL ORDER // 명멸",
  "여명": "DAYBREAK ORDER // 여명",
  "서고": "ARCHIVE CORE // 서고",
  "공방 SOUL": "SOUL FORGE // 공방 SOUL",
  "어비스": "ABYSS ARMS // 어비스",
}

function toQuickQueries(queries: string[]): QuickQuery[] {
  return queries.map((query) => ({
    query,
    label: QUICK_QUERY_LABELS[query] ?? `QUERY // ${query}`,
    mobileLabel: query,
  }))
}

function getRecommendedQueries(input: string): QuickQuery[] {
  const lower = input.toLowerCase().trim()

  if (!lower) return toQuickQueries(DEFAULT_QUICK_QUERIES)

  if (lower.includes("도움말") || lower.includes("메뉴얼") || lower.includes("매뉴얼")) {
    return toQuickQueries(["도움말", "협회 목록", "엘모라 상세", "네메시스 상세", "마나", "월식령"])
  }

  if (
    lower.includes("엘모라") ||
    lower.includes("에클리시아") ||
    lower.includes("인덱시리온") ||
    lower.includes("팬텀마이어") ||
    lower.includes("세인츠포드") ||
    lower.includes("프라가라흐") ||
    lower.includes("샤텐라우그")
  ) {
    return toQuickQueries(["엘모라 상세", "에클리시아", "인덱시리온", "팬텀마이어", "세인츠포드", "프라가라흐", "워프게이트", "샤텐라우그"])
  }

  if (lower.includes("녹타르") || lower.includes("호라이즌") || lower.includes("에스카톤")) {
    return toQuickQueries(["녹타르 상세", "네메시스", "뤼네", "호라이즌", "에스카톤", "암시장"])
  }

  if (lower.includes("뤼네") || lower.includes("tabula") || lower.includes("타뷸라")) {
    return toQuickQueries(["뤼네 상세", "파타르키아 뤼네", "타뷸라 뤼네", "뤼네 EDEN"])
  }

  if (lower.includes("네메시스") || lower.includes("멘토") || lower.includes("피라미드")) {
    return toQuickQueries(["네메시스 상세", "네메시스 조직도 상세", "카사 프리마", "멘토/멘티 전환 조건", "피라미드 의식 절차"])
  }

  if (lower.includes("소울") || lower.includes("어비스") || lower.includes("abyss")) {
    return toQuickQueries(["공방 SOUL", "어비스", "녹타르 상세", "네메시스", "뤼네", "암시장"])
  }

  if (lower.includes("마나") || lower.includes("제논") || lower.includes("절대성") || lower.includes("등급")) {
    return toQuickQueries(["마나 상세", "제논", "절대성", "마나 사용자 등급 제도", "마나 사용자 등급", "플뤼겔"])
  }

  if (lower.includes("협회") || lower.includes("월식") || lower.includes("서광") || lower.includes("황혼") || lower.includes("명멸") || lower.includes("여명")) {
    return toQuickQueries(["협회 목록", "월식", "서광", "황혼", "명멸", "여명"])
  }

  const searchable = [
    ...DEFAULT_QUICK_QUERIES,
    "엘모라 상세",
    "에클리시아",
    "인덱시리온",
    "팬텀마이어",
    "세인츠포드",
    "프라가라흐",
    "워프게이트",
    "샤텐라우그",
    "녹타르 상세",
    "뤼네 상세",
    "파타르키아 뤼네",
    "타뷸라 뤼네",
    "네메시스 상세",
    "네메시스 조직도 상세",
    "공방 SOUL",
    "어비스",
    "멘토/멘티 전환 조건",
    "피라미드 의식 절차",
    "플뤼겔",
    "제논",
    "절대성",
    "마나 사용자 등급",
    "마나 사용자 등급 제도",
    "서광",
    "황혼",
    "명멸",
    "여명",
    "협회 목록",
    "서고",
  ]

  const matches = searchable.filter((query) => query.toLowerCase().includes(lower))
  return matches.length > 0 ? toQuickQueries(matches.slice(0, 8)) : toQuickQueries(DEFAULT_QUICK_QUERIES)
}

function getRelatedQueries(text: string): string[] {
  const lower = text.toLowerCase()

  if (text.includes("[아카식레코드: 뤼네 · 전체 기록]") || text.includes("[아카식레코드: 뤼네 · 녹타르 양대축]")) {
    return ["뤼네 상세", "파타르키아 뤼네", "타뷸라 뤼네"]
  }

  if (text.includes("[아카식레코드: 파타르키아 뤼네 · Peitharchia Ruinæ]")) {
    return ["뤼네 상세", "타뷸라 뤼네", "뤼네 EDEN"]
  }

  if (text.includes("[아카식레코드: 타뷸라 뤼네 · Tabula Ruinæ]")) {
    return ["뤼네 상세", "파타르키아 뤼네", "뤼네 EDEN"]
  }

  if (text.includes("[아카식레코드: 네메시스 · 전체 기록]") || text.includes("[아카식레코드: 네메시스 · 녹타르 양대축]")) {
    return ["네메시스 상세", "네메시스 조직도 상세", "카사 프리마"]
  }

  if (text.includes("[아카식레코드: 엘모라 세부 지역 브리핑]") || text.includes("[아카식레코드: 엘모라 요약]")) {
    return ["엘모라 상세", "에클리시아", "인덱시리온", "워프게이트"]
  }

  if (text.includes("[아카식레코드: 녹타르 세부 지역 브리핑]") || text.includes("[아카식레코드: 녹타르 요약]")) {
    return ["녹타르 상세", "호라이즌", "에스카톤", "암시장"]
  }

  if (lower.includes("검색 메뉴얼") || lower.includes("검색이 막막")) {
    return ["엘모라 상세", "네메시스 상세", "타뷸라 뤼네"]
  }

  if (lower.includes("녹타르") || lower.includes("호라이즌") || lower.includes("에스카톤")) {
    return ["녹타르 상세", "네메시스", "뤼네"]
  }

  if (lower.includes("뤼네")) {
    return ["뤼네 상세", "파타르키아 뤼네", "타뷸라 뤼네"]
  }

  if (lower.includes("네메시스")) {
    return ["네메시스 상세", "카사 프리마", "피라미드 의식 절차"]
  }

  if (lower.includes("엘모라") || lower.includes("에클리시아") || lower.includes("샤텐라우그")) {
    return ["엘모라 상세", "에클리시아", "워프게이트", "샤텐라우그"]
  }

  if (lower.includes("인덱시리온") || lower.includes("팬텀마이어") || lower.includes("세인츠포드") || lower.includes("프라가라흐")) {
    return ["엘모라 상세", "에클리시아", "워프게이트", "샤텐라우그"]
  }

  if (lower.includes("소울") || lower.includes("abyss") || lower.includes("어비스")) {
    return ["공방 SOUL", "어비스", "녹타르 상세"]
  }

  if (lower.includes("플뤼겔") || lower.includes("중립지대") || lower.includes("회색지대")) {
    return ["플뤼겔", "제논", "절대성"]
  }

  if (lower.includes("마나") || lower.includes("제논") || lower.includes("절대성") || lower.includes("등급")) {
    return ["마나 상세", "제논", "마나 사용자 등급"]
  }

  if (lower.includes("협회") || lower.includes("월식") || lower.includes("서광") || lower.includes("황혼") || lower.includes("명멸") || lower.includes("여명")) {
    return ["협회 목록", "월식", "황혼"]
  }

  return ["도움말", "협회 목록", "마나"]
}

function getQueryChipClass(query: string) {
  const tone = detectLoreTone(query)

  if (tone === "elmora") {
    return "border-sky-400/35 bg-sky-500/10 text-sky-200 hover:border-sky-300/60 hover:bg-sky-500/15"
  }

  if (tone === "noktar") {
    return "border-rose-400/35 bg-rose-500/10 text-rose-200 hover:border-rose-300/60 hover:bg-rose-500/15"
  }

  if (tone === "neutral") {
    return "border-violet-400/35 bg-violet-500/10 text-violet-200 hover:border-violet-300/60 hover:bg-violet-500/15"
  }

  return "border-border/70 bg-secondary/40 text-muted-foreground hover:border-border hover:bg-secondary/70 hover:text-foreground"
}

const buildApiMessages = (messages: Message[]): ApiMessage[] =>
  messages.map((message) => ({
    role: message.role,
    content: message.content,
  }))

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [mounted, setMounted] = useState(false)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showAllQuickQueries, setShowAllQuickQueries] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [aiMode, setAiMode] = useState<"checking" | "online" | "offline">("checking")
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const shouldAutoScrollRef = useRef(true)
  const hasInitializedMessagesRef = useRef(false)
  const activeTone = detectLoreTone(input)
  const activeToneMeta = getToneMeta(activeTone)
  const recommendedQueries = getRecommendedQueries(input)

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const container = messagesContainerRef.current
    if (!container) return

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    })
  }

  const handleMessagesScroll = () => {
    const container = messagesContainerRef.current
    if (!container) return

    const distanceFromBottom =
      container.scrollHeight - (container.scrollTop + container.clientHeight)
    shouldAutoScrollRef.current = distanceFromBottom < 120
  }

  useEffect(() => {
    setMounted(true)
    setMessages(getInitialMessages())

    const checkAiStatus = async () => {
      try {
        const res = await fetch("/api/chat/status", { method: "GET" })
        if (!res.ok) {
          setAiMode("offline")
          return
        }

        const data = (await res.json()) as {
          enabled: boolean
        }
        setAiMode(data.enabled ? "online" : "offline")
      } catch {
        setAiMode("offline")
      }
    }

    checkAiStatus()
  }, [])

  useEffect(() => {
    if (!hasInitializedMessagesRef.current) {
      hasInitializedMessagesRef.current = true
      return
    }

    if (shouldAutoScrollRef.current) {
      scrollToBottom("smooth")
    }
  }, [messages])

  useEffect(() => {
    setShowAllQuickQueries(false)
  }, [input])

  const submitQuery = async (rawInput: string) => {
    const trimmedInput = rawInput.trim()
    if (!trimmedInput || isTyping) return
    shouldAutoScrollRef.current = true

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmedInput,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    if (inputRef.current) {
      inputRef.current.style.height = "44px"
    }
    setIsTyping(true)

    const conversationForApi = [...messages, userMessage].slice(-12)
    const assistantId = (Date.now() + 1).toString()

    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        source: "pending",
      },
    ])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: buildApiMessages(conversationForApi) }),
      })

      if (!res.ok) {
        throw new Error(`AI API failed: ${res.status}`)
      }

      if (!res.body) {
        throw new Error("AI stream is empty")
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let streamedContent = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        streamedContent += decoder.decode(value, { stream: true })

        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? { ...message, content: streamedContent, source: "live-ai" }
              : message
          )
        )
      }

      if (!streamedContent.trim()) {
        throw new Error("AI stream returned empty content")
      }

    } catch {
      const fallback = generateContextualResponse(userMessage.content)
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId
            ? { ...message, content: fallback, source: "fallback" }
            : message
        )
      )
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void submitQuery(input)
  }

  const handleQuickQuery = (query: string) => {
    void submitQuery(query)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleReset = () => {
    shouldAutoScrollRef.current = true
    setMessages(getInitialMessages())
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/70 bg-card/20 px-3 py-2.5 sm:h-16 sm:px-6 sm:py-0">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 sm:h-10 sm:w-10">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
            </span>
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-wide text-foreground sm:text-lg">
              아카식레코드
            </h1>
            <div className="mt-0.5 flex items-center gap-1.5 sm:gap-2">
              <p suppressHydrationWarning className="hidden text-xs tracking-widest text-muted-foreground sm:block">
                AKASHIC RECORD QUERY CONSOLE
              </p>
              <span
                suppressHydrationWarning
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[9px] tracking-wide sm:text-[10px]",
                  aiMode === "online" && "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
                  aiMode === "offline" && "border-amber-400/40 bg-amber-500/10 text-amber-300",
                  aiMode === "checking" && "border-border/70 bg-secondary/40 text-muted-foreground"
                )}
              >
                {aiMode === "online"
                  ? (
                    <>
                      <span className="sm:hidden">ONLINE</span>
                      <span className="hidden sm:inline">ARCHIVE ONLINE</span>
                    </>
                  )
                  : aiMode === "offline"
                  ? (
                    <>
                      <span className="sm:hidden">LOCAL</span>
                      <span className="hidden sm:inline">LOCAL ARCHIVE</span>
                    </>
                  )
                  : (
                    <>
                      <span className="sm:hidden">CHECK</span>
                      <span className="hidden sm:inline">STATUS CHECKING</span>
                    </>
                  )}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 rounded-xl border border-transparent px-2 py-2 text-[11px] text-muted-foreground transition-colors hover:border-border/70 hover:bg-secondary/70 hover:text-foreground sm:gap-2 sm:px-3 sm:text-xs"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">대화 초기화</span>
          <span className="sm:hidden">초기화</span>
        </button>
      </header>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleMessagesScroll}
        className="flex-1 overflow-y-auto px-2.5 py-4 sm:px-6 sm:py-5"
      >
        <div className="mx-auto max-w-4xl space-y-5 sm:space-y-6">
          {messages.map((message) => (
            (() => {
              const tone = message.role === "assistant" ? detectLoreTone(message.content) : "default"
              const toneMeta = getToneMeta(tone)

              return (
            <div
              key={message.id}
              className={cn(
                "group flex gap-3 sm:gap-4",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9",
                  message.role === "assistant"
                    ? toneMeta.avatar
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {message.role === "assistant" ? (
                  <Sparkles className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={cn(
                  "relative max-w-[96%] rounded-2xl border px-3 py-2.5 shadow-sm sm:max-w-[78%] sm:px-4 sm:py-3",
                  message.role === "assistant"
                    ? toneMeta.bubble
                    : "rounded-tr-sm border-primary/40 bg-primary text-primary-foreground"
                )}
              >
                {message.role === "assistant" && (
                  <>
                    <span className={cn("mb-2 block h-[2px] w-20 rounded-full", toneMeta.accent)} />
                    <p className="mb-1 text-[9px] tracking-[0.14em] text-muted-foreground/80 sm:text-[10px] sm:tracking-[0.18em]">{toneMeta.label}</p>
                  </>
                )}
                <p className="whitespace-pre-wrap text-[13px] leading-6 sm:text-sm sm:leading-relaxed">
                  {message.content}
                </p>
                {message.role === "assistant" && message.source !== "pending" && (
                  <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                    {getRelatedQueries(message.content).map((query) => (
                      <button
                        key={`${message.id}-${query}`}
                        type="button"
                        onClick={() => handleQuickQuery(query)}
                        disabled={isTyping}
                        className={cn(
                          "rounded-full border px-2.5 py-1.5 text-[11px] tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:py-1 sm:text-[10px]",
                          getQueryChipClass(query)
                        )}
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                )}
                <div
                  className={cn(
                    "mt-2 flex items-center gap-2 text-[10px]",
                    message.role === "assistant"
                      ? toneMeta.time
                      : "text-primary-foreground/70"
                  )}
                >
                  <span suppressHydrationWarning>
                    {mounted ? message.timestamp.toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) : "--:--"}
                  </span>

                  {message.role === "assistant" && message.source && (
                    <span
                      className={cn(
                        "rounded-full border px-1.5 py-0.5 text-[9px] tracking-wide",
                        message.source === "live-ai" && "border-emerald-400/35 bg-emerald-500/10 text-emerald-300",
                        message.source === "fallback" && "border-amber-400/35 bg-amber-500/10 text-amber-300",
                        message.source === "pending" && "border-border/60 bg-secondary/30 text-muted-foreground",
                        message.source === "system" && "border-sky-400/35 bg-sky-500/10 text-sky-300"
                      )}
                    >
                      {message.source === "live-ai"
                        ? "실시간 기록"
                        : message.source === "fallback"
                        ? "보관 기록"
                        : message.source === "pending"
                        ? "조회 중"
                        : "SYSTEM"}
                    </span>
                  )}

                  {message.role === "assistant" && (
                    <button
                      onClick={() => handleCopy(message.content, message.id)}
                      className="opacity-70 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      {copiedId === message.id ? (
                        <Check className="h-3 w-3 text-primary" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
              )
            })()
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 sm:gap-4">
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9", activeToneMeta.avatar)}>
                <Sparkles className="h-4 w-4" />
              </div>
              <div className={cn("flex items-center gap-1.5 rounded-2xl rounded-tl-sm border px-4 py-3", activeToneMeta.bubble)}>
                <span className={cn("h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]", activeToneMeta.accent)} />
                <span className={cn("h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]", activeToneMeta.accent)} />
                <span className={cn("h-2 w-2 animate-bounce rounded-full", activeToneMeta.accent)} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border/70 bg-card/20 p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
          <div className="mb-3">
            <span className="mb-2 block text-[10px] tracking-[0.2em] text-muted-foreground">작전 추천 키워드</span>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:hidden">
            {(showAllQuickQueries ? recommendedQueries : recommendedQueries.slice(0, 5)).map((quickQuery) => (
              <button
                key={quickQuery.query}
                type="button"
                onClick={() => handleQuickQuery(quickQuery.query)}
                disabled={isTyping}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-[11px] transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs",
                  getQueryChipClass(quickQuery.query)
                )}
              >
                <span className="sm:hidden">{quickQuery.mobileLabel}</span>
                <span className="hidden sm:inline">{quickQuery.label}</span>
              </button>
            ))}
            </div>
            {recommendedQueries.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllQuickQueries((prev) => !prev)}
                className="mt-1 text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline sm:hidden"
              >
                {showAllQuickQueries ? "추천 키워드 접기" : "추천 키워드 더보기"}
              </button>
            )}
            <div className="hidden flex-wrap items-center gap-2 sm:flex">
            {recommendedQueries.map((quickQuery) => (
              <button
                key={`desktop-${quickQuery.query}`}
                type="button"
                onClick={() => handleQuickQuery(quickQuery.query)}
                disabled={isTyping}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                  getQueryChipClass(quickQuery.query)
                )}
              >
                {quickQuery.label}
              </button>
            ))}
            </div>
          </div>
          <div className={cn("relative flex items-end rounded-2xl border bg-card/80 p-2 transition-colors", input.trim() ? "border-primary/40" : "border-border/70", activeTone === "elmora" && "focus-within:border-sky-400/60", activeTone === "noktar" && "focus-within:border-rose-400/60", activeTone === "neutral" && "focus-within:border-violet-400/60", activeTone === "default" && "focus-within:border-primary/50")}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="예: 뤼네, 네메시스 상세, 마나 등급"
              rows={1}
              className="max-h-32 min-h-[48px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-[13px] placeholder:text-muted-foreground focus:outline-none"
              style={{
                height: "auto",
                minHeight: "48px",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = "auto"
                target.style.height = `${Math.min(target.scrollHeight, 128)}px`
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all sm:h-10 sm:w-10",
                input.trim() && !isTyping
                  ? activeTone === "elmora"
                    ? "border-sky-400/60 bg-sky-500 text-white hover:bg-sky-500/90"
                    : activeTone === "noktar"
                    ? "border-rose-500/60 bg-rose-500 text-white hover:bg-rose-500/90"
                    : activeTone === "neutral"
                    ? "border-violet-400/60 bg-violet-500 text-white hover:bg-violet-500/90"
                    : "border-primary/60 bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-transparent bg-secondary text-muted-foreground"
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 flex flex-col gap-1 text-center text-[11px] tracking-wide text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left sm:text-[10px] sm:tracking-wider">
            <p>추천 검색어를 누르거나 직접 입력해 바로 조회할 수 있습니다</p>
            <p>모든 대화는 보안 프로토콜에 따라 기록됩니다</p>
          </div>
        </form>
      </div>
    </div>
  )
}
