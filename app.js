/* ============================================================
   SEOLCHEON SPORTS PERFORMANCE LAB
   APP.JS
   PART 1 / 2

   CORE CONTROLLER
   - App State
   - Storage
   - Navigation
   - Sidebar
   - Athlete Selection
   - Dashboard
   - Analysis Mode
   - Global Events
============================================================ */

"use strict";


/* ============================================================
   01. APP CONFIG
============================================================ */

const APP_CONFIG = {

  name:
    "설천고 스포츠 퍼포먼스 분석 시스템",

  version:
    "2.0.0",

  school:
    "설천고",

  storage: {

    athletes:
      "seolcheon_athletes_v2",

    analyses:
      "seolcheon_analyses_v2",

    reports:
      "seolcheon_reports_v2",

    settings:
      "seolcheon_settings_v2",

    selectedAthlete:
      "seolcheon_selected_athlete_v2"

  }

};


/* ============================================================
   02. GLOBAL STATE
============================================================ */

const AppState = {

  currentPage:
    "dashboard",

  selectedAthlete:
    null,

  selectedSport:
    null,

  selectedSeason:
    null,

  analysisMode:
    "video",

  athletes:
    [],

  analyses:
    [],

  reports:
    [],

  initialized:
    false

};


/* ============================================================
   03. STORAGE
============================================================ */

const StorageManager = {


  read(key, fallback = []) {

    try {

      const value =
        localStorage.getItem(key);

      if (!value) {

        return fallback;

      }

      return JSON.parse(value);

    }

    catch (error) {

      console.error(
        "[STORAGE READ ERROR]",
        key,
        error
      );

      return fallback;

    }

  },


  write(key, value) {

    try {

      localStorage.setItem(
        key,
        JSON.stringify(value)
      );

      return true;

    }

    catch (error) {

      console.error(
        "[STORAGE WRITE ERROR]",
        key,
        error
      );

      return false;

    }

  },


  remove(key) {

    try {

      localStorage.removeItem(key);

      return true;

    }

    catch (error) {

      console.error(
        "[STORAGE REMOVE ERROR]",
        key,
        error
      );

      return false;

    }

  }

};


/* ============================================================
   04. UTILITIES
============================================================ */

const Utils = {


  uid(prefix = "item") {

    return (
      prefix +
      "_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .slice(2, 9)
    );

  },


  clamp(
    value,
    min = 0,
    max = 100
  ) {

    const number =
      Number(value);

    if (
      Number.isNaN(number)
    ) {

      return min;

    }

    return Math.min(
      max,
      Math.max(
        min,
        number
      )
    );

  },


  average(values = []) {

    const numbers =
      values
        .map(Number)
        .filter(
          value =>
            Number.isFinite(value)
        );

    if (!numbers.length) {

      return 0;

    }

    return (
      numbers.reduce(
        (sum, value) =>
          sum + value,
        0
      ) /
      numbers.length
    );

  },


  formatDate(value) {

    if (!value) {

      return "-";

    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "-";

    }

    return new Intl.DateTimeFormat(
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
    ).format(date);

  },


  formatDuration(seconds = 0) {

    const safe =
      Math.max(
        0,
        Number(seconds) || 0
      );

    const minutes =
      Math.floor(
        safe / 60
      );

    const secs =
      Math.floor(
        safe % 60
      );

    const centiseconds =
      Math.floor(
        (safe % 1) * 100
      );

    return (
      String(minutes)
        .padStart(2, "0") +
      ":" +
      String(secs)
        .padStart(2, "0") +
      "." +
      String(centiseconds)
        .padStart(2, "0")
    );

  },


  escapeHTML(value = "") {

    return String(value)
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );

  }

};


/* ============================================================
   05. LOAD APP DATA
============================================================ */

function loadAppData() {

  AppState.athletes =
    StorageManager.read(
      APP_CONFIG.storage.athletes,
      []
    );


  AppState.analyses =
    StorageManager.read(
      APP_CONFIG.storage.analyses,
      []
    );


  AppState.reports =
    StorageManager.read(
      APP_CONFIG.storage.reports,
      []
    );


  const selectedId =
    StorageManager.read(
      APP_CONFIG.storage.selectedAthlete,
      null
    );


  if (selectedId) {

    AppState.selectedAthlete =
      AppState.athletes.find(
        athlete =>
          athlete.id ===
          selectedId
      ) || null;

  }

}


/* ============================================================
   06. SAVE COLLECTIONS
============================================================ */

function saveAthletes() {

  StorageManager.write(
    APP_CONFIG.storage.athletes,
    AppState.athletes
  );

}


function saveAnalyses() {

  StorageManager.write(
    APP_CONFIG.storage.analyses,
    AppState.analyses
  );

}


function saveReports() {

  StorageManager.write(
    APP_CONFIG.storage.reports,
    AppState.reports
  );

}


/* ============================================================
   07. PAGE NAVIGATION
============================================================ */

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

  report:
    "PERFORMANCE REPORT",

  system:
    "SYSTEM DIAGNOSTICS"

};


function navigateTo(
  pageName,
  options = {}
) {

  const pages =
    document.querySelectorAll(
      "[data-page]"
    );


  let pageExists =
    false;


  pages.forEach(page => {

    const active =
      page.dataset.page ===
      pageName;


    if (active) {

      pageExists =
        true;

    }


    page.hidden =
      !active;


    page.classList.toggle(
      "active",
      active
    );

  });


  if (!pageExists) {

    console.warn(
      "[NAVIGATION]",
      "Page not found:",
      pageName
    );

    return;

  }


  document
    .querySelectorAll(
      "[data-nav]"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.nav ===
          pageName
      );

    });


  AppState.currentPage =
    pageName;


  const title =
    document.querySelector(
      "[data-page-title]"
    );


  if (title) {

    title.textContent =
      PAGE_TITLES[pageName] ||
      "SPORTS PERFORMANCE";

  }


  closeMobileSidebar();


  if (
    options.scrollTop !==
    false
  ) {

    window.scrollTo({
      top:
        0,

      behavior:
        "smooth"
    });

  }


  runPageRefresh(
    pageName
  );

}


/* ============================================================
   08. PAGE REFRESH
============================================================ */

function runPageRefresh(
  pageName
) {

  switch (pageName) {


    case "dashboard":

      refreshDashboard();

      break;


    case "athletes":

      callModule(
        "AthleteManager",
        "render"
      );

      break;


    case "winter":

    case "summer":

      callModule(
        "SportsManager",
        "render",
        pageName
      );

      break;


    case "analysis":

      refreshAnalysisHeader();

      callModule(
        "MotionAnalysis",
        "refresh"
      );

      break;


    case "records":

      callModule(
        "RecordsManager",
        "render"
      );

      break;


    case "report":

      callModule(
        "ReportManager",
        "renderCurrent"
      );

      break;


    case "system":

      callModule(
        "SystemCheck",
        "run"
      );

      break;

  }

}


/* ============================================================
   09. MODULE CALL HELPER
============================================================ */

function callModule(
  moduleName,
  methodName,
  ...args
) {

  const module =
    window[moduleName];


  if (
    !module ||
    typeof module[methodName] !==
      "function"
  ) {

    return null;

  }


  try {

    return module[
      methodName
    ](...args);

  }

  catch (error) {

    console.error(
      `[${moduleName}.${methodName}]`,
      error
    );

    return null;

  }

}


/* ============================================================
   10. NAVIGATION BUTTON EVENTS
============================================================ */

function initializeNavigation() {

  document.addEventListener(
    "click",
    event => {

      const navButton =
        event.target.closest(
          "[data-nav]"
        );


      if (!navButton) {

        return;

      }


      navigateTo(
        navButton.dataset.nav
      );

    }
  );

}


/* ============================================================
   11. MOBILE SIDEBAR
============================================================ */

function openMobileSidebar() {

  const sidebar =
    document.getElementById(
      "sidebar"
    );


  if (!sidebar) {

    return;

  }


  sidebar.classList.add(
    "open"
  );


  document.body
    .classList.add(
      "no-scroll"
    );

}


function closeMobileSidebar() {

  const sidebar =
    document.getElementById(
      "sidebar"
    );


  sidebar?.classList.remove(
    "open"
  );


  document.body
    .classList.remove(
      "no-scroll"
    );

}


function initializeMobileSidebar() {

  const button =
    document.querySelector(
      "[data-mobile-menu]"
    );


  button?.addEventListener(
    "click",
    () => {

      const sidebar =
        document.getElementById(
          "sidebar"
        );


      if (!sidebar) {

        return;

      }


      if (
        sidebar.classList.contains(
          "open"
        )
      ) {

        closeMobileSidebar();

      }

      else {

        openMobileSidebar();

      }

    }
  );


  document.addEventListener(
    "click",
    event => {

      if (
        window.innerWidth >
        900
      ) {

        return;

      }


      const sidebar =
        document.getElementById(
          "sidebar"
        );


      if (
        !sidebar ||
        !sidebar.classList.contains(
          "open"
        )
      ) {

        return;

      }


      const insideSidebar =
        event.target.closest(
          "#sidebar"
        );


      const menuButton =
        event.target.closest(
          "[data-mobile-menu]"
        );


      if (
        !insideSidebar &&
        !menuButton
      ) {

        closeMobileSidebar();

      }

    }
  );

}


/* ============================================================
   12. SELECT ATHLETE
============================================================ */

function selectAthlete(
  athleteOrId
) {

  let athlete =
    null;


  if (
    typeof athleteOrId ===
    "string"
  ) {

    athlete =
      AppState.athletes.find(
        item =>
          item.id ===
          athleteOrId
      ) || null;

  }

  else {

    athlete =
      athleteOrId;

  }


  AppState.selectedAthlete =
    athlete;


  if (athlete) {

    StorageManager.write(
      APP_CONFIG.storage.selectedAthlete,
      athlete.id
    );

  }

  else {

    StorageManager.remove(
      APP_CONFIG.storage.selectedAthlete
    );

  }


  refreshSelectedAthleteUI();


  window.dispatchEvent(
    new CustomEvent(
      "seolcheon:athlete-selected",
      {
        detail:
          athlete
      }
    )
  );

}


/* ============================================================
   13. SELECTED ATHLETE UI
============================================================ */

function refreshSelectedAthleteUI() {

  const athlete =
    AppState.selectedAthlete;


  document
    .querySelectorAll(
      "[data-selected-athlete-name]"
    )
    .forEach(element => {

      element.textContent =
        athlete?.name ||
        "선택 없음";

    });


  document
    .querySelectorAll(
      "[data-selected-athlete-sport]"
    )
    .forEach(element => {

      element.textContent =
        athlete?.sportName ||
        athlete?.sport ||
        "-";

    });

}


/* ============================================================
   14. SELECT SPORT
============================================================ */

function selectSport(
  sport,
  season = null
) {

  AppState.selectedSport =
    sport;


  AppState.selectedSeason =
    season;


  refreshAnalysisHeader();


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

}


/* ============================================================
   15. ANALYSIS HEADER
============================================================ */

function refreshAnalysisHeader() {

  const sportTitle =
    document.querySelector(
      "[data-sport-analysis-title]"
    );


  const seasonLabel =
    document.querySelector(
      "[data-sport-analysis-season]"
    );


  const athlete =
    AppState.selectedAthlete;


  let sportName =
    "-";


  if (
    window.SportsDatabase &&
    AppState.selectedSport
  ) {

    const sport =
      window.SportsDatabase.getSport?.(
        AppState.selectedSport
      );


    sportName =
      sport?.name ||
      AppState.selectedSport;

  }

  else if (
    athlete?.sportName
  ) {

    sportName =
      athlete.sportName;

  }


  if (sportTitle) {

    sportTitle.textContent =
      sportName === "-"
        ? "종목을 선택하세요"
        : sportName + " 자세분석";

  }


  if (seasonLabel) {

    const season =
      AppState.selectedSeason ||
      athlete?.season;


    seasonLabel.textContent =
      season === "winter"
        ? "WINTER SPORTS"
        : season === "summer"
          ? "SUMMER SPORTS"
          : "-";

  }


  refreshSelectedAthleteUI();

}


/* ============================================================
   16. ANALYSIS MODE
============================================================ */

function setAnalysisMode(
  mode
) {

  if (
    ![
      "realtime",
      "video"
    ].includes(mode)
  ) {

    return;

  }


  AppState.analysisMode =
    mode;


  document
    .querySelectorAll(
      "[data-analysis-mode]"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.analysisMode ===
          mode
      );

    });


  window.dispatchEvent(
    new CustomEvent(
      "seolcheon:analysis-mode",
      {
        detail:
          mode
      }
    )
  );

}


/* ============================================================
   17. ANALYSIS MODE BUTTONS
============================================================ */

function initializeAnalysisModes() {

  document.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "[data-analysis-mode]"
        );


      if (!button) {

        return;

      }


      setAnalysisMode(
        button.dataset.analysisMode
      );

    }
  );

}


/* ============================================================
   18. DASHBOARD
============================================================ */

function refreshDashboard() {

  refreshDashboardCounters();

  refreshDashboardPerformance();

  refreshDashboardRecent();

}


/* ============================================================
   19. DASHBOARD COUNTERS
============================================================ */

function refreshDashboardCounters() {

  const athleteCount =
    AppState.athletes.length;


  const analysisCount =
    AppState.analyses.length;


  const reportCount =
    AppState.reports.length;


  const scores =
    AppState.analyses
      .map(
        analysis =>
          Number(
            analysis.overallScore ??
            analysis.score
          )
      )
      .filter(
        Number.isFinite
      );


  const averageScore =
    scores.length
      ? Math.round(
          Utils.average(scores)
        )
      : null;


  setText(
    "[data-athlete-count]",
    athleteCount
  );


  setText(
    "[data-analysis-count]",
    analysisCount
  );


  setText(
    "[data-report-count]",
    reportCount
  );


  setText(
    "[data-average-score]",
    averageScore ??
    "--"
  );

}


/* ============================================================
   20. DASHBOARD PERFORMANCE
============================================================ */

function refreshDashboardPerformance() {

  const athlete =
    AppState.selectedAthlete;


  let analyses =
    AppState.analyses;


  if (athlete) {

    analyses =
      analyses.filter(
        analysis =>
          analysis.athleteId ===
          athlete.id
      );

  }


  const latest =
    analyses
      .slice()
      .sort(
        (a, b) =>
          new Date(
            b.createdAt ||
            b.date ||
            0
          ) -
          new Date(
            a.createdAt ||
            a.date ||
            0
          )
      )[0];


  const scores = {

    posture:
      latest?.scores?.posture ??
      latest?.posture ??
      0,

    symmetry:
      latest?.scores?.symmetry ??
      latest?.symmetry ??
      0,

    technique:
      latest?.scores?.technique ??
      latest?.technique ??
      0,

    elite:
      latest?.scores?.elite ??
      latest?.elite ??
      0

  };


  Object.entries(
    scores
  )
    .forEach(
      ([key, value]) => {

        const score =
          Math.round(
            Utils.clamp(value)
          );


        document
          .querySelectorAll(
            `[data-dashboard-score="${key}"]`
          )
          .forEach(
            element => {

              element.textContent =
                latest
                  ? score
                  : "--";

            }
          );


        document
          .querySelectorAll(
            `[data-dashboard-bar="${key}"]`
          )
          .forEach(
            element => {

              element.style.width =
                latest
                  ? score + "%"
                  : "0%";

            }
          );

      }
    );

}


/* ============================================================
   21. DASHBOARD RECENT
============================================================ */

function refreshDashboardRecent() {

  const container =
    document.querySelector(
      "[data-dashboard-recent]"
    );


  if (!container) {

    return;

  }


  const recent =
    AppState.analyses
      .slice()
      .sort(
        (a, b) =>
          new Date(
            b.createdAt ||
            b.date ||
            0
          ) -
          new Date(
            a.createdAt ||
            a.date ||
            0
          )
      )
      .slice(
        0,
        5
      );


  if (!recent.length) {

    container.innerHTML =
      `
        <div class="empty-state">
          분석 기록이 없습니다.
        </div>
      `;

    return;

  }


  container.innerHTML =
    recent
      .map(
        analysis => {

          const athlete =
            AppState.athletes.find(
              item =>
                item.id ===
                analysis.athleteId
            );


          const name =
            athlete?.name ||
            analysis.athleteName ||
            "선수 미지정";


          const sport =
            analysis.sportName ||
            analysis.sport ||
            "-";


          const score =
            analysis.overallScore ??
            analysis.score ??
            "--";


          return `
            <button
              type="button"
              class="record-card"
              data-open-analysis-record="${Utils.escapeHTML(
                analysis.id || ""
              )}"
            >

              <div class="record-main">

                <strong>
                  ${Utils.escapeHTML(name)}
                </strong>

                <span>
                  ${Utils.escapeHTML(sport)}
                  ·
                  ${Utils.escapeHTML(
                    Utils.formatDate(
                      analysis.createdAt ||
                      analysis.date
                    )
                  )}
                </span>

              </div>

              <div class="record-actions">

                <strong class="text-blue">
                  ${Utils.escapeHTML(score)}
                </strong>

              </div>

            </button>
          `;

        }
      )
      .join("");

}


/* ============================================================
   22. SET TEXT
============================================================ */

function setText(
  selector,
  value
) {

  document
    .querySelectorAll(
      selector
    )
    .forEach(
      element => {

        element.textContent =
          value;

      }
    );

}


/* ============================================================
   23. QUICK NAVIGATION
============================================================ */

function initializeQuickActions() {

  document.addEventListener(
    "click",
    event => {

      const quick =
        event.target.closest(
          "[data-quick-nav]"
        );


      if (!quick) {

        return;

      }


      navigateTo(
        quick.dataset.quickNav
      );

    }
  );

}


/* ============================================================
   24. OPEN ANALYSIS RECORD
============================================================ */

function initializeRecordOpening() {

  document.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "[data-open-analysis-record]"
        );


      if (!button) {

        return;

      }


      const id =
        button.dataset
          .openAnalysisRecord;


      const analysis =
        AppState.analyses.find(
          item =>
            item.id === id
        );


      if (!analysis) {

        return;

      }


      window.dispatchEvent(
        new CustomEvent(
          "seolcheon:open-record",
          {
            detail:
              analysis
          }
        )
      );


      navigateTo(
        "report"
      );

    }
  );

}


/* ============================================================
   25. GLOBAL DATA EVENTS
============================================================ */

function initializeGlobalEvents() {

  window.addEventListener(
    "seolcheon:athletes-updated",
    event => {

      if (
        Array.isArray(
          event.detail
        )
      ) {

        AppState.athletes =
          event.detail;

      }

      else {

        AppState.athletes =
          StorageManager.read(
            APP_CONFIG.storage.athletes,
            []
          );

      }


      saveAthletes();


      if (
        AppState.selectedAthlete
      ) {

        const refreshed =
          AppState.athletes.find(
            athlete =>
              athlete.id ===
              AppState
                .selectedAthlete
                .id
          );


        AppState.selectedAthlete =
          refreshed ||
          null;

      }


      refreshSelectedAthleteUI();

      refreshDashboard();

    }
  );


  window.addEventListener(
    "seolcheon:analysis-saved",
    event => {

      const analysis =
        event.detail;


      if (!analysis) {

        return;

      }


      const index =
        AppState.analyses.findIndex(
          item =>
            item.id ===
            analysis.id
        );


      if (
        index >= 0
      ) {

        AppState.analyses[
          index
        ] =
          analysis;

      }

      else {

        AppState.analyses.unshift(
          analysis
        );

      }


      saveAnalyses();

      refreshDashboard();

    }
  );


  window.addEventListener(
    "seolcheon:report-saved",
    event => {

      const report =
        event.detail;


      if (!report) {

        return;

      }


      const index =
        AppState.reports.findIndex(
          item =>
            item.id ===
            report.id
        );


      if (
        index >= 0
      ) {

        AppState.reports[
          index
        ] =
          report;

      }

      else {

        AppState.reports.unshift(
          report
        );

      }


      saveReports();

      refreshDashboard();

    }
  );

}
/* ============================================================
   SEOLCHEON SPORTS PERFORMANCE LAB
   APP.JS
   PART 2 / 2
============================================================ */


/* ============================================================
   26. ANALYSIS RESET
============================================================ */

function resetAnalysis() {

  const confirmed =
    window.confirm(
      "현재 분석 화면을 초기화할까요?"
    );


  if (!confirmed) {

    return;

  }


  callModule(
    "MotionAnalysis",
    "reset"
  );


  window.dispatchEvent(
    new CustomEvent(
      "seolcheon:analysis-reset"
    )
  );

}


/* ============================================================
   27. ANALYSIS FINISH
============================================================ */

function finishAnalysis() {

  if (
    !AppState.selectedAthlete
  ) {

    alert(
      "먼저 분석할 선수를 선택해주세요."
    );

    navigateTo(
      "athletes"
    );

    return;

  }


  if (
    !AppState.selectedSport &&
    !AppState.selectedAthlete?.sport
  ) {

    alert(
      "분석할 종목을 선택해주세요."
    );

    return;

  }


  /*
    실제 자세분석 모듈에서
    분석 결과를 가져온다.
  */

  let result =
    callModule(
      "MotionAnalysis",
      "getResult"
    );


  /*
    아직 분석 결과가 없을 경우
    기본 결과 구조 생성
  */

  if (!result) {

    result = {

      scores: {

        posture:
          0,

        symmetry:
          0,

        technique:
          0,

        stability:
          0,

        efficiency:
          0,

        elite:
          0

      },

      metrics:
        {},

      angles:
        {},

      techniques:
        [],

      segments:
        [],

      images:
        {},

      feedback:
        [],

      training:
        []

    };

  }


  const athlete =
    AppState.selectedAthlete;


  const sport =
    AppState.selectedSport ||
    athlete.sport;


  let sportName =
    athlete.sportName ||
    sport;


  if (
    window.SportsDatabase &&
    sport
  ) {

    const sportInfo =
      window.SportsDatabase
        .getSport?.(
          sport
        );


    if (sportInfo?.name) {

      sportName =
        sportInfo.name;

    }

  }


  const scores =
    result.scores ||
    {};


  const scoreValues =
    Object.values(
      scores
    )
      .map(Number)
      .filter(
        Number.isFinite
      );


  const overallScore =
    scoreValues.length
      ? Math.round(
          Utils.average(
            scoreValues
          )
        )
      : 0;


  const analysis = {

    id:
      Utils.uid(
        "analysis"
      ),

    athleteId:
      athlete.id,

    athleteName:
      athlete.name,

    school:
      athlete.school ||
      APP_CONFIG.school,

    grade:
      athlete.grade ||
      "",

    sport:
      sport,

    sportName:
      sportName,

    season:
      AppState.selectedSeason ||
      athlete.season ||
      "",

    mode:
      AppState.analysisMode,

    createdAt:
      new Date()
        .toISOString(),

    overallScore:
      overallScore,

    scores:
      scores,

    metrics:
      result.metrics ||
      {},

    angles:
      result.angles ||
      {},

    techniques:
      result.techniques ||
      [],

    currentTechnique:
      result.currentTechnique ||
      "",

    transitionCount:
      result.transitionCount ||
      0,

    segments:
      result.segments ||
      [],

    images:
      result.images ||
      {},

    threeD:
      result.threeD ||
      {},

    elite:
      result.elite ||
      {},

    feedback:
      result.feedback ||
      [],

    training:
      result.training ||
      []

  };


  AppState.analyses.unshift(
    analysis
  );


  saveAnalyses();


  window.dispatchEvent(
    new CustomEvent(
      "seolcheon:analysis-created",
      {
        detail:
          analysis
      }
    )
  );


  /*
    리포트 모듈에
    방금 분석 전달
  */

  callModule(
    "ReportManager",
    "setAnalysis",
    analysis
  );


  refreshDashboard();


  navigateTo(
    "report"
  );

}


/* ============================================================
   28. ANALYSIS ACTION BUTTONS
============================================================ */

function initializeAnalysisActions() {

  document.addEventListener(
    "click",
    event => {


      const resetButton =
        event.target.closest(
          "[data-analysis-reset]"
        );


      if (resetButton) {

        resetAnalysis();

        return;

      }


      const finishButton =
        event.target.closest(
          "[data-analysis-finish]"
        );


      if (finishButton) {

        finishAnalysis();

      }

    }
  );

}


/* ============================================================
   29. REPORT BACK BUTTON
============================================================ */

function initializeReportNavigation() {

  document.addEventListener(
    "click",
    event => {

      const back =
        event.target.closest(
          "[data-report-back]"
        );


      if (!back) {

        return;

      }


      navigateTo(
        "analysis"
      );

    }
  );

}


/* ============================================================
   30. REPORT PRINT / PDF
============================================================ */

function initializeReportPrint() {

  document.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "[data-report-print]"
        );


      if (!button) {

        return;

      }


      window.print();

    }
  );

}


/* ============================================================
   31. SELECT ATHLETE FROM BUTTON
============================================================ */

function initializeAthleteSelectionButtons() {

  document.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "[data-select-athlete]"
        );


      if (!button) {

        return;

      }


      const athleteId =
        button.dataset
          .selectAthlete;


      selectAthlete(
        athleteId
      );

    }
  );

}


/* ============================================================
   32. ATHLETE → ANALYSIS
============================================================ */

function initializeAthleteAnalysisButtons() {

  document.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "[data-athlete-analysis]"
        );


      if (!button) {

        return;

      }


      const athleteId =
        button.dataset
          .athleteAnalysis;


      const athlete =
        AppState.athletes.find(
          item =>
            item.id ===
            athleteId
        );


      if (!athlete) {

        return;

      }


      selectAthlete(
        athlete
      );


      selectSport(
        athlete.sport,
        athlete.season
      );


      navigateTo(
        "analysis"
      );

    }
  );

}


/* ============================================================
   33. SPORT CARD → ANALYSIS
============================================================ */

function initializeSportSelection() {

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


      const sport =
        button.dataset
          .selectSport;


      const season =
        button.dataset
          .season ||
        null;


      selectSport(
        sport,
        season
      );


      navigateTo(
        "analysis"
      );

    }
  );

}


/* ============================================================
   34. ANALYSIS VIDEO CONTROL BRIDGE
============================================================ */

function initializeAnalysisVideoControls() {

  document.addEventListener(
    "click",
    event => {


      /*
        CAMERA START
      */

      if (
        event.target.closest(
          "[data-camera-start]"
        )
      ) {

        callModule(
          "MotionAnalysis",
          "startCamera"
        );

        return;

      }


      /*
        PLAY
      */

      if (
        event.target.closest(
          "[data-analysis-play]"
        )
      ) {

        callModule(
          "MotionAnalysis",
          "play"
        );

        return;

      }


      /*
        PAUSE
      */

      if (
        event.target.closest(
          "[data-analysis-pause]"
        )
      ) {

        callModule(
          "MotionAnalysis",
          "pause"
        );

        return;

      }


      /*
        PREVIOUS FRAME
      */

      if (
        event.target.closest(
          "[data-analysis-frame-prev]"
        )
      ) {

        callModule(
          "MotionAnalysis",
          "previousFrame"
        );

        return;

      }


      /*
        NEXT FRAME
      */

      if (
        event.target.closest(
          "[data-analysis-frame-next]"
        )
      ) {

        callModule(
          "MotionAnalysis",
          "nextFrame"
        );

        return;

      }


      /*
        SNAPSHOT
      */

      if (
        event.target.closest(
          "[data-analysis-snapshot]"
        )
      ) {

        callModule(
          "MotionAnalysis",
          "captureSnapshot"
        );

      }

    }
  );

}


/* ============================================================
   35. VIDEO FILE UPLOAD
============================================================ */

function initializeVideoUpload() {

  const input =
    document.querySelector(
      "[data-video-upload]"
    );


  input?.addEventListener(
    "change",
    event => {

      const file =
        event.target.files?.[0];


      if (!file) {

        return;

      }


      setAnalysisMode(
        "video"
      );


      callModule(
        "MotionAnalysis",
        "loadVideo",
        file
      );

    }
  );

}


/* ============================================================
   36. PLAYBACK SPEED / SLOW MOTION
============================================================ */

function initializePlaybackRate() {

  const selector =
    document.querySelector(
      "[data-playback-rate]"
    );


  selector?.addEventListener(
    "change",
    event => {

      const rate =
        Number(
          event.target.value
        );


      if (
        !Number.isFinite(rate)
      ) {

        return;

      }


      callModule(
        "MotionAnalysis",
        "setPlaybackRate",
        rate
      );

    }
  );

}


/* ============================================================
   37. VIDEO PROGRESS BAR
============================================================ */

function initializeVideoProgress() {

  const progress =
    document.querySelector(
      "[data-video-progress]"
    );


  progress?.addEventListener(
    "input",
    event => {

      const value =
        Number(
          event.target.value
        );


      callModule(
        "MotionAnalysis",
        "seekPercent",
        value
      );

    }
  );

}


/* ============================================================
   38. 3D TOGGLE
============================================================ */

function initializeThreeDToggle() {

  document.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "[data-3d-toggle]"
        );


      if (!button) {

        return;

      }


      callModule(
        "MotionAnalysis",
        "toggle3D"
      );

    }
  );

}


/* ============================================================
   39. CAMERA PERMISSION CHECK
============================================================ */

async function checkCameraSupport() {

  const supported =
    !!(
      navigator.mediaDevices &&
      navigator.mediaDevices
        .getUserMedia
    );


  if (!supported) {

    return {

      supported:
        false,

      permission:
        "unsupported"

    };

  }


  try {

    if (
      navigator.permissions &&
      navigator.permissions.query
    ) {

      try {

        const permission =
          await navigator.permissions.query({
            name:
              "camera"
          });


        return {

          supported:
            true,

          permission:
            permission.state

        };

      }

      catch {

        /*
          Safari에서는 camera permission query가
          지원되지 않을 수 있음.
        */

      }

    }


    return {

      supported:
        true,

      permission:
        "unknown"

    };

  }

  catch {

    return {

      supported:
        true,

      permission:
        "unknown"

    };

  }

}


/* ============================================================
   40. BASIC SYSTEM DIAGNOSTICS
============================================================ */

async function getBasicSystemStatus() {

  const camera =
    await checkCameraSupport();


  const secure =
    window.isSecureContext;


  const storage =
    typeof localStorage !==
    "undefined";


  const canvas =
    !!document.createElement(
      "canvas"
    ).getContext;


  const video =
    !!document.createElement(
      "video"
    ).canPlayType;


  const chart =
    typeof window.Chart !==
    "undefined";


  return {

    secureContext:
      secure,

    cameraSupport:
      camera.supported,

    cameraPermission:
      camera.permission,

    localStorage:
      storage,

    canvas:
      canvas,

    video:
      video,

    chart:
      chart

  };

}


/* ============================================================
   41. STATUS LABEL
============================================================ */

function setSystemStatus(
  text
) {

  document
    .querySelectorAll(
      "[data-system-status]"
    )
    .forEach(
      element => {

        element.textContent =
          text;

      }
    );

}


/* ============================================================
   42. INITIAL SYSTEM STATUS
============================================================ */

async function initializeSystemStatus() {

  setSystemStatus(
    "SYSTEM CHECK"
  );


  try {

    const status =
      await getBasicSystemStatus();


    const critical = [

      status.secureContext,

      status.localStorage,

      status.canvas,

      status.video

    ];


    const passed =
      critical.filter(
        Boolean
      ).length;


    if (
      passed ===
      critical.length
    ) {

      setSystemStatus(
        "SYSTEM ONLINE"
      );

    }

    else {

      setSystemStatus(
        "SYSTEM WARNING"
      );

    }

  }

  catch (error) {

    console.error(
      "[SYSTEM STATUS]",
      error
    );


    setSystemStatus(
      "SYSTEM ERROR"
    );

  }

}


/* ============================================================
   43. RESTORE SELECTED SPORT
============================================================ */

function restoreAthleteSport() {

  const athlete =
    AppState.selectedAthlete;


  if (!athlete) {

    return;

  }


  AppState.selectedSport =
    athlete.sport ||
    null;


  AppState.selectedSeason =
    athlete.season ||
    null;

}


/* ============================================================
   44. STORAGE SYNCHRONIZATION
============================================================ */

function initializeStorageSync() {

  window.addEventListener(
    "storage",
    event => {

      const keys =
        Object.values(
          APP_CONFIG.storage
        );


      if (
        !keys.includes(
          event.key
        )
      ) {

        return;

      }


      loadAppData();

      restoreAthleteSport();

      refreshSelectedAthleteUI();

      refreshDashboard();


      runPageRefresh(
        AppState.currentPage
      );

    }
  );

}


/* ============================================================
   45. KEYBOARD SHORTCUTS
============================================================ */

function initializeKeyboardShortcuts() {

  document.addEventListener(
    "keydown",
    event => {

      /*
        입력 중에는 단축키 사용 안 함
      */

      const tag =
        event.target.tagName
          ?.toLowerCase();


      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select"
      ) {

        return;

      }


      /*
        SPACE
        영상 재생 / 일시정지
      */

      if (
        event.code ===
        "Space" &&
        AppState.currentPage ===
        "analysis"
      ) {

        event.preventDefault();


        callModule(
          "MotionAnalysis",
          "togglePlay"
        );

      }


      /*
        LEFT ARROW
        이전 프레임
      */

      if (
        event.code ===
        "ArrowLeft" &&
        AppState.currentPage ===
        "analysis"
      ) {

        event.preventDefault();


        callModule(
          "MotionAnalysis",
          "previousFrame"
        );

      }


      /*
        RIGHT ARROW
        다음 프레임
      */

      if (
        event.code ===
        "ArrowRight" &&
        AppState.currentPage ===
        "analysis"
      ) {

        event.preventDefault();


        callModule(
          "MotionAnalysis",
          "nextFrame"
        );

      }

    }
  );

}


/* ============================================================
   46. WINDOW RESIZE
============================================================ */

function initializeResizeHandler() {

  let resizeTimer =
    null;


  window.addEventListener(
    "resize",
    () => {

      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(
          () => {

            if (
              window.innerWidth >
              900
            ) {

              closeMobileSidebar();

            }


            callModule(
              "MotionAnalysis",
              "resize"
            );

          },
          120
        );

    }
  );

}


/* ============================================================
   47. PREVENT EMPTY LINK ACTION
============================================================ */

function initializeSafetyEvents() {

  document.addEventListener(
    "click",
    event => {

      const link =
        event.target.closest(
          'a[href="#"]'
        );


      if (link) {

        event.preventDefault();

      }

    }
  );

}


/* ============================================================
   48. GET CURRENT ATHLETE
============================================================ */

function getSelectedAthlete() {

  return (
    AppState.selectedAthlete
  );

}


/* ============================================================
   49. GET ATHLETE BY ID
============================================================ */

function getAthleteById(id) {

  return (
    AppState.athletes.find(
      athlete =>
        athlete.id === id
    ) ||
    null
  );

}


/* ============================================================
   50. GET ANALYSIS BY ID
============================================================ */

function getAnalysisById(id) {

  return (
    AppState.analyses.find(
      analysis =>
        analysis.id === id
    ) ||
    null
  );

}


/* ============================================================
   51. GET ATHLETE ANALYSES
============================================================ */

function getAthleteAnalyses(
  athleteId
) {

  return AppState.analyses
    .filter(
      analysis =>
        analysis.athleteId ===
        athleteId
    )
    .sort(
      (a, b) =>
        new Date(
          b.createdAt ||
          0
        ) -
        new Date(
          a.createdAt ||
          0
        )
    );

}


/* ============================================================
   52. ADD ANALYSIS
============================================================ */

function addAnalysis(
  analysis
) {

  if (!analysis) {

    return false;

  }


  if (!analysis.id) {

    analysis.id =
      Utils.uid(
        "analysis"
      );

  }


  if (!analysis.createdAt) {

    analysis.createdAt =
      new Date()
        .toISOString();

  }


  AppState.analyses.unshift(
    analysis
  );


  saveAnalyses();

  refreshDashboard();


  return analysis;

}


/* ============================================================
   53. DELETE ANALYSIS
============================================================ */

function deleteAnalysis(
  analysisId
) {

  const index =
    AppState.analyses.findIndex(
      analysis =>
        analysis.id ===
        analysisId
    );


  if (
    index < 0
  ) {

    return false;

  }


  AppState.analyses.splice(
    index,
    1
  );


  saveAnalyses();

  refreshDashboard();


  return true;

}


/* ============================================================
   54. ADD REPORT
============================================================ */

function addReport(
  report
) {

  if (!report) {

    return false;

  }


  if (!report.id) {

    report.id =
      Utils.uid(
        "report"
      );

  }


  if (!report.createdAt) {

    report.createdAt =
      new Date()
        .toISOString();

  }


  AppState.reports.unshift(
    report
  );


  saveReports();

  refreshDashboard();


  return report;

}


/* ============================================================
   55. APP PUBLIC API
============================================================ */

window.SeolcheonApp = {

  config:
    APP_CONFIG,

  state:
    AppState,

  utils:
    Utils,

  storage:
    StorageManager,


  navigate:
    navigateTo,


  selectAthlete:
    selectAthlete,


  getSelectedAthlete:
    getSelectedAthlete,


  getAthleteById:
    getAthleteById,


  selectSport:
    selectSport,


  setAnalysisMode:
    setAnalysisMode,


  getAnalysisById:
    getAnalysisById,


  getAthleteAnalyses:
    getAthleteAnalyses,


  addAnalysis:
    addAnalysis,


  deleteAnalysis:
    deleteAnalysis,


  addReport:
    addReport,


  refreshDashboard:
    refreshDashboard,


  refreshSelectedAthleteUI:
    refreshSelectedAthleteUI,


  refreshAnalysisHeader:
    refreshAnalysisHeader,


  getBasicSystemStatus:
    getBasicSystemStatus,


  saveAthletes:
    saveAthletes,


  saveAnalyses:
    saveAnalyses,


  saveReports:
    saveReports

};


/* ============================================================
   56. INITIALIZE APP
============================================================ */

function initializeApp() {

  if (
    AppState.initialized
  ) {

    return;

  }


  AppState.initialized =
    true;


  /*
    LOAD DATA
  */

  loadAppData();


  /*
    RESTORE ATHLETE SPORT
  */

  restoreAthleteSport();


  /*
    CORE EVENTS
  */

  initializeNavigation();

  initializeMobileSidebar();

  initializeAnalysisModes();

  initializeQuickActions();

  initializeRecordOpening();

  initializeGlobalEvents();

  initializeAnalysisActions();

  initializeReportNavigation();

  initializeReportPrint();

  initializeAthleteSelectionButtons();

  initializeAthleteAnalysisButtons();

  initializeSportSelection();

  initializeAnalysisVideoControls();

  initializeVideoUpload();

  initializePlaybackRate();

  initializeVideoProgress();

  initializeThreeDToggle();

  initializeStorageSync();

  initializeKeyboardShortcuts();

  initializeResizeHandler();

  initializeSafetyEvents();


  /*
    UI REFRESH
  */

  refreshSelectedAthleteUI();

  refreshAnalysisHeader();

  refreshDashboard();


  /*
    DEFAULT ANALYSIS MODE
  */

  setAnalysisMode(
    AppState.analysisMode
  );


  /*
    SYSTEM CHECK
  */

  initializeSystemStatus();


  /*
    MODULE INITIALIZATION

    각 파일이 존재할 경우에만 실행된다.
  */

  callModule(
    "AthleteManager",
    "init"
  );


  callModule(
    "SportsManager",
    "init"
  );


  callModule(
    "MotionAnalysis",
    "init"
  );


  callModule(
    "RecordsManager",
    "init"
  );


  callModule(
    "ReportManager",
    "init"
  );


  callModule(
    "SystemCheck",
    "init"
  );


  /*
    INITIAL PAGE
  */

  navigateTo(
    "dashboard",
    {
      scrollTop:
        false
    }
  );


  console.log(
    `%c${APP_CONFIG.name}`,
    `
      color:#65cfff;
      font-size:16px;
      font-weight:bold;
    `
  );


  console.log(
    "VERSION:",
    APP_CONFIG.version
  );


  console.log(
    "SYSTEM READY"
  );

}


/* ============================================================
   57. DOM READY
============================================================ */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeApp
  );

}

else {

  initializeApp();

}


/* ============================================================
   58. APP READY EVENT
============================================================ */

window.addEventListener(
  "load",
  () => {

    window.dispatchEvent(
      new CustomEvent(
        "seolcheon:app-ready",
        {
          detail: {

            version:
              APP_CONFIG.version,

            athleteCount:
              AppState.athletes.length,

            analysisCount:
              AppState.analyses.length,

            reportCount:
              AppState.reports.length

          }
        }
      )
    );

  }
);


/* ============================================================
   END APP.JS
============================================================ */