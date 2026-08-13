/* ============================================================
   SEOLCHEON SPORTS PERFORMANCE LAB
   REPORT.JS
   6 / 6

   담당 기능
   - 분석 결과 리포트
   - 선수 정보
   - 종합 점수
   - 육각형 레이더 그래프
   - 분석 이미지
   - 관절각
   - 종목별 데이터
   - 구간 분석
   - 기술 분석
   - 3D 분석
   - 엘리트 비교
   - 자동 피드백
   - 추천 훈련
   - 분석 기록
   - 기록 불러오기
   - 기록 삭제
   - PDF / 인쇄
   - 대시보드 기록 연동
============================================================ */

"use strict";


/* ============================================================
   01. REPORT STATE
============================================================ */

const ReportState = {

  currentReport: null,

  radarChart: null

};


/* ============================================================
   02. HELPERS
============================================================ */

function reportQuery(selector) {

  return document.querySelector(selector);

}


function reportQueryAll(selector) {

  return [
    ...document.querySelectorAll(selector)
  ];

}


function safeValue(
  value,
  fallback = "-"
) {

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {

    return fallback;

  }

  return value;

}


function escapeReportHTML(value) {

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


/* ============================================================
   03. DATE
============================================================ */

function formatReportDate(dateValue) {

  if (!dateValue) {

    return "-";

  }


  const date =
    new Date(dateValue);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return dateValue;

  }


  return date.toLocaleString(
    "ko-KR",
    {

      year: "numeric",

      month: "2-digit",

      day: "2-digit",

      hour: "2-digit",

      minute: "2-digit"

    }
  );

}


/* ============================================================
   04. MODE NAME
============================================================ */

function getModeName(mode) {

  const names = {

    realtime:
      "실시간 카메라 분석",

    video:
      "영상 분석"

  };


  return (
    names[mode] ||
    mode ||
    "-"
  );

}


/* ============================================================
   05. ANGLE NAME
============================================================ */

function getAngleName(key) {

  const names = {

    leftKnee:
      "왼쪽 무릎",

    rightKnee:
      "오른쪽 무릎",

    leftHip:
      "왼쪽 고관절",

    rightHip:
      "오른쪽 고관절",

    leftElbow:
      "왼쪽 팔꿈치",

    rightElbow:
      "오른쪽 팔꿈치",

    trunk:
      "상체",

    ankle:
      "발목",

    shoulder:
      "어깨"

  };


  return (
    names[key] ||
    key
  );

}


/* ============================================================
   06. METRIC NAME
============================================================ */

function getMetricName(key) {

  const names = {

    speed:
      "속도",

    cadence:
      "케이던스",

    strideLength:
      "보폭",

    groundContactTime:
      "접지시간",

    glide:
      "글라이드",

    poleTiming:
      "폴링 타이밍",

    slope:
      "경사도",

    elevationGain:
      "상승고도",

    distance:
      "이동 거리",

    segmentTime:
      "구간 시간",

    horizontalDeviation:
      "수평 편차",

    peakVelocity:
      "최대 속도",

    firstPull:
      "1차 풀",

    secondPull:
      "2차 풀",

    techniqueTransition:
      "기술 전환",

    time:
      "기록"

  };


  return (
    names[key] ||
    key
  );

}


/* ============================================================
   07. METRIC UNIT
============================================================ */

function getMetricUnit(key) {

  const units = {

    speed:
      "km/h",

    cadence:
      "spm",

    strideLength:
      "m",

    groundContactTime:
      "ms",

    glide:
      "m",

    poleTiming:
      "ms",

    slope:
      "%",

    elevationGain:
      "m",

    distance:
      "m",

    segmentTime:
      "s",

    horizontalDeviation:
      "cm",

    peakVelocity:
      "m/s",

    firstPull:
      "s",

    secondPull:
      "s"

  };


  return (
    units[key] ||
    ""
  );

}


/* ============================================================
   08. SCORE LEVEL
============================================================ */

function getScoreLevel(score) {

  const value =
    Number(score) || 0;


  if (
    value >= 90
  ) {

    return "EXCELLENT";

  }


  if (
    value >= 80
  ) {

    return "VERY GOOD";

  }


  if (
    value >= 70
  ) {

    return "GOOD";

  }


  if (
    value >= 60
  ) {

    return "DEVELOPING";

  }


  return "NEEDS IMPROVEMENT";

}


/* ============================================================
   09. SET TEXT
============================================================ */

function setReportText(
  selector,
  value
) {

  const element =
    reportQuery(selector);


  if (element) {

    element.textContent =
      safeValue(value);

  }

}


/* ============================================================
   10. LOAD REPORT
============================================================ */

function loadReport(report) {

  if (!report) {

    return;

  }


  ReportState.currentReport =
    report;


  if (
    window.SeolcheonApp?.state
  ) {

    window.SeolcheonApp
      .state
      .currentReport =
      report;

  }


  renderReport(report);

}


/* ============================================================
   11. MAIN REPORT RENDER
============================================================ */

function renderReport(report) {

  renderReportHeader(
    report
  );


  renderReportScores(
    report
  );


  renderRadarChart(
    report
  );


  renderReportImages(
    report
  );


  renderReportAngles(
    report
  );


  renderSportData(
    report
  );


  renderReportSegments(
    report
  );


  renderTechniqueAnalysis(
    report
  );


  renderThreeDAnalysis(
    report
  );


  renderEliteReport(
    report
  );


  renderFeedback(
    report
  );


  renderTraining(
    report
  );

}


/* ============================================================
   12. HEADER
============================================================ */

function renderReportHeader(
  report
) {

  setReportText(
    "[data-report-title]",
    `${safeValue(
      report.sportName,
      "SPORT"
    )} PERFORMANCE REPORT`
  );


  setReportText(
    "[data-report-overall]",
    safeValue(
      report.overall,
      "--"
    )
  );


  setReportText(
    "[data-report-athlete]",
    report.athleteName
  );


  setReportText(
    "[data-report-school]",
    report.school ||
    "설천고"
  );


  setReportText(
    "[data-report-grade]",
    report.grade
  );


  setReportText(
    "[data-report-sport]",
    report.sportName
  );


  setReportText(
    "[data-report-mode]",
    getModeName(
      report.mode
    )
  );


  setReportText(
    "[data-report-date]",
    formatReportDate(
      report.createdAt
    )
  );

}


/* ============================================================
   13. SCORE GRID
============================================================ */

function renderReportScores(
  report
) {

  const scores =
    report.scores ||
    {};


  reportQueryAll(
    "[data-report-score]"
  )
    .forEach(
      element => {

        const key =
          element.dataset
            .reportScore;


        const score =
          scores[key];


        element.textContent =
          score ??
          "--";

      }
    );

}


/* ============================================================
   14. RADAR CHART
============================================================ */

function renderRadarChart(
  report
) {

  const canvas =
    reportQuery(
      "[data-report-radar]"
    );


  if (!canvas) {

    return;

  }


  if (
    typeof Chart ===
    "undefined"
  ) {

    console.warn(
      "[REPORT] Chart.js not loaded"
    );

    return;

  }


  const scores =
    report.scores ||
    {};


  const values = [

    scores.posture || 0,

    scores.symmetry || 0,

    scores.technique || 0,

    scores.stability || 0,

    scores.efficiency || 0,

    scores.elite || 0

  ];


  if (
    ReportState.radarChart
  ) {

    ReportState
      .radarChart
      .destroy();

  }


  ReportState.radarChart =
    new Chart(
      canvas,
      {

        type:
          "radar",

        data: {

          labels: [

            "자세 안정성",

            "좌우 대칭",

            "기술 수행",

            "동작 안정성",

            "효율성",

            "엘리트 근접도"

          ],

          datasets: [

            {

              label:
                "PERFORMANCE",

              data:
                values,

              borderWidth:
                2,

              pointRadius:
                4,

              pointHoverRadius:
                6,

              backgroundColor:
                "rgba(0, 210, 255, 0.16)",

              borderColor:
                "rgba(0, 220, 255, 0.95)",

              pointBackgroundColor:
                "#ffffff"

            }

          ]

        },

        options: {

          responsive:
            true,

          maintainAspectRatio:
            false,

          animation: {

            duration:
              500

          },

          plugins: {

            legend: {

              display:
                false

            }

          },

          scales: {

            r: {

              min:
                0,

              max:
                100,

              beginAtZero:
                true,

              ticks: {

                stepSize:
                  20,

                backdropColor:
                  "transparent",

                color:
                  "#8093a8"

              },

              grid: {

                color:
                  "rgba(130,160,190,.18)"

              },

              angleLines: {

                color:
                  "rgba(130,160,190,.18)"

              },

              pointLabels: {

                color:
                  "#dbe7f3",

                font: {

                  size:
                    12,

                  weight:
                    "600"

                }

              }

            }

          }

        }

      }
    );

}


/* ============================================================
   15. REPORT IMAGES
============================================================ */

function renderReportImages(
  report
) {

  const images =
    report.snapshots ||
    {};


  reportQueryAll(
    "[data-report-image]"
  )
    .forEach(
      image => {

        const key =
          image.dataset
            .reportImage;


        const source =
          images[key];


        const frame =
          image.closest(
            ".report-image-frame"
          );


        const empty =
          frame?.querySelector(
            "[data-image-empty]"
          );


        if (source) {

          image.src =
            source;

          image.hidden =
            false;


          if (empty) {

            empty.hidden =
              true;

          }

        }

        else {

          image.removeAttribute(
            "src"
          );

          image.hidden =
            true;


          if (empty) {

            empty.hidden =
              false;

          }

        }

      }
    );

}


/* ============================================================
   16. ANGLES
============================================================ */

function renderReportAngles(
  report
) {

  const container =
    reportQuery(
      "[data-report-angles]"
    );


  if (!container) {

    return;

  }


  const angles =
    report.angles ||
    {};


  const entries =
    Object.entries(
      angles
    );


  if (
    entries.length === 0
  ) {

    container.innerHTML = `

      <div class="empty-state">
        관절각 데이터가 없습니다.
      </div>

    `;

    return;

  }


  container.innerHTML =
    entries
      .map(
        ([key, value]) => `

          <div class="report-angle-card">

            <span>
              ${escapeReportHTML(
                getAngleName(key)
              )}
            </span>

            <strong>
              ${escapeReportHTML(
                value
              )}°
            </strong>

          </div>

        `
      )
      .join("");

}


/* ============================================================
   17. SPORT DATA
============================================================ */

function renderSportData(
  report
) {

  const container =
    reportQuery(
      "[data-report-sport-data]"
    );


  if (!container) {

    return;

  }


  const metrics =
    report.metrics ||
    {};


  const entries =
    Object.entries(
      metrics
    );


  if (
    entries.length === 0
  ) {

    container.innerHTML = `

      <div class="empty-state">
        종목별 분석 데이터가 없습니다.
      </div>

    `;

    return;

  }


  container.innerHTML =
    entries
      .map(
        ([key, value]) => {

          const unit =
            getMetricUnit(
              key
            );


          return `

            <div class="report-data-card">

              <span>
                ${escapeReportHTML(
                  getMetricName(key)
                )}
              </span>

              <strong>
                ${escapeReportHTML(
                  value
                )}

                ${
                  unit
                    ? `<small>${unit}</small>`
                    : ""
                }

              </strong>

            </div>

          `;

        }
      )
      .join("");

}


/* ============================================================
   18. SEGMENTS
============================================================ */

function renderReportSegments(
  report
) {

  const container =
    reportQuery(
      "[data-report-segments]"
    );


  if (!container) {

    return;

  }


  const segments =
    report.segments ||
    [];


  if (
    segments.length === 0
  ) {

    container.innerHTML = `

      <div class="empty-state">
        구간 분석 데이터가 없습니다.
      </div>

    `;

    return;

  }


  container.innerHTML = `

    <div class="report-segment-table">

      <div class="report-segment-head">

        <span>
          구간
        </span>

        <span>
          거리
        </span>

        <span>
          시간
        </span>

        <span>
          기술
        </span>

        <span>
          경사
        </span>

      </div>


      ${

        segments
          .map(
            segment => `

              <div class="report-segment-row">

                <span>
                  ${escapeReportHTML(
                    segment.segment
                  )}
                </span>

                <span>
                  ${escapeReportHTML(
                    segment.distance
                  )}m
                </span>

                <span>
                  ${escapeReportHTML(
                    segment.time
                  )}s
                </span>

                <span>
                  ${escapeReportHTML(
                    segment.technique
                  )}
                </span>

                <span>
                  ${escapeReportHTML(
                    segment.slope
                  )}%
                </span>

              </div>

            `
          )
          .join("")

      }

    </div>

  `;

}


/* ============================================================
   19. TECHNIQUE
============================================================ */

function renderTechniqueAnalysis(
  report
) {

  setReportText(
    "[data-report-current-technique]",
    report.technique ||
    "-"
  );


  setReportText(
    "[data-report-transition-count]",
    report.transitionCount ??
    0
  );


  const container =
    reportQuery(
      "[data-report-techniques]"
    );


  if (!container) {

    return;

  }


  const sport =
    window.SportsDatabase
      ?.getSport?.(
        report.sport
      );


  const techniques =
    sport?.techniques ||
    [];


  if (
    techniques.length === 0
  ) {

    container.innerHTML =
      "";

    return;

  }


  container.innerHTML =
    techniques
      .map(
        technique => `

          <span
            class="
              report-technique-chip
              ${
                technique ===
                report.technique
                  ? "active"
                  : ""
              }
            "
          >
            ${escapeReportHTML(
              technique
            )}
          </span>

        `
      )
      .join("");

}


/* ============================================================
   20. 3D ANALYSIS
============================================================ */

function renderThreeDAnalysis(
  report
) {

  const container =
    reportQuery(
      "[data-report-3d]"
    );


  if (!container) {

    return;

  }


  const scores =
    report.scores ||
    {};


  const symmetry =
    scores.symmetry ||
    0;


  const stability =
    scores.stability ||
    0;


  const posture =
    scores.posture ||
    0;


  container.innerHTML = `

    <div class="report-data-card">

      <span>
        3D 자세 정렬
      </span>

      <strong>
        ${posture}
      </strong>

    </div>


    <div class="report-data-card">

      <span>
        좌우 균형
      </span>

      <strong>
        ${symmetry}
      </strong>

    </div>


    <div class="report-data-card">

      <span>
        중심 안정성
      </span>

      <strong>
        ${stability}
      </strong>

    </div>


    <div class="report-data-card">

      <span>
        분석 상태
      </span>

      <strong>
        COMPLETE
      </strong>

    </div>

  `;

}


/* ============================================================
   21. ELITE COMPARISON
============================================================ */

function renderEliteReport(
  report
) {

  const container =
    reportQuery(
      "[data-report-elite]"
    );


  if (!container) {

    return;

  }


  const score =
    Number(
      report.scores?.elite ||
      0
    );


  let description =
    "기술 동작의 추가 개선이 필요합니다.";


  if (
    score >= 90
  ) {

    description =
      "엘리트 선수 기준에 매우 근접한 동작 수준입니다.";

  }

  else if (
    score >= 80
  ) {

    description =
      "상위 경기 선수 수준에 근접한 퍼포먼스입니다.";

  }

  else if (
    score >= 70
  ) {

    description =
      "경기 선수 수준이며 세부 기술 개선 시 상승 가능성이 높습니다.";

  }


  container.innerHTML = `

    <div class="elite-report-card">

      <div class="elite-report-score">

        <small>
          ELITE SCORE
        </small>

        <strong>
          ${score}
        </strong>

        <span>
          ${getScoreLevel(score)}
        </span>

      </div>


      <div class="elite-report-description">

        <h3>
          엘리트 기준 비교
        </h3>

        <p>
          ${escapeReportHTML(
            description
          )}
        </p>

      </div>

    </div>

  `;

}


/* ============================================================
   22. FEEDBACK GENERATOR
============================================================ */

function generateFeedback(
  report
) {

  const feedback =
    [];


  const scores =
    report.scores ||
    {};


  if (
    scores.posture >= 90
  ) {

    feedback.push(
      "전체 자세 정렬과 중심 유지가 안정적입니다."
    );

  }

  else {

    feedback.push(
      "동작 중 상체와 골반의 정렬을 조금 더 안정적으로 유지할 필요가 있습니다."
    );

  }


  if (
    scores.symmetry < 85
  ) {

    feedback.push(
      "좌우 움직임 차이가 관찰되므로 좌우 대칭성과 체중 이동을 확인하는 것이 좋습니다."
    );

  }

  else {

    feedback.push(
      "좌우 대칭성이 비교적 안정적으로 유지되고 있습니다."
    );

  }


  if (
    scores.technique >= 90
  ) {

    feedback.push(
      "종목 기술 수행의 연결이 우수합니다."
    );

  }

  else {

    feedback.push(
      "기술 전환 구간에서 동작 연결을 더 부드럽게 만들면 효율 향상에 도움이 됩니다."
    );

  }


  if (
    scores.efficiency < 85
  ) {

    feedback.push(
      "불필요한 상하 움직임을 줄이고 힘 전달 방향을 정리하면 동작 효율을 높일 수 있습니다."
    );

  }


  if (
    scores.elite >= 90
  ) {

    feedback.push(
      "현재 분석에서는 엘리트 기준에 매우 근접한 결과를 보였습니다."
    );

  }

  else {

    feedback.push(
      "세부 기술 정확도와 반복 안정성을 높이면 엘리트 기준과의 차이를 줄일 수 있습니다."
    );

  }


  return feedback;

}


/* ============================================================
   23. FEEDBACK RENDER
============================================================ */

function renderFeedback(
  report
) {

  const container =
    reportQuery(
      "[data-report-feedback]"
    );


  if (!container) {

    return;

  }


  const feedback =
    generateFeedback(
      report
    );


  container.innerHTML =
    feedback
      .map(
        (
          text,
          index
        ) => `

          <div class="feedback-item">

            <span>
              ${String(
                index + 1
              ).padStart(
                2,
                "0"
              )}
            </span>

            <p>
              ${escapeReportHTML(
                text
              )}
            </p>

          </div>

        `
      )
      .join("");

}


/* ============================================================
   24. TRAINING GENERATOR
============================================================ */

function generateTraining(
  report
) {

  const training =
    [];


  const scores =
    report.scores ||
    {};


  if (
    scores.posture < 90
  ) {

    training.push({

      title:
        "자세 안정성",

      content:
        "기본 자세를 일정하게 유지하는 저강도 기술 반복과 코어 안정화 훈련"

    });

  }


  if (
    scores.symmetry < 90
  ) {

    training.push({

      title:
        "좌우 대칭",

      content:
        "좌우 단측 동작을 번갈아 수행하며 체중 이동과 균형을 확인하는 훈련"

    });

  }


  if (
    scores.technique < 90
  ) {

    training.push({

      title:
        "기술 수행",

      content:
        "동작을 짧은 구간으로 나누어 정확도를 먼저 확보한 뒤 전체 동작으로 연결"

    });

  }


  if (
    scores.stability < 90
  ) {

    training.push({

      title:
        "동작 안정성",

      content:
        "한발 균형, 코어 안정화, 저강도 동적 밸런스 훈련"

    });

  }


  if (
    scores.efficiency < 90
  ) {

    training.push({

      title:
        "움직임 효율",

      content:
        "불필요한 동작을 줄이고 힘 전달 방향을 확인하는 기술 반복"

    });

  }


  if (
    training.length === 0
  ) {

    training.push({

      title:
        "퍼포먼스 유지",

      content:
        "현재 기술 수준을 유지하면서 경기 상황과 비슷한 조건에서 반복 정확도를 높이는 훈련"

    });

  }


  return training;

}


/* ============================================================
   25. TRAINING RENDER
============================================================ */

function renderTraining(
  report
) {

  const container =
    reportQuery(
      "[data-report-training]"
    );


  if (!container) {

    return;

  }


  const training =
    generateTraining(
      report
    );


  container.innerHTML =
    training
      .map(
        (
          item,
          index
        ) => `

          <div class="training-item">

            <span class="training-number">
              ${String(
                index + 1
              ).padStart(
                2,
                "0"
              )}
            </span>

            <div>

              <strong>
                ${escapeReportHTML(
                  item.title
                )}
              </strong>

              <p>
                ${escapeReportHTML(
                  item.content
                )}
              </p>

            </div>

          </div>

        `
      )
      .join("");

}


/* ============================================================
   26. GET ANALYSIS LIST
============================================================ */

function getAnalysisRecords() {

  const state =
    window.SeolcheonApp
      ?.state;


  if (
    state &&
    Array.isArray(
      state.analyses
    )
  ) {

    return state.analyses;

  }


  try {

    const saved =
      JSON.parse(
        localStorage.getItem(
          "seolcheon_analyses"
        ) ||
        "[]"
      );


    return Array.isArray(
      saved
    )
      ? saved
      : [];

  }

  catch {

    return [];

  }

}


/* ============================================================
   27. RECORD LIST
============================================================ */

function renderAnalysisRecords() {

  const container =
    reportQuery(
      "[data-analysis-record-list]"
    );


  if (!container) {

    return;

  }


  const records =
    getAnalysisRecords();


  if (
    records.length === 0
  ) {

    container.innerHTML = `

      <div class="empty-state">

        저장된 분석 기록이 없습니다.

      </div>

    `;

    return;

  }


  container.innerHTML =
    records
      .map(
        record => `

          <article
            class="analysis-record-card"
            data-record-id="${escapeReportHTML(
              record.id
            )}"
          >

            <div class="record-score">

              <small>
                SCORE
              </small>

              <strong>
                ${safeValue(
                  record.overall,
                  "--"
                )}
              </strong>

            </div>


            <div class="record-main">

              <small>
                ${escapeReportHTML(
                  formatReportDate(
                    record.createdAt
                  )
                )}
              </small>

              <h3>
                ${escapeReportHTML(
                  record.athleteName ||
                  "선수 미선택"
                )}
              </h3>

              <p>
                ${escapeReportHTML(
                  record.sportName ||
                  "-"
                )}
                ·
                ${escapeReportHTML(
                  getModeName(
                    record.mode
                  )
                )}
              </p>

            </div>


            <div class="record-actions">

              <button
                type="button"
                class="primary-button"
                data-record-open="${escapeReportHTML(
                  record.id
                )}"
              >
                리포트
              </button>


              <button
                type="button"
                class="ghost-button"
                data-record-delete="${escapeReportHTML(
                  record.id
                )}"
              >
                삭제
              </button>

            </div>

          </article>

        `
      )
      .join("");

}


/* ============================================================
   28. OPEN RECORD
============================================================ */

function openAnalysisRecord(
  recordId
) {

  const records =
    getAnalysisRecords();


  const record =
    records.find(
      item =>
        item.id ===
        recordId
    );


  if (!record) {

    alert(
      "분석 기록을 찾을 수 없습니다."
    );

    return;

  }


  loadReport(
    record
  );


  window.SeolcheonApp
    ?.navigate?.(
      "report"
    );

}


/* ============================================================
   29. DELETE RECORD
============================================================ */

function deleteAnalysisRecord(
  recordId
) {

  const confirmed =
    confirm(
      "이 분석 기록을 삭제할까요?"
    );


  if (!confirmed) {

    return;

  }


  const state =
    window.SeolcheonApp
      ?.state;


  if (
    state &&
    Array.isArray(
      state.analyses
    )
  ) {

    state.analyses =
      state.analyses.filter(
        item =>
          item.id !==
          recordId
      );


    window.SeolcheonApp
      ?.saveAnalyses?.();

  }

  else {

    const records =
      getAnalysisRecords()
        .filter(
          item =>
            item.id !==
            recordId
        );


    localStorage.setItem(
      "seolcheon_analyses",
      JSON.stringify(
        records
      )
    );

  }


  renderAnalysisRecords();


  window.SeolcheonApp
    ?.refreshDashboard?.();

}


/* ============================================================
   30. PRINT REPORT
============================================================ */

function printReport() {

  if (
    !ReportState
      .currentReport
  ) {

    alert(
      "먼저 분석 리포트를 생성해주세요."
    );

    return;

  }


  window.print();

}


/* ============================================================
   31. REPORT BACK
============================================================ */

function reportBack() {

  window.SeolcheonApp
    ?.navigate?.(
      "analysis"
    );

}


/* ============================================================
   32. DASHBOARD RECENT RECORDS
============================================================ */

function renderDashboardRecent() {

  const container =
    reportQuery(
      "[data-dashboard-recent]"
    );


  if (!container) {

    return;

  }


  const records =
    getAnalysisRecords()
      .slice(
        0,
        5
      );


  if (
    records.length === 0
  ) {

    container.innerHTML = `

      <div class="empty-state">
        분석 기록이 없습니다.
      </div>

    `;

    return;

  }


  container.innerHTML =
    records
      .map(
        record => `

          <button
            type="button"
            class="dashboard-recent-item"
            data-dashboard-record="${escapeReportHTML(
              record.id
            )}"
          >

            <span>

              <strong>
                ${escapeReportHTML(
                  record.athleteName ||
                  "선수 미선택"
                )}
              </strong>

              <small>
                ${escapeReportHTML(
                  record.sportName ||
                  "-"
                )}
              </small>

            </span>


            <strong>
              ${safeValue(
                record.overall,
                "--"
              )}
            </strong>

          </button>

        `
      )
      .join("");

}


/* ============================================================
   33. DASHBOARD STATISTICS
============================================================ */

function updateDashboardStatistics() {

  const records =
    getAnalysisRecords();


  const athleteCount =
    window.SeolcheonApp
      ?.state
      ?.athletes
      ?.length ||
    0;


  const analysisCount =
    records.length;


  const average =
    analysisCount
      ? Math.round(
          records.reduce(
            (
              sum,
              item
            ) =>
              sum +
              (
                Number(
                  item.overall
                ) ||
                0
              ),
            0
          ) /
          analysisCount
        )
      : "--";


  const reportCount =
    analysisCount;


  setReportText(
    "[data-athlete-count]",
    athleteCount
  );


  setReportText(
    "[data-analysis-count]",
    analysisCount
  );


  setReportText(
    "[data-average-score]",
    average
  );


  setReportText(
    "[data-report-count]",
    reportCount
  );


  const latest =
    records[0];


  if (latest) {

    const scores =
      latest.scores ||
      {};


    [

      "posture",

      "symmetry",

      "technique",

      "elite"

    ].forEach(
      key => {

        const value =
          Number(
            scores[key]
          ) ||
          0;


        const scoreElement =
          reportQuery(
            `[data-dashboard-score="${key}"]`
          );


        const barElement =
          reportQuery(
            `[data-dashboard-bar="${key}"]`
          );


        if (scoreElement) {

          scoreElement.textContent =
            value;

        }


        if (barElement) {

          barElement.style.width =
            `${value}%`;

        }

      }
    );

  }


  renderDashboardRecent();

}


/* ============================================================
   34. RECORD CLICK EVENTS
============================================================ */

function initializeRecordEvents() {

  document.addEventListener(
    "click",
    event => {


      const openButton =
        event.target.closest(
          "[data-record-open]"
        );


      if (openButton) {

        openAnalysisRecord(
          openButton.dataset
            .recordOpen
        );

        return;

      }


      const deleteButton =
        event.target.closest(
          "[data-record-delete]"
        );


      if (deleteButton) {

        deleteAnalysisRecord(
          deleteButton.dataset
            .recordDelete
        );

        return;

      }


      const dashboardRecord =
        event.target.closest(
          "[data-dashboard-record]"
        );


      if (
        dashboardRecord
      ) {

        openAnalysisRecord(
          dashboardRecord.dataset
            .dashboardRecord
        );

      }

    }
  );

}


/* ============================================================
   35. REPORT EVENTS
============================================================ */

function initializeReportEvents() {

  reportQuery(
    "[data-report-print]"
  )
    ?.addEventListener(
      "click",
      printReport
    );


  reportQuery(
    "[data-report-back]"
  )
    ?.addEventListener(
      "click",
      reportBack
    );


  initializeRecordEvents();

}


/* ============================================================
   36. REFRESH
============================================================ */

function refreshReportSystem() {

  renderAnalysisRecords();

  updateDashboardStatistics();

}


/* ============================================================
   37. PAGE OBSERVER
============================================================ */

function initializePageObserver() {

  document.addEventListener(
    "click",
    event => {

      const navigation =
        event.target.closest(
          "[data-nav]"
        );


      if (!navigation) {

        return;

      }


      const page =
        navigation.dataset.nav;


      if (
        page === "records"
      ) {

        setTimeout(
          renderAnalysisRecords,
          0
        );

      }


      if (
        page === "dashboard"
      ) {

        setTimeout(
          updateDashboardStatistics,
          0
        );

      }


      if (
        page === "report"
      ) {

        const current =
          window.SeolcheonApp
            ?.state
            ?.currentReport;


        if (current) {

          setTimeout(
            () =>
              loadReport(
                current
              ),
            0
          );

        }

      }

    }
  );

}


/* ============================================================
   38. PUBLIC API
============================================================ */

window.ReportManager = {

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


    initializeReportEvents();

    initializePageObserver();

    refreshReportSystem();


    const current =
      window.SeolcheonApp
        ?.state
        ?.currentReport;


    if (current) {

      loadReport(
        current
      );

    }


    console.log(
      "[REPORT] READY"
    );

  },


  loadReport,


  render:
    renderReport,


  refresh:
    refreshReportSystem,


  renderRecords:
    renderAnalysisRecords,


  refreshDashboard:
    updateDashboardStatistics,


  print:
    printReport,


  getCurrentReport() {

    return ReportState
      .currentReport;

  }

};


/* ============================================================
   39. APP BRIDGE
============================================================ */

function connectReportToApp() {

  if (
    !window.SeolcheonApp
  ) {

    return;

  }


  const oldRefresh =
    window.SeolcheonApp
      .refreshDashboard;


  window.SeolcheonApp
    .refreshDashboard =
    function() {

      if (
        typeof oldRefresh ===
        "function"
      ) {

        try {

          oldRefresh();

        }

        catch (error) {

          console.warn(
            error
          );

        }

      }


      updateDashboardStatistics();

      renderAnalysisRecords();

    };

}


/* ============================================================
   40. STORAGE EVENT
============================================================ */

window.addEventListener(
  "storage",
  event => {

    if (
      event.key ===
      "seolcheon_analyses"
    ) {

      refreshReportSystem();

    }

  }
);


/* ============================================================
   41. BEFORE PRINT
============================================================ */

window.addEventListener(
  "beforeprint",
  () => {

    const report =
      ReportState
        .currentReport;


    if (report) {

      renderReport(
        report
      );

    }

  }
);


/* ============================================================
   42. INITIALIZE
============================================================ */

function bootReportModule() {

  connectReportToApp();


  window.ReportManager
    ?.init?.();

}


if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    bootReportModule
  );

}

else {

  bootReportModule();

}


/* ============================================================
   END REPORT.JS
============================================================ */