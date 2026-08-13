/* =========================================================
   SEOLCHEON SPORTS PERFORMANCE LAB
   TRAINING.JS
   FILE 5 / 6

   SMART TRAINING RECOMMENDATION ENGINE
   ---------------------------------------------------------
   - Sport-specific training
   - Weakness-based recommendation
   - Corrective exercise
   - Strength
   - Core
   - Balance
   - Plyometric
   - Mobility
   - Technique drills
   - Priority ranking
   - Training UI
   - Report integration
========================================================= */

"use strict";


/* =========================================================
   01. TRAINING CONFIG
========================================================= */

const TRAINING_CONFIG = {

  maxRecommendations: 30,

  priorityLimit: 8,

  categories: {

    corrective: "교정",

    strength: "근력",

    core: "코어",

    balance: "밸런스",

    plyometric: "플라이오메트릭",

    mobility: "가동성",

    technique: "기술",

    endurance: "지구력",

    speed: "스피드",

    stability: "안정성"

  }

};



/* =========================================================
   02. EXERCISE CREATOR
========================================================= */

function createExercise(
  name,
  category,
  target,
  reason,
  priority = 3
) {

  return {

    id:
      name
        .toLowerCase()
        .replace(
          /\s+/g,
          "-"
        )
        .replace(
          /[^a-z0-9가-힣-]/g,
          ""
        ),

    name,

    category,

    target,

    reason,

    priority

  };

}



/* =========================================================
   03. COMMON TRAINING DATABASE
========================================================= */

const COMMON_TRAINING = [

  createExercise(
    "데드버그",
    "코어",
    "몸통 안정성",
    "사지 움직임 중 몸통을 안정적으로 유지하는 능력을 향상합니다.",
    2
  ),

  createExercise(
    "버드독",
    "코어",
    "몸통·골반",
    "몸통과 골반의 흔들림을 줄이는 데 도움이 됩니다.",
    2
  ),

  createExercise(
    "프론트 플랭크",
    "코어",
    "몸통",
    "기본적인 몸통 안정성을 강화합니다.",
    3
  ),

  createExercise(
    "사이드 플랭크",
    "코어",
    "측면 코어",
    "좌우 몸통 안정성과 골반 제어 능력을 강화합니다.",
    2
  ),

  createExercise(
    "팔로프 프레스",
    "코어",
    "회전 저항",
    "동작 중 불필요한 몸통 회전을 억제하는 능력을 강화합니다.",
    1
  ),

  createExercise(
    "코펜하겐 플랭크",
    "근력",
    "내전근",
    "골반 안정성과 내전근 기능을 강화합니다.",
    3
  ),

  createExercise(
    "힙 브리지",
    "근력",
    "둔근",
    "고관절 신전과 골반 안정성을 향상합니다.",
    3
  ),

  createExercise(
    "싱글레그 힙 브리지",
    "근력",
    "둔근·좌우 균형",
    "좌우 둔근의 힘 차이를 줄이는 데 도움이 됩니다.",
    2
  ),

  createExercise(
    "힙 쓰러스트",
    "근력",
    "둔근",
    "강한 고관절 신전 능력을 발달시킵니다.",
    3
  ),

  createExercise(
    "고블릿 스쿼트",
    "근력",
    "하체",
    "기본적인 스쿼트 패턴과 하체 정렬을 개선합니다.",
    3
  ),

  createExercise(
    "템포 스쿼트",
    "교정",
    "무릎·고관절",
    "천천히 동작하며 관절 정렬을 제어하는 능력을 강화합니다.",
    2
  ),

  createExercise(
    "스플릿 스쿼트",
    "근력",
    "하체",
    "한쪽 다리의 근력과 골반 안정성을 강화합니다.",
    2
  ),

  createExercise(
    "불가리안 스플릿 스쿼트",
    "근력",
    "하체·균형",
    "좌우 하체 근력 차이를 줄이는 데 유용합니다.",
    2
  ),

  createExercise(
    "리버스 런지",
    "근력",
    "하체",
    "한쪽 다리 지지 능력과 고관절 제어 능력을 강화합니다.",
    3
  ),

  createExercise(
    "워킹 런지",
    "근력",
    "하체·균형",
    "이동 중 한쪽 다리 안정성을 강화합니다.",
    3
  ),

  createExercise(
    "스텝업",
    "근력",
    "둔근·대퇴사두근",
    "한쪽 다리로 지면을 밀어내는 힘을 강화합니다.",
    2
  ),

  createExercise(
    "싱글레그 RDL",
    "균형",
    "햄스트링·둔근",
    "한쪽 다리 균형과 후면사슬 제어를 강화합니다.",
    1
  ),

  createExercise(
    "싱글레그 밸런스",
    "균형",
    "발목·골반",
    "한쪽 다리 지지 시 흔들림을 줄이는 데 도움이 됩니다.",
    2
  ),

  createExercise(
    "밴드 사이드워크",
    "근력",
    "중둔근",
    "무릎과 골반의 좌우 안정성을 강화합니다.",
    2
  ),

  createExercise(
    "몬스터 워크",
    "근력",
    "둔근",
    "하지 정렬을 유지하는 둔근 기능을 강화합니다.",
    3
  ),

  createExercise(
    "카프 레이즈",
    "근력",
    "종아리",
    "발목 추진력과 하퇴 근력을 강화합니다.",
    3
  ),

  createExercise(
    "싱글레그 카프 레이즈",
    "근력",
    "발목",
    "좌우 발목 힘의 차이를 확인하고 개선합니다.",
    2
  ),

  createExercise(
    "발목 가동성 드릴",
    "가동성",
    "발목",
    "발목 배측굴곡 가동범위를 개선합니다.",
    1
  ),

  createExercise(
    "고관절 가동성 드릴",
    "가동성",
    "고관절",
    "고관절 움직임의 제한을 줄입니다.",
    2
  ),

  createExercise(
    "90/90 힙 모빌리티",
    "가동성",
    "고관절",
    "고관절 내·외회전 가동성을 개선합니다.",
    3
  ),

  createExercise(
    "흉추 회전 드릴",
    "가동성",
    "흉추",
    "상체 움직임에 필요한 흉추 회전을 개선합니다.",
    3
  ),

  createExercise(
    "햄스트링 모빌리티",
    "가동성",
    "햄스트링",
    "후면사슬 움직임을 부드럽게 만드는 데 도움이 됩니다.",
    3
  ),

  createExercise(
    "월 앵클 드릴",
    "가동성",
    "발목",
    "스쿼트와 달리기에서 필요한 발목 움직임을 개선합니다.",
    2
  ),

  createExercise(
    "스케이터 점프",
    "플라이오메트릭",
    "측면 파워",
    "좌우 방향의 폭발적인 힘과 착지 안정성을 강화합니다.",
    3
  ),

  createExercise(
    "포고 점프",
    "플라이오메트릭",
    "발목 탄성",
    "발목의 빠른 반응과 탄성을 강화합니다.",
    3
  ),

  createExercise(
    "스쿼트 점프",
    "플라이오메트릭",
    "하체 파워",
    "하체 폭발력을 강화합니다.",
    3
  )

];



/* =========================================================
   04. BIATHLON TRAINING
========================================================= */

const BIATHLON_TRAINING = [

  createExercise(
    "원스케이트 기술 드릴",
    "기술",
    "V2 기술",
    "좌우 스키 글라이드와 폴링 타이밍을 연결합니다.",
    1
  ),

  createExercise(
    "투스케이트 기술 드릴",
    "기술",
    "V1 기술",
    "오르막 구간에서 효율적인 추진 패턴을 연습합니다.",
    1
  ),

  createExercise(
    "노폴 스케이팅",
    "기술",
    "하체 스키 기술",
    "폴 없이 하체 체중이동과 글라이드를 집중적으로 훈련합니다.",
    1
  ),

  createExercise(
    "싱글스키 글라이드",
    "균형",
    "스키 밸런스",
    "한쪽 스키 위에서 안정적으로 중심을 유지하는 능력을 강화합니다.",
    1
  ),

  createExercise(
    "더블폴링 기술 드릴",
    "기술",
    "폴링",
    "상체와 코어를 연결한 폴링 동작을 개선합니다.",
    1
  ),

  createExercise(
    "폴링 타이밍 드릴",
    "기술",
    "폴링 타이밍",
    "스키 추진과 폴 접촉 타이밍을 맞추는 훈련입니다.",
    1
  ),

  createExercise(
    "업힐 스케이팅 반복",
    "지구력",
    "오르막",
    "오르막에서 기술을 유지하면서 추진하는 능력을 강화합니다.",
    2
  ),

  createExercise(
    "경사 변화 주법 전환",
    "기술",
    "주법 전환",
    "코스 경사 변화에 따라 주법을 빠르게 전환하는 능력을 훈련합니다.",
    1
  ),

  createExercise(
    "스키 바운드",
    "플라이오메트릭",
    "스키 추진력",
    "스키와 유사한 대각선 방향의 추진력을 강화합니다.",
    2
  ),

  createExercise(
    "스키 에르고 인터벌",
    "지구력",
    "상체 지구력",
    "폴링에 필요한 상체 지구력과 파워를 강화합니다.",
    2
  ),

  createExercise(
    "랫풀다운",
    "근력",
    "광배근",
    "폴링 동작에 필요한 당기는 힘을 강화합니다.",
    3
  ),

  createExercise(
    "시티드 케이블 로우",
    "근력",
    "등",
    "견갑과 등 근육의 힘을 강화합니다.",
    3
  ),

  createExercise(
    "트라이셉스 프레스다운",
    "근력",
    "삼두근",
    "폴링 후반부 팔꿈치 신전 힘을 강화합니다.",
    3
  ),

  createExercise(
    "메디신볼 슬램",
    "파워",
    "상체·코어",
    "상체와 코어의 빠른 힘 전달 능력을 강화합니다.",
    3
  ),

  createExercise(
    "사격 자세 안정화 드릴",
    "안정성",
    "사격 자세",
    "정적인 자세에서 몸의 흔들림을 줄이는 연습입니다.",
    1
  ),

  createExercise(
    "호흡 후 자세 안정화",
    "안정성",
    "피로 후 안정성",
    "강한 운동 후 빠르게 자세를 안정시키는 능력을 훈련합니다.",
    1
  ),

  createExercise(
    "스키 후 안정화 루틴",
    "기술",
    "전환",
    "스키 동작 이후 안정된 자세로 전환하는 능력을 연습합니다.",
    2
  ),

  createExercise(
    "업힐 폴링 파워",
    "근력",
    "상체 추진",
    "오르막에서 폴을 이용한 추진 능력을 강화합니다.",
    2
  ),

  createExercise(
    "롤러스키 밸런스 드릴",
    "균형",
    "스키 균형",
    "비시즌에도 스키와 유사한 중심 이동을 훈련합니다.",
    2
  )

];



/* =========================================================
   05. CROSS COUNTRY
========================================================= */

const CROSS_COUNTRY_TRAINING = [

  ...BIATHLON_TRAINING.filter(
    item =>
      !item.name.includes(
        "사격"
      ) &&
      !item.name.includes(
        "호흡 후"
      )
  ),

  createExercise(
    "장거리 더블폴링",
    "지구력",
    "폴링 지구력",
    "장시간 폴링 동작을 유지하는 능력을 강화합니다.",
    2
  ),

  createExercise(
    "테크닉 인터벌",
    "기술",
    "기술 유지",
    "피로가 누적된 상황에서도 기술을 유지하도록 훈련합니다.",
    2
  )

];



/* =========================================================
   06. ROLLER SKI
========================================================= */

const ROLLER_SKI_TRAINING = [

  createExercise(
    "롤러스키 원스케이트",
    "기술",
    "V2",
    "원스케이트 리듬과 체중이동을 훈련합니다.",
    1
  ),

  createExercise(
    "롤러스키 투스케이트",
    "기술",
    "V1",
    "오르막에서 투스케이트 동작을 훈련합니다.",
    1
  ),

  createExercise(
    "노폴 롤러스키",
    "기술",
    "하체",
    "폴 없이 하체 중심이동을 집중적으로 훈련합니다.",
    1
  ),

  createExercise(
    "싱글레그 롤러스키 글라이드",
    "균형",
    "한발 지지",
    "한쪽 롤러스키 위에서 중심을 유지합니다.",
    1
  ),

  createExercise(
    "롤러스키 폴링 타이밍",
    "기술",
    "폴링",
    "폴 접촉과 하체 추진 타이밍을 연결합니다.",
    1
  ),

  createExercise(
    "업힐 롤러스키",
    "지구력",
    "오르막",
    "오르막 기술과 파워를 동시에 강화합니다.",
    2
  ),

  createExercise(
    "롤러스키 주법 전환",
    "기술",
    "전환",
    "경사에 따른 기술 전환 능력을 훈련합니다.",
    1
  ),

  createExercise(
    "롤러스키 슬라럼",
    "균형",
    "방향 제어",
    "롤러스키 방향 제어와 균형 능력을 향상합니다.",
    3
  ),

  createExercise(
    "롤러스키 저속 밸런스",
    "균형",
    "중심 제어",
    "낮은 속도에서 중심을 정밀하게 제어합니다.",
    2
  ),

  ...COMMON_TRAINING.filter(
    item =>
      [
        "코어",
        "균형",
        "플라이오메트릭"
      ].includes(
        item.category
      )
  )

];



/* =========================================================
   07. SHOOTING
========================================================= */

const SHOOTING_TRAINING = [

  createExercise(
    "정적 자세 유지",
    "안정성",
    "전신 안정성",
    "일정한 자세를 반복적으로 유지하는 능력을 강화합니다.",
    1
  ),

  createExercise(
    "호흡 리듬 훈련",
    "기술",
    "호흡",
    "호흡과 자세 안정의 연결을 연습합니다.",
    1
  ),

  createExercise(
    "견갑 안정성 드릴",
    "안정성",
    "어깨",
    "어깨 주변의 안정성을 강화합니다.",
    2
  ),

  createExercise(
    "밴드 외회전",
    "근력",
    "회전근개",
    "어깨 관절을 안정시키는 근육을 강화합니다.",
    2
  ),

  createExercise(
    "월 슬라이드",
    "가동성",
    "견갑·흉추",
    "견갑 움직임과 상체 정렬을 개선합니다.",
    3
  ),

  createExercise(
    "팔로프 프레스",
    "코어",
    "회전 안정성",
    "몸통 회전을 억제하는 능력을 강화합니다.",
    1
  ),

  createExercise(
    "싱글레그 밸런스",
    "균형",
    "하지 안정성",
    "하체 중심 제어 능력을 향상합니다.",
    2
  ),

  createExercise(
    "피로 후 자세 안정화",
    "안정성",
    "전환 능력",
    "운동 직후에도 자세를 빠르게 안정시키는 능력을 훈련합니다.",
    1
  ),

  createExercise(
    "자세 반복 재현 드릴",
    "기술",
    "자세 재현성",
    "매번 비슷한 자세를 만드는 능력을 훈련합니다.",
    1
  ),

  createExercise(
    "눈 감고 균형 드릴",
    "균형",
    "고유수용성",
    "시각 정보 의존도를 낮추고 균형 감각을 훈련합니다.",
    3
  )

];



/* =========================================================
   08. RUNNING
========================================================= */

const RUNNING_TRAINING = [

  createExercise(
    "A-Skip",
    "기술",
    "러닝 자세",
    "무릎 드라이브와 지면 접촉 리듬을 연습합니다.",
    1
  ),

  createExercise(
    "B-Skip",
    "기술",
    "러닝 자세",
    "발의 회수와 지면 접촉 패턴을 연습합니다.",
    2
  ),

  createExercise(
    "Wall Drill",
    "기술",
    "가속 자세",
    "가속 구간의 몸 기울기와 무릎 드라이브를 연습합니다.",
    1
  ),

  createExercise(
    "March Drill",
    "기술",
    "러닝 패턴",
    "기본적인 달리기 자세와 리듬을 교정합니다.",
    2
  ),

  createExercise(
    "Acceleration Drill",
    "스피드",
    "가속",
    "초반 가속 능력을 강화합니다.",
    1
  ),

  createExercise(
    "Flying Sprint",
    "스피드",
    "최고속도",
    "최고속도 구간의 러닝 기술을 강화합니다.",
    2
  ),

  createExercise(
    "Bounding",
    "플라이오메트릭",
    "보폭·파워",
    "수평 방향의 추진력을 강화합니다.",
    2
  ),

  createExercise(
    "Pogo Jump",
    "플라이오메트릭",
    "발목 탄성",
    "짧은 접지시간과 발목 탄성을 강화합니다.",
    2
  ),

  createExercise(
    "Single Leg Hop",
    "플라이오메트릭",
    "한발 파워",
    "한쪽 다리의 추진력과 착지 안정성을 강화합니다.",
    3
  ),

  createExercise(
    "Nordic Hamstring",
    "근력",
    "햄스트링",
    "햄스트링의 편심성 근력을 강화합니다.",
    2
  ),

  createExercise(
    "Hip Flexor Drive",
    "근력",
    "고관절 굴곡근",
    "무릎 드라이브에 필요한 힘을 강화합니다.",
    2
  ),

  createExercise(
    "Calf Isometric",
    "근력",
    "종아리",
    "발목과 종아리의 등척성 힘을 강화합니다.",
    3
  )

];



/* =========================================================
   09. WEIGHTLIFTING
========================================================= */

const WEIGHTLIFTING_TRAINING = [

  createExercise(
    "템포 백스쿼트",
    "교정",
    "하체 정렬",
    "느린 속도로 관절 정렬과 중심 이동을 확인합니다.",
    1
  ),

  createExercise(
    "프론트 스쿼트",
    "근력",
    "하체·몸통",
    "클린 캐치에 필요한 하체와 몸통 근력을 강화합니다.",
    1
  ),

  createExercise(
    "오버헤드 스쿼트",
    "기술",
    "전신 안정성",
    "스내치 동작에 필요한 전신 가동성과 안정성을 강화합니다.",
    1
  ),

  createExercise(
    "스내치 밸런스",
    "기술",
    "오버헤드 안정성",
    "스내치 캐치 자세를 빠르게 만드는 능력을 훈련합니다.",
    1
  ),

  createExercise(
    "행 스내치",
    "기술",
    "2차 풀",
    "폭발적인 고관절 신전과 캐치 타이밍을 연습합니다.",
    2
  ),

  createExercise(
    "행 클린",
    "기술",
    "2차 풀",
    "클린의 폭발적인 신전과 캐치 동작을 연습합니다.",
    2
  ),

  createExercise(
    "클린 풀",
    "근력",
    "당기기",
    "클린의 바벨 가속 능력을 강화합니다.",
    2
  ),

  createExercise(
    "스내치 풀",
    "근력",
    "당기기",
    "스내치의 당기기 동작을 강화합니다.",
    2
  ),

  createExercise(
    "하이 풀",
    "파워",
    "상체·고관절",
    "바벨의 수직 가속을 강화합니다.",
    3
  ),

  createExercise(
    "포즈 데드리프트",
    "교정",
    "바벨 궤적",
    "특정 위치에서 정지해 바벨과 신체 위치를 확인합니다.",
    1
  ),

  createExercise(
    "클린 데드리프트",
    "근력",
    "1차 풀",
    "클린의 시작 구간 힘을 강화합니다.",
    2
  ),

  createExercise(
    "스내치 데드리프트",
    "근력",
    "1차 풀",
    "스내치 시작 구간의 자세와 힘을 강화합니다.",
    2
  ),

  createExercise(
    "프론트랙 모빌리티",
    "가동성",
    "어깨·손목",
    "클린 캐치 자세의 가동성을 개선합니다.",
    2
  ),

  createExercise(
    "흉추 모빌리티",
    "가동성",
    "흉추",
    "오버헤드 자세에 필요한 흉추 움직임을 개선합니다.",
    2
  )

];



/* =========================================================
   10. JUMP SPORTS
========================================================= */

const JUMP_TRAINING = [

  createExercise(
    "Approach Run Drill",
    "기술",
    "도움닫기",
    "일정한 도움닫기 리듬을 만드는 훈련입니다.",
    1
  ),

  createExercise(
    "Bounding",
    "플라이오메트릭",
    "수평 파워",
    "도약에 필요한 수평 추진력을 강화합니다.",
    1
  ),

  createExercise(
    "Single Leg Bound",
    "플라이오메트릭",
    "한발 파워",
    "도약 다리의 폭발적인 힘을 강화합니다.",
    1
  ),

  createExercise(
    "Depth Landing",
    "플라이오메트릭",
    "착지",
    "착지 시 무릎과 골반 정렬을 훈련합니다.",
    2
  ),

  createExercise(
    "Box Jump",
    "플라이오메트릭",
    "수직 파워",
    "폭발적인 하체 신전 능력을 강화합니다.",
    2
  ),

  createExercise(
    "Step-Up Jump",
    "플라이오메트릭",
    "한발 추진",
    "한쪽 다리의 빠른 추진 능력을 강화합니다.",
    2
  )

];



/* =========================================================
   11. THROW SPORTS
========================================================= */

const THROW_TRAINING = [

  createExercise(
    "메디신볼 로테이션 스로우",
    "파워",
    "회전 파워",
    "하체에서 상체로 이어지는 회전 힘 전달을 강화합니다.",
    1
  ),

  createExercise(
    "메디신볼 오버헤드 스로우",
    "파워",
    "전신 파워",
    "전신 신전과 상체 파워를 강화합니다.",
    2
  ),

  createExercise(
    "케이블 로테이션",
    "코어",
    "회전",
    "몸통 회전 힘과 제어 능력을 강화합니다.",
    2
  ),

  createExercise(
    "랜드마인 로테이션",
    "근력",
    "몸통·어깨",
    "전신 회전 패턴을 강화합니다.",
    2
  ),

  createExercise(
    "스플릿 스탠스 프레스",
    "근력",
    "전신 연결",
    "하지와 상지의 힘 전달을 강화합니다.",
    3
  )

];



/* =========================================================
   12. TEAM SPORTS
========================================================= */

const TEAM_SPORT_TRAINING = [

  createExercise(
    "5-10-5 셔틀",
    "스피드",
    "방향전환",
    "빠른 감속과 방향전환 능력을 강화합니다.",
    1
  ),

  createExercise(
    "L-Drill",
    "스피드",
    "민첩성",
    "다방향 움직임과 방향전환 능력을 훈련합니다.",
    2
  ),

  createExercise(
    "Deceleration Drill",
    "기술",
    "감속",
    "빠른 움직임 이후 안전하게 감속하는 능력을 강화합니다.",
    1
  ),

  createExercise(
    "Lateral Bound",
    "플라이오메트릭",
    "측면 파워",
    "측면 추진과 착지 안정성을 강화합니다.",
    2
  ),

  createExercise(
    "Single Leg Landing",
    "교정",
    "착지 안정성",
    "한발 착지 시 하지 정렬을 훈련합니다.",
    1
  ),

  createExercise(
    "Reactive Shuffle",
    "스피드",
    "반응",
    "상황에 반응해 빠르게 방향을 바꾸는 능력을 훈련합니다.",
    2
  )

];



/* =========================================================
   13. SPORT DATABASE MAPPING
========================================================= */

const SPORT_TRAINING_DATABASE = {

  biathlon:
    BIATHLON_TRAINING,

  crossCountry:
    CROSS_COUNTRY_TRAINING,

  rollerSki:
    ROLLER_SKI_TRAINING,

  shooting:
    SHOOTING_TRAINING,

  sprint:
    RUNNING_TRAINING,

  middleDistance:
    RUNNING_TRAINING,

  longDistance:
    RUNNING_TRAINING,

  hurdles:
    RUNNING_TRAINING,

  raceWalking:
    RUNNING_TRAINING,

  weightlifting:
    WEIGHTLIFTING_TRAINING,

  longJump:
    JUMP_TRAINING,

  tripleJump:
    JUMP_TRAINING,

  highJump:
    JUMP_TRAINING,

  poleVault:
    JUMP_TRAINING,

  shotPut:
    THROW_TRAINING,

  discus:
    THROW_TRAINING,

  javelin:
    THROW_TRAINING,

  hammerThrow:
    THROW_TRAINING,

  football:
    TEAM_SPORT_TRAINING,

  basketball:
    TEAM_SPORT_TRAINING,

  volleyball:
    TEAM_SPORT_TRAINING,

  handball:
    TEAM_SPORT_TRAINING,

  baseball:
    TEAM_SPORT_TRAINING,

  tennis:
    TEAM_SPORT_TRAINING,

  badminton:
    TEAM_SPORT_TRAINING,

  tableTennis:
    TEAM_SPORT_TRAINING,

  taekwondo:
    TEAM_SPORT_TRAINING,

  judo:
    TEAM_SPORT_TRAINING,

  wrestling:
    TEAM_SPORT_TRAINING,

  boxing:
    TEAM_SPORT_TRAINING,

  fencing:
    TEAM_SPORT_TRAINING,

  gymnastics:
    COMMON_TRAINING,

  swimming:
    COMMON_TRAINING,

  cycling:
    COMMON_TRAINING,

  rowing:
    COMMON_TRAINING,

  alpineSki:
    TEAM_SPORT_TRAINING,

  snowboard:
    TEAM_SPORT_TRAINING,

  speedSkating:
    TEAM_SPORT_TRAINING,

  shortTrack:
    TEAM_SPORT_TRAINING,

  figureSkating:
    COMMON_TRAINING,

  skiJumping:
    JUMP_TRAINING,

  skeleton:
    COMMON_TRAINING,

  bobsleigh:
    COMMON_TRAINING,

  luge:
    COMMON_TRAINING,

  curling:
    COMMON_TRAINING

};



/* =========================================================
   14. WEAKNESS TRAINING
========================================================= */

function getWeaknessExercises(
  analysis
) {

  const results = [];

  const scores =
    analysis?.scores ||
    {};


  const angles =
    analysis?.angles ||
    {};


  const metrics =
    analysis?.metrics ||
    {};


  /* -----------------------------------------------------
     SYMMETRY
  ----------------------------------------------------- */

  if (
    Number(
      scores.symmetry
    ) <
    88
  ) {

    results.push(

      createExercise(
        "싱글레그 RDL",
        "교정",
        "좌우 대칭",
        "좌우 움직임 차이를 줄이기 위한 한발 지지 훈련입니다.",
        0
      ),

      createExercise(
        "불가리안 스플릿 스쿼트",
        "근력",
        "좌우 하체 근력",
        "각 다리를 독립적으로 강화해 좌우 힘 차이를 줄입니다.",
        0
      ),

      createExercise(
        "싱글레그 밸런스",
        "균형",
        "좌우 균형",
        "한쪽 다리 지지 시 중심 제어 능력을 강화합니다.",
        0
      ),

      createExercise(
        "스텝다운",
        "교정",
        "하지 정렬",
        "한쪽 다리로 내려가는 과정에서 무릎과 골반 정렬을 연습합니다.",
        1
      )

    );

  }


  /* -----------------------------------------------------
     STABILITY
  ----------------------------------------------------- */

  if (
    Number(
      scores.stability
    ) <
    88
  ) {

    results.push(

      createExercise(
        "팔로프 프레스",
        "코어",
        "몸통 안정성",
        "불필요한 몸통 회전을 억제하는 능력을 강화합니다.",
        0
      ),

      createExercise(
        "데드버그",
        "코어",
        "몸통 안정성",
        "사지 움직임 중 몸통을 안정적으로 유지합니다.",
        0
      ),

      createExercise(
        "버드독",
        "코어",
        "골반 안정성",
        "몸통과 골반의 흔들림을 줄이는 데 도움이 됩니다.",
        1
      ),

      createExercise(
        "사이드 플랭크",
        "코어",
        "측면 안정성",
        "측면 몸통과 골반 안정성을 강화합니다.",
        1
      )

    );

  }


  /* -----------------------------------------------------
     POSTURE
  ----------------------------------------------------- */

  if (
    Number(
      scores.posture
    ) <
    88
  ) {

    results.push(

      createExercise(
        "템포 스쿼트",
        "교정",
        "관절 정렬",
        "느린 속도로 무릎과 골반 위치를 확인합니다.",
        0
      ),

      createExercise(
        "월 스쿼트 자세 드릴",
        "교정",
        "스쿼트 패턴",
        "기본적인 하체 정렬을 반복적으로 학습합니다.",
        1
      ),

      createExercise(
        "고관절 가동성 드릴",
        "가동성",
        "고관절",
        "고관절 움직임을 개선해 보상 동작을 줄입니다.",
        1
      ),

      createExercise(
        "발목 가동성 드릴",
        "가동성",
        "발목",
        "하지 자세에 필요한 발목 움직임을 개선합니다.",
        1
      )

    );

  }


  /* -----------------------------------------------------
     TECHNIQUE
  ----------------------------------------------------- */

  if (
    Number(
      scores.technique
    ) <
    88
  ) {

    results.push(

      createExercise(
        "저속 기술 반복",
        "기술",
        "동작 패턴",
        "속도를 낮춰 정확한 동작 순서를 반복합니다.",
        0
      ),

      createExercise(
        "구간별 동작 드릴",
        "기술",
        "기술 연결",
        "전체 동작을 여러 구간으로 나눠 정확성을 높입니다.",
        1
      ),

      createExercise(
        "영상 피드백 반복",
        "기술",
        "동작 수정",
        "분석 영상을 확인하며 자세를 반복적으로 수정합니다.",
        1
      )

    );

  }


  /* -----------------------------------------------------
     KNEE DIFFERENCE
  ----------------------------------------------------- */

  const kneeDifference =
    Math.abs(
      Number(
        angles.leftKnee ||
        0
      ) -
      Number(
        angles.rightKnee ||
        0
      )
    );


  if (
    kneeDifference >
    10
  ) {

    results.push(

      createExercise(
        "싱글레그 스쿼트 패턴",
        "교정",
        "무릎",
        "좌우 무릎 굴곡 패턴 차이를 확인하고 교정합니다.",
        0
      ),

      createExercise(
        "스텝다운 컨트롤",
        "교정",
        "무릎 정렬",
        "한발 지지 상태에서 무릎 위치를 제어합니다.",
        0
      )

    );

  }


  /* -----------------------------------------------------
     HIP DIFFERENCE
  ----------------------------------------------------- */

  const hipDifference =
    Math.abs(
      Number(
        angles.leftHip ||
        0
      ) -
      Number(
        angles.rightHip ||
        0
      )
    );


  if (
    hipDifference >
    10
  ) {

    results.push(

      createExercise(
        "90/90 힙 모빌리티",
        "가동성",
        "고관절",
        "좌우 고관절 움직임 차이를 줄이는 데 도움이 됩니다.",
        0
      ),

      createExercise(
        "싱글레그 힙 브리지",
        "근력",
        "둔근",
        "좌우 둔근 기능을 독립적으로 강화합니다.",
        1
      )

    );

  }


  /* -----------------------------------------------------
     BODY STABILITY
  ----------------------------------------------------- */

  if (
    Number(
      metrics.bodyStability
    ) <
    85
  ) {

    results.push(

      createExercise(
        "하프니링 팔로프 프레스",
        "코어",
        "몸통",
        "좁은 지지면에서 몸통 회전을 제어합니다.",
        1
      ),

      createExercise(
        "베어 플랭크",
        "코어",
        "몸통",
        "사지 움직임 전 몸통 안정성을 강화합니다.",
        2
      )

    );

  }


  return results;

}



/* =========================================================
   15. REMOVE DUPLICATES
========================================================= */

function removeDuplicateExercises(
  exercises
) {

  const map =
    new Map();


  exercises.forEach(
    exercise => {

      const key =
        exercise.name
          .trim()
          .toLowerCase();


      if (
        !map.has(
          key
        )
      ) {

        map.set(
          key,
          exercise
        );

      }

      else {

        const existing =
          map.get(
            key
          );


        if (
          exercise.priority <
          existing.priority
        ) {

          map.set(
            key,
            exercise
          );

        }

      }

    }
  );


  return [
    ...map.values()
  ];

}



/* =========================================================
   16. BUILD RECOMMENDATIONS
========================================================= */

function buildTrainingRecommendations(
  analysis =
    window.SeolcheonAnalysisState
) {

  if (!analysis) {

    return [];

  }


  const sportId =
    analysis
      .selectedSport
      ?.id ||

    window.SeolcheonState
      ?.selectedSportId ||

    null;


  const weakness =
    getWeaknessExercises(
      analysis
    );


  const sportExercises =
    SPORT_TRAINING_DATABASE[
      sportId
    ] ||
    [];


  const combined = [

    ...weakness,

    ...sportExercises,

    ...COMMON_TRAINING

  ];


  const unique =
    removeDuplicateExercises(
      combined
    );


  unique.sort(
    (a, b) =>
      a.priority -
      b.priority
  );


  const recommendations =
    unique.slice(
      0,
      TRAINING_CONFIG
        .maxRecommendations
    );


  recommendations.forEach(
    (exercise, index) => {

      exercise.rank =
        index + 1;


      exercise.priorityLabel =

        index <
        TRAINING_CONFIG
          .priorityLimit

          ? "우선 추천"

          : "보조 추천";

    }
  );


  return recommendations;

}



/* =========================================================
   17. UPDATE ANALYSIS STATE
========================================================= */

function updateAnalysisTraining() {

  const analysis =
    window.SeolcheonAnalysisState;


  if (!analysis) {

    return [];

  }


  const recommendations =
    buildTrainingRecommendations(
      analysis
    );


  analysis.training =
    recommendations;


  return recommendations;

}



/* =========================================================
   18. TRAINING PANEL CREATOR
========================================================= */

function ensureTrainingPanel() {

  let panel =
    document.querySelector(
      "[data-training-recommendation-panel]"
    );


  if (panel) {

    return panel;

  }


  const analysisPage =
    document.querySelector(
      '[data-page="analysis"]'
    );


  if (!analysisPage) {

    return null;

  }


  const bottomActions =
    analysisPage.querySelector(
      ".analysis-bottom-actions"
    );


  panel =
    document.createElement(
      "article"
    );


  panel.className =
    "panel training-recommendation-panel";


  panel.setAttribute(
    "data-training-recommendation-panel",
    ""
  );


  panel.innerHTML = `

    <div class="panel-header">

      <div>

        <small>
          SMART TRAINING RECOMMENDATION
        </small>

        <h3>
          분석 기반 추천 훈련
        </h3>

      </div>

      <div class="training-count">

        <strong
          data-training-count
        >
          0
        </strong>

        <span>
          EXERCISES
        </span>

      </div>

    </div>


    <div class="training-summary">

      <div>

        <span>
          우선 개선
        </span>

        <strong
          data-training-focus
        >
          분석 대기
        </strong>

      </div>

      <div>

        <span>
          선택 종목
        </span>

        <strong
          data-training-sport
        >
          -
        </strong>

      </div>

      <div>

        <span>
          종합 점수
        </span>

        <strong
          data-training-score
        >
          --
        </strong>

      </div>

    </div>


    <div class="training-filter">

      <button
        type="button"
        class="active"
        data-training-filter="all"
      >
        전체
      </button>

      <button
        type="button"
        data-training-filter="priority"
      >
        우선 추천
      </button>

      <button
        type="button"
        data-training-filter="기술"
      >
        기술
      </button>

      <button
        type="button"
        data-training-filter="근력"
      >
        근력
      </button>

      <button
        type="button"
        data-training-filter="코어"
      >
        코어
      </button>

      <button
        type="button"
        data-training-filter="균형"
      >
        밸런스
      </button>

      <button
        type="button"
        data-training-filter="플라이오메트릭"
      >
        플라이오
      </button>

      <button
        type="button"
        data-training-filter="가동성"
      >
        가동성
      </button>

    </div>


    <div
      class="training-recommendation-grid"
      data-training-recommendation-list
    >

      <div class="empty-state">

        자세분석을 시작하면
        추천 훈련이 표시됩니다.

      </div>

    </div>

  `;


  if (bottomActions) {

    analysisPage.insertBefore(
      panel,
      bottomActions
    );

  }

  else {

    analysisPage.appendChild(
      panel
    );

  }


  return panel;

}



/* =========================================================
   19. FIND WEAKEST AREA
========================================================= */

function getWeakestArea(
  analysis
) {

  const scores =
    analysis?.scores;


  if (!scores) {

    return "분석 대기";

  }


  const labels = {

    posture:
      "자세 안정성",

    symmetry:
      "좌우 대칭",

    technique:
      "기술 수행",

    stability:
      "동작 안정성",

    efficiency:
      "효율성",

    elite:
      "엘리트 근접도"

  };


  const entries =
    Object.entries(
      scores
    )
      .filter(
        ([, value]) =>
          Number.isFinite(
            Number(value)
          )
      );


  if (!entries.length) {

    return "분석 대기";

  }


  entries.sort(
    (a, b) =>
      Number(a[1]) -
      Number(b[1])
  );


  return (
    labels[
      entries[0][0]
    ] ||
    entries[0][0]
  );

}



/* =========================================================
   20. TRAINING CARD
========================================================= */

function createTrainingCard(
  exercise
) {

  const priorityClass =
    exercise.priorityLabel ===
    "우선 추천"
      ? "priority"
      : "";


  return `

    <article
      class="training-card ${priorityClass}"
      data-training-category="${exercise.category}"
      data-training-priority="${exercise.priorityLabel}"
    >

      <div class="training-card-top">

        <span class="training-rank">
          ${String(
            exercise.rank
          ).padStart(
            2,
            "0"
          )}
        </span>

        <span class="training-category">
          ${exercise.category}
        </span>

        <span class="training-priority">
          ${exercise.priorityLabel}
        </span>

      </div>


      <h4>
        ${exercise.name}
      </h4>


      <div class="training-target">

        <span>
          TARGET
        </span>

        <strong>
          ${exercise.target}
        </strong>

      </div>


      <p>
        ${exercise.reason}
      </p>

    </article>

  `;

}



/* =========================================================
   21. RENDER TRAINING
========================================================= */

function renderTrainingRecommendations(
  filter =
    "all"
) {

  ensureTrainingPanel();


  const analysis =
    window.SeolcheonAnalysisState;


  if (!analysis) {

    return;

  }


  const recommendations =
    updateAnalysisTraining();


  const list =
    document.querySelector(
      "[data-training-recommendation-list]"
    );


  if (!list) {

    return;

  }


  let filtered =
    recommendations;


  if (
    filter ===
    "priority"
  ) {

    filtered =
      recommendations.filter(
        item =>
          item.priorityLabel ===
          "우선 추천"
      );

  }


  else if (
    filter !==
    "all"
  ) {

    filtered =
      recommendations.filter(
        item =>
          item.category ===
          filter
      );

  }


  if (
    !filtered.length
  ) {

    list.innerHTML = `

      <div class="empty-state">

        해당 분류의 추천 훈련이 없습니다.

      </div>

    `;

  }

  else {

    list.innerHTML =
      filtered
        .map(
          createTrainingCard
        )
        .join("");

  }


  updateTrainingSummary(
    recommendations
  );

}



/* =========================================================
   22. SUMMARY
========================================================= */

function updateTrainingSummary(
  recommendations
) {

  const analysis =
    window.SeolcheonAnalysisState;


  const count =
    document.querySelector(
      "[data-training-count]"
    );


  const focus =
    document.querySelector(
      "[data-training-focus]"
    );


  const sport =
    document.querySelector(
      "[data-training-sport]"
    );


  const score =
    document.querySelector(
      "[data-training-score]"
    );


  if (count) {

    count.textContent =
      recommendations.length;

  }


  if (focus) {

    focus.textContent =
      getWeakestArea(
        analysis
      );

  }


  if (sport) {

    sport.textContent =
      analysis
        ?.selectedSport
        ?.name ||

      window.SeolcheonState
        ?.selectedSportName ||

      "-";

  }


  if (score) {

    score.textContent =
      Number.isFinite(
        Number(
          analysis
            ?.overallScore
        )
      )
        ? analysis.overallScore
        : "--";

  }

}



/* =========================================================
   23. FILTER BUTTON
========================================================= */

document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-training-filter]"
      );


    if (!button) {

      return;

    }


    document
      .querySelectorAll(
        "[data-training-filter]"
      )
      .forEach(
        item => {

          item.classList.remove(
            "active"
          );

        }
      );


    button.classList.add(
      "active"
    );


    renderTrainingRecommendations(
      button.dataset
        .trainingFilter
    );

  }
);



/* =========================================================
   24. ANALYSIS EVENT
========================================================= */

window.addEventListener(
  "seolcheon:sport-selected",
  () => {

    setTimeout(
      () => {

        renderTrainingRecommendations();

      },
      100
    );

  }
);



/* =========================================================
   25. AUTOMATIC REFRESH

   분석값이 계속 변하므로 너무 빠르게 DOM을
   다시 그리지 않고 일정 간격으로 갱신한다.
========================================================= */

let trainingRefreshTimer =
  null;


function startTrainingRefresh() {

  if (
    trainingRefreshTimer
  ) {

    return;

  }


  trainingRefreshTimer =
    setInterval(
      () => {

        const analysisPage =
          document.querySelector(
            '[data-page="analysis"]'
          );


        if (
          !analysisPage ||
          analysisPage.hidden
        ) {

          return;

        }


        const analysis =
          window.SeolcheonAnalysisState;


        if (
          !analysis ||
          !analysis.landmarks
        ) {

          return;

        }


        const activeFilter =
          document.querySelector(
            "[data-training-filter].active"
          )
            ?.dataset
            ?.trainingFilter ||
          "all";


        renderTrainingRecommendations(
          activeFilter
        );

      },
      1500
    );

}



/* =========================================================
   26. REPORT INTEGRATION
========================================================= */

function getTrainingForReport() {

  const analysis =
    window.SeolcheonAnalysisState;


  if (!analysis) {

    return [];

  }


  return updateAnalysisTraining();

}



/* =========================================================
   27. PUBLIC API
========================================================= */

window.SeolcheonTraining = {

  config:
    TRAINING_CONFIG,

  database:
    SPORT_TRAINING_DATABASE,

  common:
    COMMON_TRAINING,

  build:
    buildTrainingRecommendations,

  update:
    updateAnalysisTraining,

  render:
    renderTrainingRecommendations,

  getForReport:
    getTrainingForReport,

  getWeaknessExercises,

  getWeakestArea

};



/* =========================================================
   28. INITIALIZE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    ensureTrainingPanel();

    startTrainingRefresh();

  }
);



if (
  document.readyState !==
  "loading"
) {

  ensureTrainingPanel();

  startTrainingRefresh();

}


console.log(
  "SEOLCHEON SMART TRAINING ENGINE READY"
);


/* =========================================================
   END OF TRAINING.JS
========================================================= */