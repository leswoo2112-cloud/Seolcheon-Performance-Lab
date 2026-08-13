/* ============================================================
   SEOLCHEON SPORTS PERFORMANCE LAB
   SPORTS.JS
   4 / 6

   담당 기능
   - 동계 / 하계 종목 데이터베이스
   - 종목 카드 자동 생성
   - 선수 등록 / 수정 / 삭제
   - 선수 검색 / 필터
   - 선수 선택
   - 선수 → 자세분석 연결
   - 종목별 분석 항목
   - 바이애슬론 / XC 스키 특수 분석
   - 육상 러닝 분석
   - 역도 바벨 분석
============================================================ */

"use strict";


/* ============================================================
   01. SPORT DATABASE
============================================================ */

const SPORTS_DATABASE = {


  /* ========================================================
     WINTER
  ======================================================== */

  winter: {


    biathlon: {

      id: "biathlon",

      name: "바이애슬론",

      english: "BIATHLON",

      icon: "🎿",

      season: "winter",

      category: "ski",

      description:
        "스키 주법 · 구간 · 경사 · 자세 · 기술 전환 분석",

      metrics: [

        {
          key: "speed",
          name: "속도",
          unit: "km/h"
        },

        {
          key: "distance",
          name: "이동 거리",
          unit: "m"
        },

        {
          key: "cadence",
          name: "동작 빈도",
          unit: "spm"
        },

        {
          key: "glide",
          name: "글라이드",
          unit: "m"
        },

        {
          key: "poleTiming",
          name: "폴링 타이밍",
          unit: "ms"
        },

        {
          key: "slope",
          name: "경사도",
          unit: "%"
        },

        {
          key: "elevationGain",
          name: "상승고도",
          unit: "m"
        },

        {
          key: "segmentTime",
          name: "구간 시간",
          unit: "s"
        }

      ],

      angles: [

        "왼쪽 무릎",
        "오른쪽 무릎",

        "왼쪽 고관절",
        "오른쪽 고관절",

        "왼쪽 발목",
        "오른쪽 발목",

        "왼쪽 팔꿈치",
        "오른쪽 팔꿈치",

        "몸통 기울기"

      ],

      techniques: [

        "V1",

        "V2",

        "V2 Alternate",

        "Double Pole",

        "Free Skate",

        "Transition"

      ],

      special: [

        "ski-technique",
        "segment",
        "terrain",
        "trajectory"

      ]

    },



    crossCountry: {

      id: "crossCountry",

      name: "크로스컨트리",

      english: "CROSS COUNTRY SKIING",

      icon: "⛷",

      season: "winter",

      category: "ski",

      description:
        "스케이팅 · 클래식 주법 및 코스 구간 분석",

      metrics: [

        {
          key: "speed",
          name: "속도",
          unit: "km/h"
        },

        {
          key: "distance",
          name: "거리",
          unit: "m"
        },

        {
          key: "cadence",
          name: "주기",
          unit: "spm"
        },

        {
          key: "glide",
          name: "글라이드",
          unit: "m"
        },

        {
          key: "poleTiming",
          name: "폴링 타이밍",
          unit: "ms"
        },

        {
          key: "slope",
          name: "경사",
          unit: "%"
        },

        {
          key: "elevationGain",
          name: "상승고도",
          unit: "m"
        }

      ],

      angles: [

        "왼쪽 무릎",
        "오른쪽 무릎",

        "왼쪽 고관절",
        "오른쪽 고관절",

        "왼쪽 발목",
        "오른쪽 발목",

        "왼쪽 팔꿈치",
        "오른쪽 팔꿈치",

        "몸통 기울기"

      ],

      techniques: [

        "V1",

        "V2",

        "V2 Alternate",

        "Double Pole",

        "Diagonal Stride",

        "Kick Double Pole"

      ],

      special: [

        "ski-technique",
        "segment",
        "terrain",
        "trajectory"

      ]

    },



    alpineSki: {

      id: "alpineSki",

      name: "알파인스키",

      english: "ALPINE SKIING",

      icon: "⛷",

      season: "winter",

      category: "ski",

      description:
        "턴 · 엣지 · 무게중심 · 좌우 대칭 분석",

      metrics: [

        {
          key: "speed",
          name: "속도",
          unit: "km/h"
        },

        {
          key: "turnAngle",
          name: "턴 각도",
          unit: "°"
        },

        {
          key: "edgeAngle",
          name: "엣지 각도",
          unit: "°"
        },

        {
          key: "balance",
          name: "균형",
          unit: "%"
        }

      ],

      angles: [

        "왼쪽 무릎",
        "오른쪽 무릎",
        "왼쪽 고관절",
        "오른쪽 고관절",
        "몸통 기울기"

      ],

      techniques: [

        "Carving",
        "Transition",
        "Edge Control"

      ],

      special: [

        "terrain",
        "trajectory"

      ]

    },



    snowboard: {

      id: "snowboard",

      name: "스노보드",

      english: "SNOWBOARD",

      icon: "🏂",

      season: "winter",

      category: "board",

      description:
        "턴 · 중심 이동 · 엣지 컨트롤 분석",

      metrics: [

        {
          key: "speed",
          name: "속도",
          unit: "km/h"
        },

        {
          key: "edgeAngle",
          name: "엣지 각도",
          unit: "°"
        },

        {
          key: "balance",
          name: "균형",
          unit: "%"
        }

      ],

      angles: [

        "왼쪽 무릎",
        "오른쪽 무릎",
        "고관절",
        "몸통"

      ],

      techniques: [

        "Heel Turn",
        "Toe Turn",
        "Transition"

      ],

      special: [

        "terrain",
        "trajectory"

      ]

    },



    speedSkating: {

      id: "speedSkating",

      name: "스피드스케이팅",

      english: "SPEED SKATING",

      icon: "⛸",

      season: "winter",

      category: "skating",

      description:
        "푸시 · 글라이드 · 자세 높이 · 좌우 대칭 분석",

      metrics: [

        {
          key: "cadence",
          name: "케이던스",
          unit: "spm"
        },

        {
          key: "glide",
          name: "글라이드",
          unit: "m"
        },

        {
          key: "pushTime",
          name: "푸시 시간",
          unit: "ms"
        },

        {
          key: "speed",
          name: "속도",
          unit: "km/h"
        }

      ],

      angles: [

        "왼쪽 무릎",
        "오른쪽 무릎",
        "왼쪽 고관절",
        "오른쪽 고관절",
        "몸통 기울기"

      ],

      techniques: [

        "Straight",
        "Corner",
        "Push",
        "Glide"

      ],

      special: [
        "trajectory"
      ]

    },



    shortTrack: {

      id: "shortTrack",

      name: "쇼트트랙",

      english: "SHORT TRACK",

      icon: "⛸",

      season: "winter",

      category: "skating",

      description:
        "코너링 · 중심 이동 · 푸시 동작 분석",

      metrics: [

        {
          key: "speed",
          name: "속도",
          unit: "km/h"
        },

        {
          key: "leanAngle",
          name: "기울기",
          unit: "°"
        },

        {
          key: "cadence",
          name: "케이던스",
          unit: "spm"
        }

      ],

      angles: [

        "왼쪽 무릎",
        "오른쪽 무릎",
        "고관절",
        "몸통"

      ],

      techniques: [

        "Straight",
        "Corner",
        "Cross Over"

      ],

      special: [
        "trajectory"
      ]

    },



    figureSkating: {

      id: "figureSkating",

      name: "피겨스케이팅",

      english: "FIGURE SKATING",

      icon: "⛸",

      season: "winter",

      category: "skating",

      description:
        "점프 · 회전 · 착지 · 균형 분석",

      metrics: [

        {
          key: "jumpHeight",
          name: "점프 높이",
          unit: "cm"
        },

        {
          key: "rotation",
          name: "회전",
          unit: "°"
        },

        {
          key: "landing",
          name: "착지 안정성",
          unit: "%"
        }

      ],

      angles: [

        "무릎",
        "고관절",
        "발목",
        "몸통"

      ],

      techniques: [

        "Take Off",
        "Rotation",
        "Landing"

      ],

      special: [
        "trajectory"
      ]

    },



    skiJumping: {

      id: "skiJumping",

      name: "스키점프",

      english: "SKI JUMPING",

      icon: "🎿",

      season: "winter",

      category: "jump",

      description:
        "도약 · 비행 자세 · 착지 자세 분석",

      metrics: [

        {
          key: "takeoffSpeed",
          name: "도약 속도",
          unit: "km/h"
        },

        {
          key: "takeoffAngle",
          name: "도약 각도",
          unit: "°"
        },

        {
          key: "flightAngle",
          name: "비행 각도",
          unit: "°"
        }

      ],

      angles: [

        "무릎",
        "고관절",
        "발목",
        "몸통"

      ],

      techniques: [

        "Approach",
        "Take Off",
        "Flight",
        "Landing"

      ],

      special: [
        "trajectory"
      ]

    },



    skeleton: {

      id: "skeleton",

      name: "스켈레톤",

      english: "SKELETON",

      icon: "🛷",

      season: "winter",

      category: "sliding",

      description:
        "스타트 · 가속 · 푸시 자세 분석",

      metrics: [

        {
          key: "startTime",
          name: "스타트",
          unit: "s"
        },

        {
          key: "speed",
          name: "속도",
          unit: "km/h"
        }

      ],

      angles: [

        "무릎",
        "고관절",
        "몸통"

      ],

      techniques: [

        "Start",
        "Push",
        "Load"

      ],

      special: [
        "running",
        "trajectory"
      ]

    },



    bobsleigh: {

      id: "bobsleigh",

      name: "봅슬레이",

      english: "BOBSLEIGH",

      icon: "🛷",

      season: "winter",

      category: "sliding",

      description:
        "스타트 스프린트 · 푸시 · 탑승 분석",

      metrics: [

        {
          key: "startTime",
          name: "스타트",
          unit: "s"
        },

        {
          key: "cadence",
          name: "케이던스",
          unit: "spm"
        },

        {
          key: "speed",
          name: "속도",
          unit: "km/h"
        }

      ],

      angles: [

        "무릎",
        "고관절",
        "발목",
        "몸통"

      ],

      techniques: [

        "Start",
        "Push",
        "Load"

      ],

      special: [
        "running",
        "trajectory"
      ]

    },



    luge: {

      id: "luge",

      name: "루지",

      english: "LUGE",

      icon: "🛷",

      season: "winter",

      category: "sliding",

      description:
        "스타트 동작 · 당기기 · 자세 안정성 분석",

      metrics: [

        {
          key: "startTime",
          name: "스타트",
          unit: "s"
        },

        {
          key: "pullPower",
          name: "스타트 파워",
          unit: "%"
        }

      ],

      angles: [

        "어깨",
        "팔꿈치",
        "고관절",
        "몸통"

      ],

      techniques: [

        "Start",
        "Pull",
        "Drive"

      ],

      special: [
        "trajectory"
      ]

    },



    curling: {

      id: "curling",

      name: "컬링",

      english: "CURLING",

      icon: "🥌",

      season: "winter",

      category: "precision",

      description:
        "딜리버리 · 슬라이드 · 균형 자세 분석",

      metrics: [

        {
          key: "slideTime",
          name: "슬라이드 시간",
          unit: "s"
        },

        {
          key: "balance",
          name: "균형",
          unit: "%"
        }

      ],

      angles: [

        "무릎",
        "고관절",
        "몸통",
        "팔꿈치"

      ],

      techniques: [

        "Delivery",
        "Slide",
        "Release"

      ],

      special: [
        "trajectory"
      ]

    }

  },



  /* ========================================================
     SUMMER
  ======================================================== */

  summer: {


    sprint: {

      id: "sprint",

      name: "육상 단거리",

      english: "SPRINT",

      icon: "🏃",

      season: "summer",

      category: "running",

      description:
        "스타트 · 가속 · 최고속도 · 러닝 자세 분석",

      metrics: [

        {
          key: "speed",
          name: "속도",
          unit: "km/h"
        },

        {
          key: "cadence",
          name: "케이던스",
          unit: "spm"
        },

        {
          key: "strideLength",
          name: "보폭",
          unit: "m"
        },

        {
          key: "groundContactTime",
          name: "접지시간",
          unit: "ms"
        },

        {
          key: "flightTime",
          name: "비행시간",
          unit: "ms"
        }

      ],

      angles: [

        "왼쪽 무릎",
        "오른쪽 무릎",

        "왼쪽 고관절",
        "오른쪽 고관절",

        "왼쪽 발목",
        "오른쪽 발목",

        "왼쪽 팔꿈치",
        "오른쪽 팔꿈치",

        "몸통 기울기"

      ],

      techniques: [

        "Start",
        "Acceleration",
        "Max Velocity",
        "Finish"

      ],

      special: [

        "running",
        "segment",
        "trajectory"

      ]

    },



    middleDistance: {

      id: "middleDistance",

      name: "육상 중거리",

      english: "MIDDLE DISTANCE",

      icon: "🏃",

      season: "summer",

      category: "running",

      description:
        "러닝 경제성 · 케이던스 · 보폭 분석",

      metrics: [

        {
          key: "speed",
          name: "속도",
          unit: "km/h"
        },

        {
          key: "cadence",
          name: "케이던스",
          unit: "spm"
        },

        {
          key: "strideLength",
          name: "보폭",
          unit: "m"
        },

        {
          key: "groundContactTime",
          name: "접지시간",
          unit: "ms"
        }

      ],

      angles: [

        "무릎",
        "고관절",
        "발목",
        "몸통"

      ],

      techniques: [

        "Acceleration",
        "Cruise",
        "Kick"

      ],

      special: [

        "running",
        "segment",
        "trajectory"

      ]

    },



    longDistance: {

      id: "longDistance",

      name: "육상 장거리",

      english: "LONG DISTANCE",

      icon: "🏃",

      season: "summer",

      category: "running",

      description:
        "러닝 경제성 · 페이스 · 보폭 · 접지 분석",

      metrics: [

        {
          key: "pace",
          name: "페이스",
          unit: "min/km"
        },

        {
          key: "cadence",
          name: "케이던스",
          unit: "spm"
        },

        {
          key: "strideLength",
          name: "보폭",
          unit: "m"
        },

        {
          key: "groundContactTime",
          name: "접지시간",
          unit: "ms"
        }

      ],

      angles: [

        "무릎",
        "고관절",
        "발목",
        "몸통"

      ],

      techniques: [

        "Running",
        "Uphill",
        "Downhill",
        "Finish"

      ],

      special: [

        "running",
        "segment",
        "terrain",
        "trajectory"

      ]

    },



    hurdles: {

      id: "hurdles",

      name: "허들",

      english: "HURDLES",

      icon: "🏃",

      season: "summer",

      category: "running",

      description:
        "허들 진입 · 리드레그 · 트레일레그 · 착지 분석",

      metrics: [

        {
          key: "approachSpeed",
          name: "진입 속도",
          unit: "km/h"
        },

        {
          key: "flightTime",
          name: "허들 비행",
          unit: "ms"
        },

        {
          key: "landingTime",
          name: "착지 시간",
          unit: "ms"
        }

      ],

      angles: [

        "리드 무릎",
        "트레일 무릎",
        "고관절",
        "몸통"

      ],

      techniques: [

        "Approach",
        "Take Off",
        "Clearance",
        "Landing"

      ],

      special: [
        "running",
        "trajectory"
      ]

    },



    raceWalking: {

      id: "raceWalking",

      name: "경보",

      english: "RACE WALKING",

      icon: "🚶",

      season: "summer",

      category: "running",

      description:
        "접지 · 무릎 신전 · 골반 움직임 분석",

      metrics: [

        {
          key: "cadence",
          name: "케이던스",
          unit: "spm"
        },

        {
          key: "strideLength",
          name: "보폭",
          unit: "m"
        },

        {
          key: "groundContactTime",
          name: "접지시간",
          unit: "ms"
        }

      ],

      angles: [

        "무릎",
        "고관절",
        "발목",
        "몸통"

      ],

      techniques: [

        "Contact",
        "Mid Stance",
        "Push"

      ],

      special: [
        "running",
        "trajectory"
      ]

    },



    longJump: {

      id: "longJump",

      name: "멀리뛰기",

      english: "LONG JUMP",

      icon: "🏃",

      season: "summer",

      category: "jump",

      description:
        "도움닫기 · 발구름 · 비행 · 착지 분석",

      metrics: [

        {
          key: "approachSpeed",
          name: "도움닫기 속도",
          unit: "km/h"
        },

        {
          key: "takeoffAngle",
          name: "도약각",
          unit: "°"
        },

        {
          key: "flightTime",
          name: "비행시간",
          unit: "s"
        }

      ],

      angles: [

        "무릎",
        "고관절",
        "발목",
        "몸통"

      ],

      techniques: [

        "Approach",
        "Take Off",
        "Flight",
        "Landing"

      ],

      special: [
        "running",
        "trajectory"
      ]

    },



    tripleJump: {

      id: "tripleJump",

      name: "세단뛰기",

      english: "TRIPLE JUMP",

      icon: "🏃",

      season: "summer",

      category: "jump",

      description:
        "홉 · 스텝 · 점프 구간 분석",

      metrics: [

        {
          key: "approachSpeed",
          name: "진입속도",
          unit: "km/h"
        },

        {
          key: "hopDistance",
          name: "홉 거리",
          unit: "m"
        },

        {
          key: "stepDistance",
          name: "스텝 거리",
          unit: "m"
        },

        {
          key: "jumpDistance",
          name: "점프 거리",
          unit: "m"
        }

      ],

      angles: [

        "무릎",
        "고관절",
        "발목",
        "몸통"

      ],

      techniques: [

        "Hop",
        "Step",
        "Jump"

      ],

      special: [
        "segment",
        "trajectory"
      ]

    },



    highJump: {

      id: "highJump",

      name: "높이뛰기",

      english: "HIGH JUMP",

      icon: "🏃",

      season: "summer",

      category: "jump",

      description:
        "도움닫기 · 도약 · 바 클리어런스 분석",

      metrics: [

        {
          key: "approachSpeed",
          name: "도움닫기 속도",
          unit: "km/h"
        },

        {
          key: "takeoffAngle",
          name: "도약각",
          unit: "°"
        },

        {
          key: "jumpHeight",
          name: "높이",
          unit: "m"
        }

      ],

      angles: [

        "무릎",
        "고관절",
        "발목",
        "몸통"

      ],

      techniques: [

        "Approach",
        "Take Off",
        "Clearance",
        "Landing"

      ],

      special: [
        "trajectory"
      ]

    },



    poleVault: {

      id: "poleVault",

      name: "장대높이뛰기",

      english: "POLE VAULT",

      icon: "🏃",

      season: "summer",

      category: "jump",

      description:
        "도움닫기 · 장대 삽입 · 도약 · 회전 분석",

      metrics: [

        {
          key: "approachSpeed",
          name: "도움닫기",
          unit: "km/h"
        },

        {
          key: "takeoffAngle",
          name: "도약각",
          unit: "°"
        },

        {
          key: "height",
          name: "높이",
          unit: "m"
        }

      ],

      angles: [

        "어깨",
        "팔꿈치",
        "고관절",
        "무릎"

      ],

      techniques: [

        "Approach",
        "Plant",
        "Take Off",
        "Swing",
        "Clearance"

      ],

      special: [
        "trajectory"
      ]

    },



    shotPut: {

      id: "shotPut",

      name: "포환던지기",

      english: "SHOT PUT",

      icon: "⚫",

      season: "summer",

      category: "throw",

      description:
        "회전 · 릴리스 · 투사각 분석",

      metrics: [

        {
          key: "releaseSpeed",
          name: "릴리스 속도",
          unit: "m/s"
        },

        {
          key: "releaseAngle",
          name: "릴리스 각도",
          unit: "°"
        }

      ],

      angles: [

        "어깨",
        "팔꿈치",
        "고관절",
        "무릎",
        "몸통"

      ],

      techniques: [

        "Glide",
        "Rotation",
        "Release"

      ],

      special: [
        "trajectory"
      ]

    },



    discus: {

      id: "discus",

      name: "원반던지기",

      english: "DISCUS",

      icon: "🥏",

      season: "summer",

      category: "throw",

      description:
        "회전 · 중심 이동 · 릴리스 분석",

      metrics: [

        {
          key: "releaseSpeed",
          name: "릴리스 속도",
          unit: "m/s"
        },

        {
          key: "releaseAngle",
          name: "릴리스 각도",
          unit: "°"
        }

      ],

      angles: [

        "어깨",
        "고관절",
        "무릎",
        "몸통"

      ],

      techniques: [

        "Wind Up",
        "Rotation",
        "Release"

      ],

      special: [
        "trajectory"
      ]

    },



    javelin: {

      id: "javelin",

      name: "창던지기",

      english: "JAVELIN",

      icon: "➶",

      season: "summer",

      category: "throw",

      description:
        "도움닫기 · 크로스스텝 · 릴리스 분석",

      metrics: [

        {
          key: "approachSpeed",
          name: "진입 속도",
          unit: "km/h"
        },

        {
          key: "releaseSpeed",
          name: "릴리스 속도",
          unit: "m/s"
        },

        {
          key: "releaseAngle",
          name: "릴리스 각도",
          unit: "°"
        }

      ],

      angles: [

        "어깨",
        "팔꿈치",
        "고관절",
        "무릎",
        "몸통"

      ],

      techniques: [

        "Approach",
        "Cross Step",
        "Block",
        "Release"

      ],

      special: [
        "running",
        "trajectory"
      ]

    },



    hammerThrow: {

      id: "hammerThrow",

      name: "해머던지기",

      english: "HAMMER THROW",

      icon: "⚫",

      season: "summer",

      category: "throw",

      description:
        "회전 · 중심축 · 릴리스 분석",

      metrics: [

        {
          key: "rotationSpeed",
          name: "회전 속도",
          unit: "°/s"
        },

        {
          key: "releaseSpeed",
          name: "릴리스 속도",
          unit: "m/s"
        }

      ],

      angles: [

        "어깨",
        "고관절",
        "무릎",
        "몸통"

      ],

      techniques: [

        "Wind",
        "Turn",
        "Release"

      ],

      special: [
        "trajectory"
      ]

    },



    weightlifting: {

      id: "weightlifting",

      name: "역도",

      english: "WEIGHTLIFTING",

      icon: "🏋️",

      season: "summer",

      category: "strength",

      description:
        "바벨 궤적 · 1차 풀 · 2차 풀 · 캐치 자세 분석",

      metrics: [

        {
          key: "horizontalDeviation",
          name: "바벨 수평 편차",
          unit: "cm"
        },

        {
          key: "peakVelocity",
          name: "최대 속도",
          unit: "m/s"
        },

        {
          key: "firstPull",
          name: "1차 풀",
          unit: "s"
        },

        {
          key: "secondPull",
          name: "2차 풀",
          unit: "s"
        }

      ],

      angles: [

        "무릎",
        "고관절",
        "발목",
        "어깨",
        "팔꿈치",
        "몸통"

      ],

      techniques: [

        "First Pull",
        "Second Pull",
        "Turnover",
        "Catch",
        "Recovery"

      ],

      special: [

        "barbell",
        "trajectory"

      ]

    },



    swimming: {

      id: "swimming",

      name: "수영",

      english: "SWIMMING",

      icon: "🏊",

      season: "summer",

      category: "aquatic",

      description:
        "스트로크 · 회전 · 좌우 대칭 분석",

      metrics: [

        {
          key: "strokeRate",
          name: "스트로크율",
          unit: "spm"
        },

        {
          key: "strokeLength",
          name: "스트로크 길이",
          unit: "m"
        }

      ],

      angles: [

        "어깨",
        "팔꿈치",
        "고관절",
        "무릎"

      ],

      techniques: [

        "Catch",
        "Pull",
        "Push",
        "Recovery"

      ],

      special: [
        "trajectory"
      ]

    },



    cycling: {

      id: "cycling",

      name: "사이클",

      english: "CYCLING",

      icon: "🚴",

      season: "summer",

      category: "cycling",

      description:
        "페달링 · 무릎 궤적 · 좌우 대칭 분석",

      metrics: [

        {
          key: "cadence",
          name: "케이던스",
          unit: "rpm"
        },

        {
          key: "powerBalance",
          name: "좌우 밸런스",
          unit: "%"
        }

      ],

      angles: [

        "무릎",
        "고관절",
        "발목",
        "몸통"

      ],

      techniques: [

        "Downstroke",
        "Bottom",
        "Upstroke",
        "Top"

      ],

      special: [
        "trajectory"
      ]

    },



    rowing: {

      id: "rowing",

      name: "조정",

      english: "ROWING",

      icon: "🚣",

      season: "summer",

      category: "rowing",

      description:
        "캐치 · 드라이브 · 피니시 · 리커버리 분석",

      metrics: [

        {
          key: "strokeRate",
          name: "스트로크율",
          unit: "spm"
        },

        {
          key: "driveTime",
          name: "드라이브 시간",
          unit: "ms"
        }

      ],

      angles: [

        "무릎",
        "고관절",
        "몸통",
        "팔꿈치"

      ],

      techniques: [

        "Catch",
        "Drive",
        "Finish",
        "Recovery"

      ],

      special: [
        "trajectory"
      ]

    },



    football: createBallSport(

      "football",
      "축구",
      "FOOTBALL",
      "⚽"

    ),



    basketball: createBallSport(

      "basketball",
      "농구",
      "BASKETBALL",
      "🏀"

    ),



    volleyball: createBallSport(

      "volleyball",
      "배구",
      "VOLLEYBALL",
      "🏐"

    ),



    handball: createBallSport(

      "handball",
      "핸드볼",
      "HANDBALL",
      "🤾"

    ),



    baseball: createBallSport(

      "baseball",
      "야구",
      "BASEBALL",
      "⚾"

    ),



    tennis: createRacketSport(

      "tennis",
      "테니스",
      "TENNIS",
      "🎾"

    ),



    badminton: createRacketSport(

      "badminton",
      "배드민턴",
      "BADMINTON",
      "🏸"

    ),



    tableTennis: createRacketSport(

      "tableTennis",
      "탁구",
      "TABLE TENNIS",
      "🏓"

    ),



    taekwondo: createCombatSport(

      "taekwondo",
      "태권도",
      "TAEKWONDO",
      "🥋"

    ),



    judo: createCombatSport(

      "judo",
      "유도",
      "JUDO",
      "🥋"

    ),



    wrestling: createCombatSport(

      "wrestling",
      "레슬링",
      "WRESTLING",
      "🤼"

    ),



    boxing: createCombatSport(

      "boxing",
      "복싱",
      "BOXING",
      "🥊"

    ),



    fencing: {

      id: "fencing",

      name: "펜싱",

      english: "FENCING",

      icon: "🤺",

      season: "summer",

      category: "combat",

      description:
        "런지 · 스텝 · 공격 자세 분석",

      metrics: [

        {
          key: "reaction",
          name: "반응",
          unit: "ms"
        },

        {
          key: "lungeDistance",
          name: "런지 거리",
          unit: "m"
        }

      ],

      angles: [

        "무릎",
        "고관절",
        "어깨",
        "팔꿈치"

      ],

      techniques: [

        "Advance",
        "Retreat",
        "Lunge",
        "Attack"

      ],

      special: [
        "trajectory"
      ]

    },



    gymnastics: {

      id: "gymnastics",

      name: "체조",

      english: "GYMNASTICS",

      icon: "🤸",

      season: "summer",

      category: "gymnastics",

      description:
        "회전 · 점프 · 착지 · 신체 정렬 분석",

      metrics: [

        {
          key: "rotation",
          name: "회전",
          unit: "°"
        },

        {
          key: "jumpHeight",
          name: "점프 높이",
          unit: "cm"
        },

        {
          key: "landing",
          name: "착지 안정성",
          unit: "%"
        }

      ],

      angles: [

        "어깨",
        "팔꿈치",
        "고관절",
        "무릎",
        "발목",
        "몸통"

      ],

      techniques: [

        "Take Off",
        "Flight",
        "Rotation",
        "Landing"

      ],

      special: [
        "trajectory"
      ]

    }

  }

};


/* ============================================================
   02. SPORT TEMPLATE
============================================================ */

function createBallSport(
  id,
  name,
  english,
  icon
) {

  return {

    id,
    name,
    english,
    icon,

    season:
      "summer",

    category:
      "ball",

    description:
      `${name} 이동 · 점프 · 방향전환 · 자세 분석`,

    metrics: [

      {
        key: "speed",
        name: "이동 속도",
        unit: "km/h"
      },

      {
        key: "acceleration",
        name: "가속",
        unit: "m/s²"
      },

      {
        key: "jumpHeight",
        name: "점프 높이",
        unit: "cm"
      }

    ],

    angles: [

      "왼쪽 무릎",
      "오른쪽 무릎",
      "고관절",
      "발목",
      "몸통"

    ],

    techniques: [

      "Acceleration",
      "Deceleration",
      "Change Direction",
      "Jump",
      "Landing"

    ],

    special: [

      "running",
      "trajectory"

    ]

  };

}


function createRacketSport(
  id,
  name,
  english,
  icon
) {

  return {

    id,
    name,
    english,
    icon,

    season:
      "summer",

    category:
      "racket",

    description:
      `${name} 스윙 · 스텝 · 회전 동작 분석`,

    metrics: [

      {
        key: "swingSpeed",
        name: "스윙 속도",
        unit: "m/s"
      },

      {
        key: "rotationSpeed",
        name: "몸통 회전",
        unit: "°/s"
      }

    ],

    angles: [

      "어깨",
      "팔꿈치",
      "고관절",
      "무릎",
      "몸통"

    ],

    techniques: [

      "Preparation",
      "Swing",
      "Impact",
      "Follow Through"

    ],

    special: [
      "trajectory"
    ]

  };

}


function createCombatSport(
  id,
  name,
  english,
  icon
) {

  return {

    id,
    name,
    english,
    icon,

    season:
      "summer",

    category:
      "combat",

    description:
      `${name} 공격 · 방어 · 중심 이동 자세 분석`,

    metrics: [

      {
        key: "reaction",
        name: "반응시간",
        unit: "ms"
      },

      {
        key: "balance",
        name: "균형",
        unit: "%"
      },

      {
        key: "rotationSpeed",
        name: "회전 속도",
        unit: "°/s"
      }

    ],

    angles: [

      "어깨",
      "팔꿈치",
      "고관절",
      "무릎",
      "발목",
      "몸통"

    ],

    techniques: [

      "Ready",
      "Attack",
      "Defense",
      "Recovery"

    ],

    special: [
      "trajectory"
    ]

  };

}


/* ============================================================
   03. DATABASE API
============================================================ */

function getAllSports() {

  return {

    ...SPORTS_DATABASE.winter,
    ...SPORTS_DATABASE.summer

  };

}


function getSport(
  sportId
) {

  return (
    SPORTS_DATABASE.winter[
      sportId
    ] ||

    SPORTS_DATABASE.summer[
      sportId
    ] ||

    null
  );

}


function getSportsBySeason(
  season
) {

  return (
    SPORTS_DATABASE[
      season
    ] ||
    {}
  );

}


/* ============================================================
   04. SPORT CARD
============================================================ */

function createSportCard(
  sport
) {

  const button =
    document.createElement(
      "button"
    );


  button.type =
    "button";


  button.className =
    "sport-selector-card";


  button.dataset.selectSport =
    sport.id;


  button.dataset.season =
    sport.season;


  button.innerHTML = `

    <div class="sport-card-icon">
      ${sport.icon || "◆"}
    </div>

    <div class="sport-card-content">

      <small>
        ${sport.english}
      </small>

      <strong>
        ${sport.name}
      </strong>

      <p>
        ${sport.description}
      </p>

    </div>

    <span class="sport-card-arrow">
      →
    </span>

  `;


  return button;

}


/* ============================================================
   05. RENDER SPORT SELECTOR
============================================================ */

function renderSportSelector(
  season
) {

  const container =
    document.querySelector(
      `[data-sport-selector="${season}"]`
    );


  if (!container) {

    return;

  }


  container.innerHTML =
    "";


  const sports =
    Object.values(
      getSportsBySeason(
        season
      )
    );


  sports.forEach(
    sport => {

      container.appendChild(
        createSportCard(
          sport
        )
      );

    }
  );

}


/* ============================================================
   06. ANALYSIS SPORT UI
============================================================ */

function renderSelectedSport(
  sportId
) {

  const sport =
    getSport(
      sportId
    );


  if (!sport) {

    return;

  }


  renderSportTitle(
    sport
  );


  renderMetrics(
    sport
  );


  renderAngles(
    sport
  );


  renderTechniques(
    sport
  );


  renderSpecialPanels(
    sport
  );

}


/* ============================================================
   07. SPORT TITLE
============================================================ */

function renderSportTitle(
  sport
) {

  const title =
    document.querySelector(
      "[data-sport-analysis-title]"
    );


  const season =
    document.querySelector(
      "[data-sport-analysis-season]"
    );


  if (title) {

    title.textContent =
      sport.name;

  }


  if (season) {

    season.textContent =
      sport.season ===
      "winter"
        ? "WINTER SPORTS"
        : "SUMMER SPORTS";

  }

}


/* ============================================================
   08. METRICS
============================================================ */

function renderMetrics(
  sport
) {

  const container =
    document.querySelector(
      "[data-sport-metrics]"
    );


  if (!container) {

    return;

  }


  container.innerHTML =
    "";


  sport.metrics.forEach(
    metric => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "metric-card";


      item.innerHTML = `

        <span>
          ${metric.name}
        </span>

        <strong
          data-metric-value="${metric.key}"
        >
          --
        </strong>

        <small>
          ${metric.unit}
        </small>

      `;


      container.appendChild(
        item
      );

    }
  );

}


/* ============================================================
   09. ANGLES
============================================================ */

function renderAngles(
  sport
) {

  const container =
    document.querySelector(
      "[data-sport-angles]"
    );


  if (!container) {

    return;

  }


  container.innerHTML =
    "";


  sport.angles.forEach(
    (
      angle,
      index
    ) => {

      const key =
        `angle_${index}`;


      const item =
        document.createElement(
          "div"
        );


      item.className =
        "angle-card";


      item.innerHTML = `

        <span>
          ${angle}
        </span>

        <strong
          data-angle-value="${key}"
        >
          --
        </strong>

        <small>
          °
        </small>

      `;


      container.appendChild(
        item
      );

    }
  );

}


/* ============================================================
   10. TECHNIQUES
============================================================ */

function renderTechniques(
  sport
) {

  const containers =
    document.querySelectorAll(
      "[data-sport-techniques]"
    );


  containers.forEach(
    container => {

      container.innerHTML =
        "";


      sport.techniques.forEach(
        technique => {

          const item =
            document.createElement(
              "span"
            );


          item.className =
            "technique-chip";


          item.textContent =
            technique;


          container.appendChild(
            item
          );

        }
      );

    }
  );

}


/* ============================================================
   11. SPECIAL PANELS
============================================================ */

function renderSpecialPanels(
  sport
) {

  const panels =
    document.querySelectorAll(
      "[data-sport-special]"
    );


  panels.forEach(
    panel => {

      const type =
        panel.dataset
          .sportSpecial;


      panel.hidden =
        !sport.special.includes(
          type
        );

    }
  );

}


/* ============================================================
   12. ATHLETE STATE
============================================================ */

let athleteEditId =
  null;


let athleteSearchText =
  "";


let athleteFilter =
  "all";


/* ============================================================
   13. GET ATHLETES
============================================================ */

function getAthletes() {

  return (
    window.SeolcheonApp
      ?.state
      ?.athletes ||
    []
  );

}


/* ============================================================
   14. SAVE ATHLETES
============================================================ */

function saveAthletes() {

  window.SeolcheonApp
    ?.saveAthletes?.();


  window.SeolcheonApp
    ?.refreshDashboard?.();

}


/* ============================================================
   15. ATHLETE FORM
============================================================ */

function getAthleteForm() {

  return document.querySelector(
    "[data-athlete-form]"
  );

}


/* ============================================================
   16. FORM → OBJECT
============================================================ */

function getAthleteFormData() {

  const form =
    getAthleteForm();


  if (!form) {

    return null;

  }


  const data =
    new FormData(
      form
    );


  const sportId =
    data.get(
      "sport"
    );


  const sport =
    getSport(
      sportId
    );


  return {

    name:
      String(
        data.get("name") ||
        ""
      ).trim(),

    school:
      String(
        data.get("school") ||
        "설천고"
      ).trim(),

    grade:
      String(
        data.get("grade") ||
        ""
      ),

    gender:
      String(
        data.get("gender") ||
        ""
      ),

    birthDate:
      String(
        data.get("birthDate") ||
        ""
      ),

    season:
      String(
        data.get("season") ||
        sport?.season ||
        ""
      ),

    sport:
      sportId,

    sportName:
      sport?.name ||
      sportId,

    event:
      String(
        data.get("event") ||
        ""
      ).trim(),

    height:
      Number(
        data.get("height")
      ) ||
      null,

    weight:
      Number(
        data.get("weight")
      ) ||
      null,

    career:
      String(
        data.get("career") ||
        ""
      ).trim(),

    team:
      String(
        data.get("team") ||
        ""
      ).trim(),

    memo:
      String(
        data.get("memo") ||
        ""
      ).trim()

  };

}


/* ============================================================
   17. REGISTER / UPDATE ATHLETE
============================================================ */

function submitAthlete(
  event
) {

  event.preventDefault();


  const athlete =
    getAthleteFormData();


  if (
    !athlete ||
    !athlete.name
  ) {

    showAthleteMessage(
      "선수 이름을 입력해주세요.",
      true
    );

    return;

  }


  if (!athlete.sport) {

    showAthleteMessage(
      "종목을 선택해주세요.",
      true
    );

    return;

  }


  const athletes =
    getAthletes();


  if (athleteEditId) {

    const index =
      athletes.findIndex(
        item =>
          item.id ===
          athleteEditId
      );


    if (
      index !== -1
    ) {

      athletes[index] = {

        ...athletes[index],
        ...athlete,

        updatedAt:
          new Date()
            .toISOString()

      };

    }


    showAthleteMessage(
      "선수 정보가 수정되었습니다."
    );

  }

  else {

    const id =
      window.SeolcheonApp
        ?.utils
        ?.uid?.(
          "athlete"
        ) ||

      `athlete_${Date.now()}`;


    athletes.unshift({

      id,

      ...athlete,

      createdAt:
        new Date()
          .toISOString()

    });


    showAthleteMessage(
      "선수가 등록되었습니다."
    );

  }


  saveAthletes();


  resetAthleteForm();


  renderAthletes();

}


/* ============================================================
   18. ATHLETE MESSAGE
============================================================ */

function showAthleteMessage(
  message,
  error = false
) {

  const element =
    document.querySelector(
      "[data-athlete-message]"
    );


  if (!element) {

    return;

  }


  element.textContent =
    message;


  element.classList.toggle(
    "error",
    error
  );


  if (!error) {

    setTimeout(
      () => {

        if (
          element.textContent ===
          message
        ) {

          element.textContent =
            "";

        }

      },
      2500
    );

  }

}


/* ============================================================
   19. RESET FORM
============================================================ */

function resetAthleteForm() {

  const form =
    getAthleteForm();


  form?.reset();


  athleteEditId =
    null;


  const school =
    form?.elements?.school;


  if (school) {

    school.value =
      "설천고";

  }


  const team =
    form?.elements?.team;


  if (team) {

    team.value =
      "설천고";

  }


  const button =
    document.querySelector(
      "[data-athlete-submit]"
    );


  if (button) {

    button.textContent =
      "선수 등록";

  }

}


/* ============================================================
   20. ATHLETE FILTER
============================================================ */

function getFilteredAthletes() {

  const athletes =
    [...getAthletes()];


  return athletes.filter(
    athlete => {

      const searchTarget =
        [
          athlete.name,
          athlete.school,
          athlete.team,
          athlete.sportName,
          athlete.event
        ]
          .join(" ")
          .toLowerCase();


      const searchMatch =
        !athleteSearchText ||
        searchTarget.includes(
          athleteSearchText
        );


      let filterMatch =
        true;


      if (
        athleteFilter ===
        "winter"
      ) {

        filterMatch =
          athlete.season ===
          "winter";

      }

      else if (
        athleteFilter ===
        "summer"
      ) {

        filterMatch =
          athlete.season ===
          "summer";

      }

      else if (
        athleteFilter !==
        "all"
      ) {

        filterMatch =
          athlete.sport ===
          athleteFilter;

      }


      return (
        searchMatch &&
        filterMatch
      );

    }
  );

}


/* ============================================================
   21. ATHLETE CARD
============================================================ */

function createAthleteCard(
  athlete
) {

  const sport =
    getSport(
      athlete.sport
    );


  const article =
    document.createElement(
      "article"
    );


  article.className =
    "athlete-card";


  article.innerHTML = `

    <div class="athlete-card-top">

      <div class="athlete-avatar">
        ${
          athlete.name
            ?.charAt(0) ||
          "A"
        }
      </div>


      <div class="athlete-card-name">

        <small>
          ${sport?.english || "ATHLETE"}
        </small>

        <strong>
          ${athlete.name}
        </strong>

        <span>
          ${athlete.school || ""}
          ${athlete.grade || ""}
        </span>

      </div>

    </div>


    <div class="athlete-card-data">

      <div>

        <span>
          종목
        </span>

        <strong>
          ${
            athlete.sportName ||
            sport?.name ||
            "-"
          }
        </strong>

      </div>


      <div>

        <span>
          세부 종목
        </span>

        <strong>
          ${athlete.event || "-"}
        </strong>

      </div>


      <div>

        <span>
          신장
        </span>

        <strong>
          ${
            athlete.height
              ? athlete.height + " cm"
              : "-"
          }
        </strong>

      </div>


      <div>

        <span>
          체중
        </span>

        <strong>
          ${
            athlete.weight
              ? athlete.weight + " kg"
              : "-"
          }
        </strong>

      </div>

    </div>


    <div class="athlete-card-actions">

      <button
        type="button"
        class="primary-button"
        data-athlete-analysis="${athlete.id}"
      >
        자세분석
      </button>


      <button
        type="button"
        class="ghost-button"
        data-athlete-edit="${athlete.id}"
      >
        수정
      </button>


      <button
        type="button"
        class="ghost-button"
        data-athlete-delete="${athlete.id}"
      >
        삭제
      </button>

    </div>

  `;


  article.addEventListener(
    "click",
    event => {

      if (
        event.target.closest(
          "button"
        )
      ) {

        return;

      }


      window.SeolcheonApp
        ?.selectAthlete?.(
          athlete
        );

    }
  );


  return article;

}


/* ============================================================
   22. RENDER ATHLETES
============================================================ */

function renderAthletes() {

  const container =
    document.querySelector(
      "[data-athlete-list]"
    );


  if (!container) {

    return;

  }


  const athletes =
    getFilteredAthletes();


  container.innerHTML =
    "";


  if (
    athletes.length ===
    0
  ) {

    container.innerHTML = `

      <div class="empty-state">
        등록된 선수가 없습니다.
      </div>

    `;

    return;

  }


  athletes.forEach(
    athlete => {

      container.appendChild(
        createAthleteCard(
          athlete
        )
      );

    }
  );

}


/* ============================================================
   23. EDIT ATHLETE
============================================================ */

function editAthlete(
  athleteId
) {

  const athlete =
    getAthletes()
      .find(
        item =>
          item.id ===
          athleteId
      );


  if (!athlete) {

    return;

  }


  const form =
    getAthleteForm();


  if (!form) {

    return;

  }


  athleteEditId =
    athlete.id;


  Object.entries(
    athlete
  ).forEach(
    ([key, value]) => {

      const input =
        form.elements[
          key
        ];


      if (!input) {

        return;

      }


      input.value =
        value ?? "";

    }
  );


  const submit =
    document.querySelector(
      "[data-athlete-submit]"
    );


  if (submit) {

    submit.textContent =
      "선수 정보 수정";

  }


  form.scrollIntoView({

    behavior:
      "smooth",

    block:
      "start"

  });

}


/* ============================================================
   24. DELETE ATHLETE
============================================================ */

function deleteAthlete(
  athleteId
) {

  const athletes =
    getAthletes();


  const athlete =
    athletes.find(
      item =>
        item.id ===
        athleteId
    );


  if (!athlete) {

    return;

  }


  const confirmed =
    window.confirm(
      `${athlete.name} 선수를 삭제할까요?`
    );


  if (!confirmed) {

    return;

  }


  const index =
    athletes.findIndex(
      item =>
        item.id ===
        athleteId
    );


  if (
    index !== -1
  ) {

    athletes.splice(
      index,
      1
    );

  }


  if (
    window.SeolcheonApp
      ?.state
      ?.selectedAthlete
      ?.id ===
    athleteId
  ) {

    window.SeolcheonApp
      .state
      .selectedAthlete =
      null;

  }


  saveAthletes();


  window.SeolcheonApp
    ?.refreshSelectedAthleteUI?.();


  renderAthletes();

}


/* ============================================================
   25. SPORT SELECT CHANGE
============================================================ */

function initializeSportFormSync() {

  const form =
    getAthleteForm();


  const sportSelect =
    form?.elements?.sport;


  const seasonSelect =
    form?.elements?.season;


  const sportName =
    form?.elements?.sportName;


  sportSelect?.addEventListener(
    "change",
    () => {

      const sport =
        getSport(
          sportSelect.value
        );


      if (!sport) {

        return;

      }


      if (seasonSelect) {

        seasonSelect.value =
          sport.season;

      }


      if (sportName) {

        sportName.value =
          sport.name;

      }

    }
  );

}


/* ============================================================
   26. ATHLETE EVENTS
============================================================ */

function initializeAthleteEvents() {

  const form =
    getAthleteForm();


  form?.addEventListener(
    "submit",
    submitAthlete
  );


  document
    .querySelector(
      "[data-athlete-cancel]"
    )
    ?.addEventListener(
      "click",
      () => {

        resetAthleteForm();

        showAthleteMessage(
          ""
        );

      }
    );


  document
    .querySelector(
      "[data-athlete-search]"
    )
    ?.addEventListener(
      "input",
      event => {

        athleteSearchText =
          String(
            event.target.value ||
            ""
          )
            .trim()
            .toLowerCase();


        renderAthletes();

      }
    );


  document
    .querySelector(
      "[data-athlete-sport-filter]"
    )
    ?.addEventListener(
      "change",
      event => {

        athleteFilter =
          event.target.value;


        renderAthletes();

      }
    );


  document.addEventListener(
    "click",
    event => {


      const edit =
        event.target.closest(
          "[data-athlete-edit]"
        );


      if (edit) {

        editAthlete(
          edit.dataset
            .athleteEdit
        );

        return;

      }


      const remove =
        event.target.closest(
          "[data-athlete-delete]"
        );


      if (remove) {

        deleteAthlete(
          remove.dataset
            .athleteDelete
        );

      }

    }
  );

}


/* ============================================================
   27. LISTEN SPORT CHANGE
============================================================ */

function initializeSportEvents() {

  window.addEventListener(
    "seolcheon:sport-selected",
    event => {

      const sportId =
        event.detail
          ?.sport;


      if (!sportId) {

        return;

      }


      renderSelectedSport(
        sportId
      );

    }
  );

}


/* ============================================================
   28. PUBLIC API
============================================================ */

window.SportsDatabase = {

  database:
    SPORTS_DATABASE,


  getAllSports,


  getSport,


  getSportsBySeason,


  renderSelectedSport

};


/* ============================================================
   29. SPORTS MANAGER
============================================================ */

window.SportsManager = {


  initialized:
    false,


  init() {

    if (
      this.initialized
    ) {

      return;

    }


    this.initialized =
      true;


    renderSportSelector(
      "winter"
    );


    renderSportSelector(
      "summer"
    );


    initializeSportFormSync();


    initializeAthleteEvents();


    initializeSportEvents();


    renderAthletes();


    const selectedSport =
      window.SeolcheonApp
        ?.state
        ?.selectedSport;


    if (selectedSport) {

      renderSelectedSport(
        selectedSport
      );

    }


    console.log(
      "[SPORTS] READY"
    );

  },


  refresh() {

    renderAthletes();


    const sport =
      window.SeolcheonApp
        ?.state
        ?.selectedSport;


    if (sport) {

      renderSelectedSport(
        sport
      );

    }

  },


  renderAthletes,


  renderSportSelector,


  renderSelectedSport,


  getSport

};


/* ============================================================
   30. FALLBACK INITIALIZATION

   app.js보다 sports.js 로딩이 늦은 경우에도
   초기화되도록 처리.
============================================================ */

function bootSportsModule() {

  if (
    window.SportsManager
      ?.initialized
  ) {

    return;

  }


  window.SportsManager
    ?.init?.();

}


if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    bootSportsModule
  );

}

else {

  bootSportsModule();

}


/* ============================================================
   END SPORTS.JS
============================================================ */