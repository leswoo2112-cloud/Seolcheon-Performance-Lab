/* =========================================================
   SEOLCHEON SPORTS PERFORMANCE LAB
   APP.JS
   FILE 3 / 6

   CORE APPLICATION
   ---------------------------------------------------------
   - Login / Logout
   - Navigation
   - Athlete CRUD
   - Athlete Selection
   - Dashboard
   - Analysis Records
   - Reports Storage
   - LocalStorage
   - Backup / Restore
   - Shared Application State
========================================================= */

"use strict";


/* =========================================================
   01. CONFIG
========================================================= */

const APP_CONFIG = {

  name:
    "설천고 스포츠 퍼포먼스 분석 시스템",

  version:
    "3.0.0",

  login: {

    id:
      "seolcheon",

    password:
      "sports"

  },

  storage: {

    athletes:
      "seolcheon_athletes_v3",

    analyses:
      "seolcheon_analyses_v3",

    reports:
      "seolcheon_reports_v3",

    selectedAthlete:
      "seolcheon_selected_athlete_v3",

    settings:
      "seolcheon_settings_v3"

  }

};



/* =========================================================
   02. SPORT DATABASE
========================================================= */

const SPORTS_DATABASE = {

  winter: [

    {
      id: "biathlon",
      name: "바이애슬론",
      icon: "🎯",
      description:
        "스키 주법 · 경사 · 구간 · 자세 · 움직임 분석"
    },

    {
      id: "crossCountry",
      name: "크로스컨트리",
      icon: "⛷",
      description:
        "스케이팅 · 클래식 · 폴링 · 글라이드 분석"
    },

    {
      id: "rollerSki",
      name: "롤러스키",
      icon: "🛼",
      description:
        "롤러스키 주법 · 밸런스 · 폴링 · 추진 분석"
    },

    {
      id: "alpineSki",
      name: "알파인스키",
      icon: "⛷",
      description:
        "턴 · 중심이동 · 엣지 · 자세 분석"
    },

    {
      id: "snowboard",
      name: "스노보드",
      icon: "🏂",
      description:
        "밸런스 · 회전 · 중심 이동 분석"
    },

    {
      id: "speedSkating",
      name: "스피드스케이팅",
      icon: "⛸",
      description:
        "푸시 · 활주 · 무릎각 · 자세 분석"
    },

    {
      id: "shortTrack",
      name: "쇼트트랙",
      icon: "⛸",
      description:
        "코너링 · 중심 · 푸시 분석"
    },

    {
      id: "figureSkating",
      name: "피겨스케이팅",
      icon: "⛸",
      description:
        "점프 · 회전 · 착지 · 균형 분석"
    },

    {
      id: "skiJumping",
      name: "스키점프",
      icon: "🎿",
      description:
        "도약 · 비행 자세 · 착지 분석"
    },

    {
      id: "skeleton",
      name: "스켈레톤",
      icon: "🛷",
      description:
        "스타트 · 추진 · 탑승 자세 분석"
    },

    {
      id: "bobsleigh",
      name: "봅슬레이",
      icon: "🛷",
      description:
        "스타트 · 가속 · 추진 자세 분석"
    },

    {
      id: "luge",
      name: "루지",
      icon: "🛷",
      description:
        "스타트 · 탑승 자세 · 균형 분석"
    },

    {
      id: "curling",
      name: "컬링",
      icon: "🥌",
      description:
        "딜리버리 · 슬라이드 · 균형 분석"
    }

  ],


  summer: [

    {
      id: "sprint",
      name: "육상 단거리",
      icon: "🏃",
      description:
        "스타트 · 가속 · 보폭 · 케이던스 분석"
    },

    {
      id: "middleDistance",
      name: "육상 중거리",
      icon: "🏃",
      description:
        "러닝 효율 · 보폭 · 접지시간 분석"
    },

    {
      id: "longDistance",
      name: "육상 장거리",
      icon: "🏃",
      description:
        "러닝 경제성 · 케이던스 · 자세 분석"
    },

    {
      id: "hurdles",
      name: "허들",
      icon: "🏃",
      description:
        "허들 통과 · 리드레그 · 착지 분석"
    },

    {
      id: "raceWalking",
      name: "경보",
      icon: "🚶",
      description:
        "보행 주기 · 골반 · 접지 분석"
    },

    {
      id: "longJump",
      name: "멀리뛰기",
      icon: "🏃",
      description:
        "도움닫기 · 도약 · 착지 분석"
    },

    {
      id: "tripleJump",
      name: "세단뛰기",
      icon: "🏃",
      description:
        "홉 · 스텝 · 점프 분석"
    },

    {
      id: "highJump",
      name: "높이뛰기",
      icon: "🏃",
      description:
        "도움닫기 · 도약 · 공중 자세 분석"
    },

    {
      id: "poleVault",
      name: "장대높이뛰기",
      icon: "🏃",
      description:
        "도움닫기 · 장대 삽입 · 도약 분석"
    },

    {
      id: "shotPut",
      name: "포환던지기",
      icon: "🥇",
      description:
        "회전 · 파워 전달 · 릴리스 분석"
    },

    {
      id: "discus",
      name: "원반던지기",
      icon: "🥏",
      description:
        "회전 · 중심 이동 · 릴리스 분석"
    },

    {
      id: "javelin",
      name: "창던지기",
      icon: "🥇",
      description:
        "도움닫기 · 블록 · 릴리스 분석"
    },

    {
      id: "hammerThrow",
      name: "해머던지기",
      icon: "🥇",
      description:
        "회전 · 중심 · 릴리스 분석"
    },

    {
      id: "weightlifting",
      name: "역도",
      icon: "🏋️",
      description:
        "바벨 궤적 · 풀 · 캐치 · 속도 분석"
    },

    {
      id: "swimming",
      name: "수영",
      icon: "🏊",
      description:
        "스트로크 · 킥 · 몸통 회전 분석"
    },

    {
      id: "cycling",
      name: "사이클",
      icon: "🚴",
      description:
        "페달링 · 무릎각 · 상체 안정성 분석"
    },

    {
      id: "rowing",
      name: "조정",
      icon: "🚣",
      description:
        "드라이브 · 리커버리 · 스트로크 분석"
    },

    {
      id: "football",
      name: "축구",
      icon: "⚽",
      description:
        "달리기 · 킥 · 방향전환 분석"
    },

    {
      id: "basketball",
      name: "농구",
      icon: "🏀",
      description:
        "점프 · 슈팅 · 착지 · 방향전환 분석"
    },

    {
      id: "volleyball",
      name: "배구",
      icon: "🏐",
      description:
        "점프 · 스파이크 · 블로킹 분석"
    },

    {
      id: "handball",
      name: "핸드볼",
      icon: "🤾",
      description:
        "점프 · 스로잉 · 착지 분석"
    },

    {
      id: "baseball",
      name: "야구",
      icon: "⚾",
      description:
        "투구 · 타격 · 회전 분석"
    },

    {
      id: "tennis",
      name: "테니스",
      icon: "🎾",
      description:
        "서브 · 포핸드 · 백핸드 분석"
    },

    {
      id: "badminton",
      name: "배드민턴",
      icon: "🏸",
      description:
        "스매시 · 런지 · 풋워크 분석"
    },

    {
      id: "tableTennis",
      name: "탁구",
      icon: "🏓",
      description:
        "스윙 · 회전 · 풋워크 분석"
    },

    {
      id: "taekwondo",
      name: "태권도",
      icon: "🥋",
      description:
        "킥 · 회전 · 균형 분석"
    },

    {
      id: "judo",
      name: "유도",
      icon: "🥋",
      description:
        "중심 이동 · 회전 · 균형 분석"
    },

    {
      id: "wrestling",
      name: "레슬링",
      icon: "🤼",
      description:
        "자세 · 중심 · 움직임 분석"
    },

    {
      id: "boxing",
      name: "복싱",
      icon: "🥊",
      description:
        "펀치 · 회전 · 풋워크 분석"
    },

    {
      id: "fencing",
      name: "펜싱",
      icon: "🤺",
      description:
        "런지 · 중심 이동 · 반응 분석"
    },

    {
      id: "gymnastics",
      name: "체조",
      icon: "🤸",
      description:
        "회전 · 점프 · 착지 · 균형 분석"
    },

    {
      id: "shooting",
      name: "사격",
      icon: "🎯",
      description:
        "자세 안정성 · 흔들림 · 균형 · 호흡 타이밍 분석"
    }

  ]

};



/* =========================================================
   03. APP STATE
========================================================= */

const AppState = {

  athletes:
    [],

  analyses:
    [],

  reports:
    [],

  selectedAthleteId:
    null,

  selectedSportId:
    null,

  selectedSeason:
    null,

  currentPage:
    "dashboard",

  editingAthleteId:
    null

};


window.SeolcheonState =
  AppState;

window.SeolcheonSports =
  SPORTS_DATABASE;



/* =========================================================
   04. STORAGE
========================================================= */

function readStorage(
  key,
  fallback = []
) {

  try {

    const raw =
      localStorage.getItem(
        key
      );


    if (!raw) {

      return fallback;

    }


    return JSON.parse(
      raw
    );

  }

  catch (error) {

    console.error(
      "Storage read error:",
      key,
      error
    );


    return fallback;

  }

}



function writeStorage(
  key,
  value
) {

  try {

    localStorage.setItem(
      key,
      JSON.stringify(
        value
      )
    );


    return true;

  }

  catch (error) {

    console.error(
      "Storage write error:",
      key,
      error
    );


    return false;

  }

}



function loadApplicationData() {

  AppState.athletes =
    readStorage(
      APP_CONFIG.storage.athletes,
      []
    );


  AppState.analyses =
    readStorage(
      APP_CONFIG.storage.analyses,
      []
    );


  AppState.reports =
    readStorage(
      APP_CONFIG.storage.reports,
      []
    );


  AppState.selectedAthleteId =
    localStorage.getItem(
      APP_CONFIG.storage.selectedAthlete
    ) ||
    null;

}



function saveAthletes() {

  writeStorage(
    APP_CONFIG.storage.athletes,
    AppState.athletes
  );

}



function saveAnalyses() {

  writeStorage(
    APP_CONFIG.storage.analyses,
    AppState.analyses
  );

}



function saveReports() {

  writeStorage(
    APP_CONFIG.storage.reports,
    AppState.reports
  );

}



/* =========================================================
   05. HELPERS
========================================================= */

function createId(
  prefix = "item"
) {

  return (
    prefix +
    "_" +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .slice(2, 9)
  );

}



function escapeHTML(
  value
) {

  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}



function clamp(
  value,
  min,
  max
) {

  return Math.min(
    Math.max(
      value,
      min
    ),
    max
  );

}



function average(
  values
) {

  const valid =
    values.filter(
      value =>
        Number.isFinite(
          Number(value)
        )
    );


  if (
    valid.length === 0
  ) {

    return null;

  }


  return (
    valid.reduce(
      (sum, value) =>
        sum + Number(value),
      0
    ) /
    valid.length
  );

}



function formatDate(
  value
) {

  if (!value) {

    return "-";

  }


  const date =
    new Date(
      value
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return value;

  }


  return date.toLocaleString(
    "ko-KR",
    {

      year:
        "numeric",

      month:
        "2-digit",

      day:
        "2-digit",

      hour:
        "2-digit",

      minute:
        "2-digit"

    }
  );

}



function getSportById(
  sportId
) {

  const allSports = [

    ...SPORTS_DATABASE.winter,

    ...SPORTS_DATABASE.summer

  ];


  return (
    allSports.find(
      sport =>
        sport.id === sportId
    ) ||
    null
  );

}



function getSelectedAthlete() {

  return (
    AppState.athletes.find(
      athlete =>
        athlete.id ===
        AppState.selectedAthleteId
    ) ||
    null
  );

}



function getAthleteById(
  athleteId
) {

  return (
    AppState.athletes.find(
      athlete =>
        athlete.id ===
        athleteId
    ) ||
    null
  );

}



/* =========================================================
   06. LOGIN
========================================================= */

const loginScreen =
  document.getElementById(
    "loginScreen"
  );


const appShell =
  document.getElementById(
    "app"
  );


const loginForm =
  document.getElementById(
    "loginForm"
  );


function openApplication() {

  if (loginScreen) {

    loginScreen.hidden =
      true;

  }


  if (appShell) {

    appShell.hidden =
      false;

  }


  sessionStorage.setItem(
    "seolcheon_login",
    "true"
  );


  navigateTo(
    "dashboard"
  );

}



function logoutApplication() {

  sessionStorage.removeItem(
    "seolcheon_login"
  );


  if (appShell) {

    appShell.hidden =
      true;

  }


  if (loginScreen) {

    loginScreen.hidden =
      false;

  }

}



loginForm?.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const id =
      document
        .getElementById(
          "loginId"
        )
        ?.value
        .trim();


    const password =
      document
        .getElementById(
          "loginPassword"
        )
        ?.value;


    const message =
      document.getElementById(
        "loginMessage"
      );


    if (
      id ===
        APP_CONFIG.login.id &&
      password ===
        APP_CONFIG.login.password
    ) {

      if (message) {

        message.textContent =
          "";

      }


      openApplication();

    }

    else {

      if (message) {

        message.textContent =
          "아이디 또는 비밀번호를 확인해주세요.";

      }

    }

  }
);



document
  .getElementById(
    "logoutButton"
  )
  ?.addEventListener(
    "click",
    logoutApplication
  );



/* =========================================================
   07. NAVIGATION
========================================================= */

const PAGE_TITLES = {

  dashboard:
    "PERFORMANCE DASHBOARD",

  athletes:
    "ATHLETE MANAGEMENT",

  winter:
    "WINTER SPORTS",

  summer:
    "SUMMER SPORTS",

  analysis:
    "MOTION ANALYSIS",

  records:
    "ANALYSIS RECORDS",

  training:
    "TRAINING CENTER",

  report:
    "PERFORMANCE REPORT",

  system:
    "SYSTEM DIAGNOSTICS"

};



function navigateTo(
  pageName
) {

  AppState.currentPage =
    pageName;


  document
    .querySelectorAll(
      "[data-page]"
    )
    .forEach(
      page => {

        const active =
          page.dataset.page ===
          pageName;


        page.hidden =
          !active;


        page.classList.toggle(
          "active",
          active
        );

      }
    );


  document
    .querySelectorAll(
      "[data-nav]"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.nav ===
          pageName
        );

      }
    );


  const title =
    document.querySelector(
      "[data-page-title]"
    );


  if (title) {

    title.textContent =
      PAGE_TITLES[
        pageName
      ] ||
      APP_CONFIG.name;

  }


  if (
    pageName ===
    "dashboard"
  ) {

    renderDashboard();

  }


  if (
    pageName ===
    "athletes"
  ) {

    renderAthletes();

  }


  if (
    pageName ===
    "records"
  ) {

    renderRecords();

  }


  window.scrollTo(
    {
      top:
        0,

      behavior:
        "smooth"
    }
  );

}



window.SeolcheonApp = {

  navigate:
    navigateTo,

  getSelectedAthlete,

  getAthleteById,

  getSportById,

  createAnalysisRecord,

  createReportRecord,

  refresh() {

    renderAll();

  }

};



document.addEventListener(
  "click",
  event => {

    const nav =
      event.target.closest(
        "[data-nav]"
      );


    if (!nav) {

      return;

    }


    navigateTo(
      nav.dataset.nav
    );

  }
);



/* =========================================================
   08. SPORTS RENDER
========================================================= */

function createSportCard(
  sport,
  season
) {

  return `
    <button
      type="button"
      class="sport-card"
      data-select-sport="${escapeHTML(sport.id)}"
      data-season="${escapeHTML(season)}"
    >

      <div>

        <div class="sport-card-icon">
          ${sport.icon}
        </div>

        <h3>
          ${escapeHTML(sport.name)}
        </h3>

        <small>
          ${season === "winter"
            ? "WINTER SPORT"
            : "SUMMER SPORT"}
        </small>

        <p>
          ${escapeHTML(sport.description)}
        </p>

      </div>

    </button>
  `;

}



function renderSports() {

  document
    .querySelectorAll(
      '[data-sport-selector="winter"]'
    )
    .forEach(
      container => {

        container.innerHTML =
          SPORTS_DATABASE.winter
            .map(
              sport =>
                createSportCard(
                  sport,
                  "winter"
                )
            )
            .join("");

      }
    );


  document
    .querySelectorAll(
      '[data-sport-selector="summer"]'
    )
    .forEach(
      container => {

        container.innerHTML =
          SPORTS_DATABASE.summer
            .map(
              sport =>
                createSportCard(
                  sport,
                  "summer"
                )
            )
            .join("");

      }
    );

}



document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-select-sport]"
      );


    if (!button) {

      return;

    }


    const sportId =
      button.dataset.selectSport;


    const season =
      button.dataset.season;


    AppState.selectedSportId =
      sportId;


    AppState.selectedSeason =
      season;


    const sport =
      getSportById(
        sportId
      );


    updateAnalysisSportHeader(
      sport,
      season
    );


    window.dispatchEvent(
      new CustomEvent(
        "seolcheon:sport-selected",
        {

          detail: {

            sport,

            season

          }

        }
      )
    );


    navigateTo(
      "analysis"
    );

  }
);



function updateAnalysisSportHeader(
  sport,
  season
) {

  const title =
    document.querySelector(
      "[data-sport-analysis-title]"
    );


  const seasonText =
    document.querySelector(
      "[data-sport-analysis-season]"
    );


  if (title) {

    title.textContent =
      sport?.name ||
      "종목을 선택하세요";

  }


  if (seasonText) {

    seasonText.textContent =
      season === "winter"
        ? "WINTER SPORTS"
        : season === "summer"
          ? "SUMMER SPORTS"
          : "-";

  }

}



/* =========================================================
   09. ATHLETE FORM
========================================================= */

const athleteForm =
  document.querySelector(
    "[data-athlete-form]"
  );


function resetAthleteForm() {

  AppState.editingAthleteId =
    null;


  athleteForm?.reset();


  const school =
    athleteForm?.elements[
      "school"
    ];


  const team =
    athleteForm?.elements[
      "team"
    ];


  if (school) {

    school.value =
      "설천고";

  }


  if (team) {

    team.value =
      "설천고";

  }


  const submit =
    document.querySelector(
      "[data-athlete-submit]"
    );


  if (submit) {

    submit.textContent =
      "선수 등록";

  }


  const message =
    document.querySelector(
      "[data-athlete-message]"
    );


  if (message) {

    message.textContent =
      "";

  }

}



athleteForm?.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const formData =
      new FormData(
        athleteForm
      );


    const sportId =
      String(
        formData.get(
          "sport"
        ) ||
        ""
      );


    const sport =
      getSportById(
        sportId
      );


    const athleteData = {

      name:
        String(
          formData.get(
            "name"
          ) ||
          ""
        ).trim(),

      school:
        String(
          formData.get(
            "school"
          ) ||
          "설천고"
        ).trim(),

      grade:
        String(
          formData.get(
            "grade"
          ) ||
          ""
        ),

      gender:
        String(
          formData.get(
            "gender"
          ) ||
          ""
        ),

      birthDate:
        String(
          formData.get(
            "birthDate"
          ) ||
          ""
        ),

      season:
        String(
          formData.get(
            "season"
          ) ||
          ""
        ),

      sport:
        sportId,

      sportName:
        sport?.name ||
        sportId,

      event:
        String(
          formData.get(
            "event"
          ) ||
          ""
        ).trim(),

      height:
        Number(
          formData.get(
            "height"
          )
        ) ||
        null,

      weight:
        Number(
          formData.get(
            "weight"
          )
        ) ||
        null,

      career:
        String(
          formData.get(
            "career"
          ) ||
          ""
        ).trim(),

      team:
        String(
          formData.get(
            "team"
          ) ||
          ""
        ).trim(),

      memo:
        String(
          formData.get(
            "memo"
          ) ||
          ""
        ).trim()

    };


    if (
      !athleteData.name
    ) {

      showAthleteMessage(
        "선수 이름을 입력해주세요."
      );

      return;

    }


    if (
      !athleteData.sport
    ) {

      showAthleteMessage(
        "종목을 선택해주세요."
      );

      return;

    }


    if (
      AppState.editingAthleteId
    ) {

      const index =
        AppState.athletes.findIndex(
          athlete =>
            athlete.id ===
            AppState.editingAthleteId
        );


      if (
        index !== -1
      ) {

        AppState.athletes[
          index
        ] = {

          ...AppState.athletes[
            index
          ],

          ...athleteData,

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

      const athlete = {

        id:
          createId(
            "athlete"
          ),

        ...athleteData,

        createdAt:
          new Date()
            .toISOString(),

        updatedAt:
          new Date()
            .toISOString()

      };


      AppState.athletes.unshift(
        athlete
      );


      AppState.selectedAthleteId =
        athlete.id;


      localStorage.setItem(
        APP_CONFIG.storage.selectedAthlete,
        athlete.id
      );


      showAthleteMessage(
        "선수가 등록되었습니다."
      );

    }


    saveAthletes();

    renderAll();


    setTimeout(
      resetAthleteForm,
      500
    );

  }
);



function showAthleteMessage(
  text
) {

  const message =
    document.querySelector(
      "[data-athlete-message]"
    );


  if (message) {

    message.textContent =
      text;

  }

}



document
  .querySelector(
    "[data-athlete-cancel]"
  )
  ?.addEventListener(
    "click",
    resetAthleteForm
  );



/* =========================================================
   10. ATHLETE LIST
========================================================= */

function renderAthletes() {

  const container =
    document.querySelector(
      "[data-athlete-list]"
    );


  if (!container) {

    return;

  }


  const search =
    (
      document.querySelector(
        "[data-athlete-search]"
      )?.value ||
      ""
    )
      .trim()
      .toLowerCase();


  const filter =
    document.querySelector(
      "[data-athlete-sport-filter]"
    )?.value ||
    "all";


  let athletes =
    [...AppState.athletes];


  if (search) {

    athletes =
      athletes.filter(
        athlete => {

          return [

            athlete.name,

            athlete.school,

            athlete.team,

            athlete.sportName,

            athlete.event

          ]
            .join(" ")
            .toLowerCase()
            .includes(
              search
            );

        }
      );

  }


  if (
    filter !==
    "all"
  ) {

    athletes =
      athletes.filter(
        athlete =>
          athlete.sport ===
          filter
      );

  }


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


  container.innerHTML =
    athletes
      .map(
        athlete => {

          const selected =
            athlete.id ===
            AppState.selectedAthleteId;


          return `
            <article
              class="athlete-card ${selected ? "selected" : ""}"
              data-athlete-card="${escapeHTML(athlete.id)}"
            >

              <div class="athlete-avatar">
                ${escapeHTML(
                  athlete.name
                    .slice(0, 1)
                )}
              </div>

              <div class="athlete-card-info">

                <strong>
                  ${escapeHTML(athlete.name)}
                </strong>

                <span>
                  ${escapeHTML(athlete.school || "-")}
                  ·
                  ${escapeHTML(athlete.grade || "-")}
                  ·
                  ${escapeHTML(athlete.sportName || "-")}
                </span>

              </div>

              <div class="athlete-card-actions">

                <button
                  type="button"
                  class="mini-button"
                  data-athlete-select="${escapeHTML(athlete.id)}"
                >
                  선택
                </button>

                <button
                  type="button"
                  class="mini-button"
                  data-athlete-analysis="${escapeHTML(athlete.id)}"
                >
                  분석
                </button>

                <button
                  type="button"
                  class="mini-button"
                  data-athlete-edit="${escapeHTML(athlete.id)}"
                >
                  수정
                </button>

                <button
                  type="button"
                  class="danger-button"
                  data-athlete-delete="${escapeHTML(athlete.id)}"
                >
                  삭제
                </button>

              </div>

            </article>
          `;

        }
      )
      .join("");

}



document
  .querySelector(
    "[data-athlete-search]"
  )
  ?.addEventListener(
    "input",
    renderAthletes
  );



document
  .querySelector(
    "[data-athlete-sport-filter]"
  )
  ?.addEventListener(
    "change",
    renderAthletes
  );



/* =========================================================
   11. ATHLETE ACTIONS
========================================================= */

document.addEventListener(
  "click",
  event => {

    const select =
      event.target.closest(
        "[data-athlete-select]"
      );


    if (select) {

      selectAthlete(
        select.dataset
          .athleteSelect
      );

      return;

    }


    const analysis =
      event.target.closest(
        "[data-athlete-analysis]"
      );


    if (analysis) {

      const athlete =
        getAthleteById(
          analysis.dataset
            .athleteAnalysis
        );


      if (!athlete) {

        return;

      }


      selectAthlete(
        athlete.id
      );


      AppState.selectedSportId =
        athlete.sport;


      AppState.selectedSeason =
        athlete.season ||
        null;


      updateAnalysisSportHeader(
        getSportById(
          athlete.sport
        ),
        athlete.season
      );


      window.dispatchEvent(
        new CustomEvent(
          "seolcheon:sport-selected",
          {

            detail: {

              sport:
                getSportById(
                  athlete.sport
                ),

              season:
                athlete.season

            }

          }
        )
      );


      navigateTo(
        "analysis"
      );


      return;

    }


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



function selectAthlete(
  athleteId
) {

  const athlete =
    getAthleteById(
      athleteId
    );


  if (!athlete) {

    return;

  }


  AppState.selectedAthleteId =
    athleteId;


  localStorage.setItem(
    APP_CONFIG.storage.selectedAthlete,
    athleteId
  );


  updateSelectedAthleteUI();

  renderAthletes();


  window.dispatchEvent(
    new CustomEvent(
      "seolcheon:athlete-selected",
      {

        detail: {

          athlete

        }

      }
    )
  );

}



function editAthlete(
  athleteId
) {

  const athlete =
    getAthleteById(
      athleteId
    );


  if (
    !athlete ||
    !athleteForm
  ) {

    return;

  }


  AppState.editingAthleteId =
    athleteId;


  Object.entries(
    athlete
  )
    .forEach(
      ([key, value]) => {

        const field =
          athleteForm.elements[
            key
          ];


        if (!field) {

          return;

        }


        field.value =
          value ?? "";

      }
    );


  const submit =
    document.querySelector(
      "[data-athlete-submit]"
    );


  if (submit) {

    submit.textContent =
      "선수 수정";

  }


  athleteForm.scrollIntoView(
    {
      behavior:
        "smooth",

      block:
        "start"
    }
  );

}



function deleteAthlete(
  athleteId
) {

  const athlete =
    getAthleteById(
      athleteId
    );


  if (!athlete) {

    return;

  }


  const confirmed =
    confirm(
      `${athlete.name} 선수 정보를 삭제할까요?\n관련 분석 기록은 유지됩니다.`
    );


  if (!confirmed) {

    return;

  }


  AppState.athletes =
    AppState.athletes.filter(
      item =>
        item.id !==
        athleteId
    );


  if (
    AppState.selectedAthleteId ===
    athleteId
  ) {

    AppState.selectedAthleteId =
      null;


    localStorage.removeItem(
      APP_CONFIG.storage.selectedAthlete
    );

  }


  saveAthletes();

  renderAll();

}



/* =========================================================
   12. SELECTED ATHLETE UI
========================================================= */

function updateSelectedAthleteUI() {

  const athlete =
    getSelectedAthlete();


  document
    .querySelectorAll(
      "[data-selected-athlete-name]"
    )
    .forEach(
      element => {

        element.textContent =
          athlete?.name ||
          "선택 없음";

      }
    );


  document
    .querySelectorAll(
      "[data-selected-athlete-sport]"
    )
    .forEach(
      element => {

        element.textContent =
          athlete?.sportName ||
          "-";

      }
    );

}



/* =========================================================
   13. CREATE ANALYSIS RECORD
========================================================= */

function createAnalysisRecord(
  analysisData = {}
) {

  const athlete =
    getSelectedAthlete();


  const sport =
    getSportById(
      analysisData.sportId ||
      AppState.selectedSportId ||
      athlete?.sport
    );


  const record = {

    id:
      createId(
        "analysis"
      ),

    athleteId:
      athlete?.id ||
      null,

    athleteName:
      athlete?.name ||
      "미지정 선수",

    school:
      athlete?.school ||
      "설천고",

    grade:
      athlete?.grade ||
      "",

    sportId:
      sport?.id ||
      analysisData.sportId ||
      "",

    sportName:
      sport?.name ||
      analysisData.sportName ||
      "종목 미지정",

    season:
      AppState.selectedSeason ||
      athlete?.season ||
      "",

    mode:
      analysisData.mode ||
      "video",

    overallScore:
      Number(
        analysisData.overallScore
      ) ||
      0,

    scores: {

      posture:
        Number(
          analysisData.scores
            ?.posture
        ) ||
        0,

      symmetry:
        Number(
          analysisData.scores
            ?.symmetry
        ) ||
        0,

      technique:
        Number(
          analysisData.scores
            ?.technique
        ) ||
        0,

      stability:
        Number(
          analysisData.scores
            ?.stability
        ) ||
        0,

      efficiency:
        Number(
          analysisData.scores
            ?.efficiency
        ) ||
        0,

      elite:
        Number(
          analysisData.scores
            ?.elite
        ) ||
        0

    },

    angles:
      analysisData.angles ||
      {},

    metrics:
      analysisData.metrics ||
      {},

    technique:
      analysisData.technique ||
      "",

    transitions:
      analysisData.transitions ||
      [],

    segments:
      analysisData.segments ||
      [],

    feedback:
      analysisData.feedback ||
      [],

    problems:
      analysisData.problems ||
      [],

    training:
      analysisData.training ||
      [],

    images:
      analysisData.images ||
      {},

    threeD:
      analysisData.threeD ||
      {},

    createdAt:
      new Date()
        .toISOString()

  };


  AppState.analyses.unshift(
    record
  );


  saveAnalyses();

  renderDashboard();

  renderRecords();


  return record;

}



/* =========================================================
   14. CREATE REPORT RECORD
========================================================= */

function createReportRecord(
  reportData = {}
) {

  const report = {

    id:
      createId(
        "report"
      ),

    ...reportData,

    createdAt:
      reportData.createdAt ||
      new Date()
        .toISOString()

  };


  AppState.reports.unshift(
    report
  );


  saveReports();

  renderDashboard();


  return report;

}



/* =========================================================
   15. DASHBOARD
========================================================= */

function renderDashboard() {

  const athleteCount =
    document.querySelector(
      "[data-athlete-count]"
    );


  const analysisCount =
    document.querySelector(
      "[data-analysis-count]"
    );


  const reportCount =
    document.querySelector(
      "[data-report-count]"
    );


  const averageScore =
    document.querySelector(
      "[data-average-score]"
    );


  if (athleteCount) {

    athleteCount.textContent =
      AppState.athletes.length;

  }


  if (analysisCount) {

    analysisCount.textContent =
      AppState.analyses.length;

  }


  if (reportCount) {

    reportCount.textContent =
      AppState.reports.length;

  }


  const avg =
    average(
      AppState.analyses.map(
        analysis =>
          analysis.overallScore
      )
    );


  if (averageScore) {

    averageScore.textContent =
      avg === null
        ? "--"
        : Math.round(
            avg
          );

  }


  renderDashboardPerformance();

  renderRecentAnalyses();

}



function renderDashboardPerformance() {

  const selected =
    getSelectedAthlete();


  let records =
    AppState.analyses;


  if (selected) {

    const athleteRecords =
      records.filter(
        record =>
          record.athleteId ===
          selected.id
      );


    if (
      athleteRecords.length
    ) {

      records =
        athleteRecords;

    }

  }


  const latest =
    records[0];


  const keys = [

    "posture",

    "symmetry",

    "technique",

    "elite"

  ];


  keys.forEach(
    key => {

      const score =
        latest?.scores?.[
          key
        ];


      const value =
        Number.isFinite(
          Number(score)
        )
          ? clamp(
              Number(score),
              0,
              100
            )
          : null;


      document
        .querySelectorAll(
          `[data-dashboard-score="${key}"]`
        )
        .forEach(
          element => {

            element.textContent =
              value === null
                ? "--"
                : Math.round(
                    value
                  );

          }
        );


      document
        .querySelectorAll(
          `[data-dashboard-bar="${key}"]`
        )
        .forEach(
          element => {

            element.style.width =
              value === null
                ? "0%"
                : `${value}%`;

          }
        );

    }
  );

}



function renderRecentAnalyses() {

  const container =
    document.querySelector(
      "[data-dashboard-recent]"
    );


  if (!container) {

    return;

  }


  const recent =
    AppState.analyses.slice(
      0,
      5
    );


  if (
    recent.length ===
    0
  ) {

    container.innerHTML = `
      <div class="empty-state">
        분석 기록이 없습니다.
      </div>
    `;

    return;

  }


  container.innerHTML =
    recent
      .map(
        record => `
          <div class="recent-analysis-item">

            <div>

              <strong>
                ${escapeHTML(record.athleteName)}
              </strong>

              <span>
                ${escapeHTML(record.sportName)}
                ·
                ${escapeHTML(formatDate(record.createdAt))}
              </span>

            </div>

            <div class="recent-analysis-score">
              ${Math.round(
                Number(
                  record.overallScore
                ) ||
                0
              )}
            </div>

          </div>
        `
      )
      .join("");

}



/* =========================================================
   16. RECORDS
========================================================= */

function renderRecords() {

  const container =
    document.querySelector(
      "[data-analysis-record-list]"
    );


  if (!container) {

    return;

  }


  if (
    AppState.analyses.length ===
    0
  ) {

    container.innerHTML = `
      <div class="empty-state">
        저장된 분석 기록이 없습니다.
      </div>
    `;

    return;

  }


  container.innerHTML =
    AppState.analyses
      .map(
        record => `
          <article class="record-card">

            <div class="record-card-top">

              <div>

                <h3>
                  ${escapeHTML(record.athleteName)}
                </h3>

                <p>
                  ${escapeHTML(record.sportName)}
                  ·
                  ${escapeHTML(formatDate(record.createdAt))}
                </p>

              </div>

              <div class="record-score">
                ${Math.round(
                  Number(
                    record.overallScore
                  ) ||
                  0
                )}
              </div>

            </div>

            <div class="record-actions">

              <button
                type="button"
                class="mini-button"
                data-record-report="${escapeHTML(record.id)}"
              >
                리포트
              </button>

              <button
                type="button"
                class="danger-button"
                data-record-delete="${escapeHTML(record.id)}"
              >
                삭제
              </button>

            </div>

          </article>
        `
      )
      .join("");

}



/* =========================================================
   17. RECORD ACTIONS
========================================================= */

document.addEventListener(
  "click",
  event => {

    const report =
      event.target.closest(
        "[data-record-report]"
      );


    if (report) {

      const record =
        AppState.analyses.find(
          item =>
            item.id ===
            report.dataset
              .recordReport
        );


      if (!record) {

        return;

      }


      window.dispatchEvent(
        new CustomEvent(
          "seolcheon:open-report",
          {

            detail: {

              record

            }

          }
        )
      );


      navigateTo(
        "report"
      );


      return;

    }


    const remove =
      event.target.closest(
        "[data-record-delete]"
      );


    if (!remove) {

      return;

    }


    const recordId =
      remove.dataset
        .recordDelete;


    const confirmed =
      confirm(
        "이 분석 기록을 삭제할까요?"
      );


    if (!confirmed) {

      return;

    }


    AppState.analyses =
      AppState.analyses.filter(
        item =>
          item.id !==
          recordId
      );


    saveAnalyses();

    renderDashboard();

    renderRecords();

  }
);



/* =========================================================
   18. BACKUP
========================================================= */

function createBackupData() {

  return {

    application:
      APP_CONFIG.name,

    version:
      APP_CONFIG.version,

    exportedAt:
      new Date()
        .toISOString(),

    athletes:
      AppState.athletes,

    analyses:
      AppState.analyses,

    reports:
      AppState.reports

  };

}



function downloadBackup() {

  const data =
    createBackupData();


  const blob =
    new Blob(
      [
        JSON.stringify(
          data,
          null,
          2
        )
      ],
      {
        type:
          "application/json"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href =
    url;


  link.download =
    `seolcheon_backup_${Date.now()}.json`;


  document.body.appendChild(
    link
  );


  link.click();


  link.remove();


  URL.revokeObjectURL(
    url
  );

}



async function restoreBackupFile(
  file
) {

  if (!file) {

    return;

  }


  try {

    const text =
      await file.text();


    const data =
      JSON.parse(
        text
      );


    if (
      !Array.isArray(
        data.athletes
      ) ||
      !Array.isArray(
        data.analyses
      )
    ) {

      throw new Error(
        "올바른 백업 파일이 아닙니다."
      );

    }


    AppState.athletes =
      data.athletes;


    AppState.analyses =
      data.analyses;


    AppState.reports =
      Array.isArray(
        data.reports
      )
        ? data.reports
        : [];


    saveAthletes();

    saveAnalyses();

    saveReports();

    renderAll();


    alert(
      "백업 데이터를 복원했습니다."
    );

  }

  catch (error) {

    console.error(
      error
    );


    alert(
      "백업 파일을 불러오지 못했습니다."
    );

  }

}



document
  .querySelector(
    "[data-backup-download]"
  )
  ?.addEventListener(
    "click",
    downloadBackup
  );



document
  .querySelector(
    "[data-backup-upload]"
  )
  ?.addEventListener(
    "change",
    event => {

      restoreBackupFile(
        event.target.files?.[0]
      );

    }
  );



/* =========================================================
   19. RESET DATA
========================================================= */

document
  .querySelector(
    "[data-reset-all]"
  )
  ?.addEventListener(
    "click",
    () => {

      const confirmed =
        confirm(
          "선수, 분석, 리포트 데이터를 모두 삭제할까요?"
        );


      if (!confirmed) {

        return;

      }


      AppState.athletes =
        [];

      AppState.analyses =
        [];

      AppState.reports =
        [];

      AppState.selectedAthleteId =
        null;


      localStorage.removeItem(
        APP_CONFIG.storage.athletes
      );

      localStorage.removeItem(
        APP_CONFIG.storage.analyses
      );

      localStorage.removeItem(
        APP_CONFIG.storage.reports
      );

      localStorage.removeItem(
        APP_CONFIG.storage.selectedAthlete
      );


      renderAll();

    }
  );



/* =========================================================
   20. RENDER ALL
========================================================= */

function renderAll() {

  renderSports();

  renderAthletes();

  updateSelectedAthleteUI();

  renderDashboard();

  renderRecords();

}



/* =========================================================
   21. APP READY EVENT
========================================================= */

function dispatchReadyEvent() {

  window.dispatchEvent(
    new CustomEvent(
      "seolcheon:app-ready",
      {

        detail: {

          config:
            APP_CONFIG,

          state:
            AppState

        }

      }
    )
  );

}



/* =========================================================
   22. INITIALIZE
========================================================= */

function initializeApplication() {

  loadApplicationData();

  renderAll();


  if (
    sessionStorage.getItem(
      "seolcheon_login"
    ) ===
    "true"
  ) {

    openApplication();

  }

  else {

    if (loginScreen) {

      loginScreen.hidden =
        false;

    }


    if (appShell) {

      appShell.hidden =
        true;

    }

  }


  dispatchReadyEvent();


  console.log(
    `${APP_CONFIG.name} ${APP_CONFIG.version} READY`
  );

}



if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeApplication
  );

}

else {

  initializeApplication();

}


/* =========================================================
   23. PUBLIC API
========================================================= */

window.SeolcheonCore = {

  config:
    APP_CONFIG,

  state:
    AppState,

  sports:
    SPORTS_DATABASE,

  getSelectedAthlete,

  getAthleteById,

  getSportById,

  selectAthlete,

  createAnalysisRecord,

  createReportRecord,

  renderDashboard,

  renderRecords,

  renderAthletes,

  saveAthletes,

  saveAnalyses,

  saveReports,

  navigateTo

};


/* =========================================================
   END OF APP.JS
========================================================= */