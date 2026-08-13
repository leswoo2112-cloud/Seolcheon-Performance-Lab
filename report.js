/* =========================================================
   SEOLCHEON SPORTS PERFORMANCE LAB
   REPORT.JS
   FILE 6 / 6

   PERFORMANCE REPORT ENGINE
   ---------------------------------------------------------
   - Athlete Information
   - Overall Score
   - Radar / Hexagon Chart
   - Analysis Images
   - Joint Angles
   - Sport Specific Metrics
   - Technique Analysis
   - Segment Analysis
   - 3D Analysis
   - Elite Comparison
   - Feedback
   - Training Recommendations
   - Analysis Record Loading
   - Print / PDF
========================================================= */

"use strict";


/* =========================================================
   01. REPORT STATE
========================================================= */

const ReportState = {

  currentRecord:
    null,

  radarChart:
    null,

  rendered:
    false

};


window.SeolcheonReportState =
  ReportState;



/* =========================================================
   02. BASIC HELPERS
========================================================= */

function reportQuery(
  selector
) {

  return document.querySelector(
    selector
  );

}



function reportQueryAll(
  selector
) {

  return [
    ...document.querySelectorAll(
      selector
    )
  ];

}



function safeText(
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


  return String(
    value
  );

}



function safeNumber(
  value,
  fallback = 0
) {

  const number =
    Number(
      value
    );


  return Number.isFinite(
    number
  )
    ? number
    : fallback;

}



function escapeReportHTML(
  value
) {

  return safeText(
    value,
    ""
  )
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



/* =========================================================
   03. DATE FORMAT
========================================================= */

function formatReportDate(
  value
) {

  if (!value) {

    return new Date()
      .toLocaleString(
        "ko-KR"
      );

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

    return safeText(
      value
    );

  }


  return date.toLocaleString(
    "ko-KR"
  );

}



/* =========================================================
   04. LABEL DATABASE
========================================================= */

const REPORT_METRIC_LABELS = {

  shoulderWidth:
    "어깨 폭",

  hipWidth:
    "골반 폭",

  symmetry:
    "좌우 대칭",

  kneeAverage:
    "평균 무릎각",

  hipAverage:
    "평균 고관절각",

  cadence:
    "케이던스",

  movementSpeed:
    "동작 속도",

  bodyStability:
    "몸통 안정성",

  rangeOfMotion:
    "가동범위",

  poleTiming:
    "폴링 타이밍",

  glide:
    "글라이드",

  techniqueTransition:
    "기술 전환",

  slope:
    "경사",

  elevationGain:
    "상승 고도",

  distance:
    "이동 거리",

  segmentTime:
    "구간 시간",

  time:
    "기록",

  strideLength:
    "보폭",

  groundContactTime:
    "접지 시간",

  horizontalDeviation:
    "수평 편차",

  peakVelocity:
    "최대 속도",

  firstPull:
    "1차 풀",

  secondPull:
    "2차 풀",

  posturalSway:
    "자세 흔들림",

  shoulderStability:
    "어깨 안정성",

  balance:
    "균형"

};



const REPORT_ANGLE_LABELS = {

  leftElbow:
    "왼쪽 팔꿈치",

  rightElbow:
    "오른쪽 팔꿈치",

  leftHip:
    "왼쪽 고관절",

  rightHip:
    "오른쪽 고관절",

  leftKnee:
    "왼쪽 무릎",

  rightKnee:
    "오른쪽 무릎",

  leftAnkle:
    "왼쪽 발목",

  rightAnkle:
    "오른쪽 발목"

};



const REPORT_SCORE_LABELS = {

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



/* =========================================================
   05. NORMALIZE RECORD
========================================================= */

function normalizeReportRecord(
  input
) {

  const analysis =
    window.SeolcheonAnalysisState ||
    {};


  const state =
    window.SeolcheonState ||
    {};


  const selectedAthlete =
    state.selectedAthlete ||
    state.currentAthlete ||
    null;


  const record =
    input ||
    ReportState.currentRecord ||
    {};


  const athlete =
    record.athlete ||
    selectedAthlete ||
    {};


  const selectedSport =
    analysis.selectedSport ||
    {};


  const trainingFromEngine =
    window.SeolcheonTraining
      ?.getForReport?.() ||
    analysis.training ||
    [];


  return {

    id:
      record.id ||
      `report_${Date.now()}`,

    createdAt:
      record.createdAt ||
      record.date ||
      new Date()
        .toISOString(),

    athlete: {

      id:
        athlete.id ||
        record.athleteId ||
        null,

      name:
        athlete.name ||
        record.athleteName ||
        state.selectedAthleteName ||
        "선택 없음",

      school:
        athlete.school ||
        record.school ||
        "설천고",

      grade:
        athlete.grade ||
        record.grade ||
        "-",

      sport:
        athlete.sportName ||
        athlete.sport ||
        record.sportName ||
        selectedSport.name ||
        state.selectedSportName ||
        "-",

      event:
        athlete.event ||
        record.event ||
        "-",

      team:
        athlete.team ||
        record.team ||
        "설천고"

    },

    sportId:
      record.sportId ||
      selectedSport.id ||
      state.selectedSportId ||
      null,

    sportName:
      record.sportName ||
      selectedSport.name ||
      athlete.sportName ||
      athlete.sport ||
      state.selectedSportName ||
      "-",

    mode:
      record.mode ||
      analysis.mode ||
      "-",

    overallScore:
      safeNumber(
        record.overallScore ??
        analysis.overallScore,
        0
      ),

    scores: {

      posture:
        safeNumber(
          record.scores?.posture ??
          analysis.scores?.posture
        ),

      symmetry:
        safeNumber(
          record.scores?.symmetry ??
          analysis.scores?.symmetry
        ),

      technique:
        safeNumber(
          record.scores?.technique ??
          analysis.scores?.technique
        ),

      stability:
        safeNumber(
          record.scores?.stability ??
          analysis.scores?.stability
        ),

      efficiency:
        safeNumber(
          record.scores?.efficiency ??
          analysis.scores?.efficiency
        ),

      elite:
        safeNumber(
          record.scores?.elite ??
          analysis.scores?.elite
        )

    },

    angles:
      record.angles ||
      analysis.angles ||
      {},

    metrics:
      record.metrics ||
      analysis.metrics ||
      {},

    technique:
      record.technique ||
      analysis.currentTechnique ||
      "--",

    transitions:
      record.transitions ||
      analysis.techniqueTransitions ||
      [],

    segments:
      record.segments ||
      analysis.segments ||
      [],

    problems:
      record.problems ||
      analysis.problems ||
      [],

    feedback:
      record.feedback ||
      analysis.feedback ||
      [],

    training:
      record.training?.length
        ? record.training
        : trainingFromEngine,

    images: {

      snapshot:
        record.images?.snapshot ||
        analysis.snapshot ||
        null,

      pose:
        record.images?.pose ||
        analysis.poseImage ||
        null,

      angles:
        record.images?.angles ||
        analysis.angleImage ||
        null,

      trajectory:
        record.images?.trajectory ||
        analysis.trajectoryImage ||
        null,

      threeD:
        record.images?.threeD ||
        analysis.threeDImage ||
        null

    },

    threeD:
      record.threeD ||
      {

        enabled:
          analysis.viewMode ===
          "3d",

        landmarkCount:
          analysis.worldLandmarks
            ?.length ||
          0

      }

  };

}



/* =========================================================
   06. SET TEXT
========================================================= */

function setReportText(
  selector,
  value,
  fallback = "-"
) {

  reportQueryAll(
    selector
  )
    .forEach(
      element => {

        element.textContent =
          safeText(
            value,
            fallback
          );

      }
    );

}



/* =========================================================
   07. REPORT HEADER
========================================================= */

function renderReportHeader(
  record
) {

  setReportText(
    "[data-report-title]",
    `${record.sportName} 퍼포먼스 분석 리포트`
  );


  setReportText(
    "[data-report-overall]",
    Math.round(
      record.overallScore
    )
  );


  setReportText(
    "[data-report-athlete]",
    record.athlete.name
  );


  setReportText(
    "[data-report-school]",
    record.athlete.school
  );


  setReportText(
    "[data-report-grade]",
    record.athlete.grade
  );


  setReportText(
    "[data-report-sport]",
    record.sportName
  );


  const modeLabel =

    record.mode ===
    "realtime"

      ? "실시간 카메라"

      : record.mode ===
        "video"

        ? "영상 분석"

        : safeText(
            record.mode
          );


  setReportText(
    "[data-report-mode]",
    modeLabel
  );


  setReportText(
    "[data-report-date]",
    formatReportDate(
      record.createdAt
    )
  );

}



/* =========================================================
   08. SCORE GRID
========================================================= */

function renderReportScores(
  record
) {

  Object.entries(
    record.scores
  )
    .forEach(
      ([key, value]) => {

        const elements =
          reportQueryAll(
            `[data-report-score="${key}"]`
          );


        elements.forEach(
          element => {

            element.textContent =
              Math.round(
                safeNumber(
                  value
                )
              );

          }
        );

      }
    );

}



/* =========================================================
   09. RADAR CHART
========================================================= */

function renderReportRadar(
  record
) {

  const canvas =
    reportQuery(
      "[data-report-radar]"
    );


  if (!canvas) {

    return;

  }


  if (
    ReportState.radarChart
  ) {

    try {

      ReportState.radarChart
        .destroy();

    }

    catch (error) {

      console.warn(
        error
      );

    }


    ReportState.radarChart =
      null;

  }


  if (
    typeof Chart ===
    "undefined"
  ) {

    const parent =
      canvas.parentElement;


    if (parent) {

      const fallback =
        document.createElement(
          "div"
        );


      fallback.className =
        "report-chart-fallback";


      fallback.innerHTML =
        Object.entries(
          record.scores
        )
          .map(
            ([key, value]) => `

              <div>

                <span>
                  ${REPORT_SCORE_LABELS[key] || key}
                </span>

                <strong>
                  ${Math.round(
                    safeNumber(
                      value
                    )
                  )}
                </strong>

              </div>

            `
          )
          .join("");


      canvas.hidden =
        true;


      parent.appendChild(
        fallback
      );

    }


    return;

  }


  const values = [

    record.scores.posture,

    record.scores.symmetry,

    record.scores.technique,

    record.scores.stability,

    record.scores.efficiency,

    record.scores.elite

  ];


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
                5,

              backgroundColor:
                "rgba(36, 197, 255, 0.14)",

              borderColor:
                "rgba(36, 197, 255, 0.95)",

              pointBackgroundColor:
                "rgba(255, 225, 90, 1)"

            }

          ]

        },

        options: {

          responsive:
            true,

          maintainAspectRatio:
            false,

          animation:
            false,

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

                display:
                  false

              },

              grid: {

                color:
                  "rgba(130, 170, 205, 0.22)"

              },

              angleLines: {

                color:
                  "rgba(130, 170, 205, 0.22)"

              },

              pointLabels: {

                color:
                  "#d8e8f5",

                font: {

                  size:
                    11,

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



/* =========================================================
   10. REPORT IMAGES
========================================================= */

function renderSingleReportImage(
  key,
  source
) {

  const image =
    reportQuery(
      `[data-report-image="${key}"]`
    );


  if (!image) {

    return;

  }


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



function renderReportImages(
  record
) {

  renderSingleReportImage(
    "snapshot",
    record.images.snapshot
  );


  renderSingleReportImage(
    "pose",
    record.images.pose
  );


  renderSingleReportImage(
    "angles",
    record.images.angles
  );


  renderSingleReportImage(
    "trajectory",
    record.images.trajectory
  );


  renderSingleReportImage(
    "threeD",
    record.images.threeD
  );

}



/* =========================================================
   11. JOINT ANGLES
========================================================= */

function renderReportAngles(
  record
) {

  const container =
    reportQuery(
      "[data-report-angles]"
    );


  if (!container) {

    return;

  }


  const entries =
    Object.entries(
      record.angles ||
      {}
    );


  if (!entries.length) {

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
                REPORT_ANGLE_LABELS[key] ||
                key
              )}
            </span>

            <strong>
              ${Math.round(
                safeNumber(
                  value
                )
              )}°
            </strong>

          </div>

        `
      )
      .join("");

}



/* =========================================================
   12. SPORT DATA
========================================================= */

function renderReportSportData(
  record
) {

  const container =
    reportQuery(
      "[data-report-sport-data]"
    );


  if (!container) {

    return;

  }


  const entries =
    Object.entries(
      record.metrics ||
      {}
    );


  if (!entries.length) {

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
        ([key, value]) => `

          <div class="report-data-card">

            <span>
              ${escapeReportHTML(
                REPORT_METRIC_LABELS[key] ||
                key
              )}
            </span>

            <strong>
              ${escapeReportHTML(
                value
              )}
            </strong>

          </div>

        `
      )
      .join("");

}



/* =========================================================
   13. SEGMENTS
========================================================= */

function renderReportSegments(
  record
) {

  const container =
    reportQuery(
      "[data-report-segments]"
    );


  if (!container) {

    return;

  }


  const segments =
    Array.isArray(
      record.segments
    )
      ? record.segments
      : [];


  if (
    !segments.length
  ) {

    container.innerHTML = `

      <div class="empty-state">

        저장된 구간 분석 데이터가 없습니다.

      </div>

    `;


    return;

  }


  container.innerHTML = `

    <div class="report-segment-table">

      <div class="report-segment-row header">

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


      ${segments
        .map(
          (segment, index) => `

            <div class="report-segment-row">

              <strong>
                ${escapeReportHTML(
                  segment.name ||
                  `${index + 1}구간`
                )}
              </strong>

              <span>
                ${escapeReportHTML(
                  segment.distance ||
                  "-"
                )}
              </span>

              <span>
                ${escapeReportHTML(
                  segment.time ||
                  "-"
                )}
              </span>

              <span>
                ${escapeReportHTML(
                  segment.technique ||
                  "-"
                )}
              </span>

              <span>
                ${escapeReportHTML(
                  segment.slope ||
                  "-"
                )}
              </span>

            </div>

          `
        )
        .join("")}

    </div>

  `;

}



/* =========================================================
   14. TECHNIQUE
========================================================= */

function renderReportTechnique(
  record
) {

  setReportText(
    "[data-report-current-technique]",
    record.technique,
    "--"
  );


  setReportText(
    "[data-report-transition-count]",
    record.transitions.length,
    "0"
  );


  const container =
    reportQuery(
      "[data-report-techniques]"
    );


  if (!container) {

    return;

  }


  const techniqueNames =
    new Set();


  if (
    record.technique &&
    record.technique !==
    "--"
  ) {

    techniqueNames.add(
      record.technique
    );

  }


  record.transitions.forEach(
    transition => {

      if (
        transition.from
      ) {

        techniqueNames.add(
          transition.from
        );

      }


      if (
        transition.to
      ) {

        techniqueNames.add(
          transition.to
        );

      }

    }
  );


  if (
    !techniqueNames.size
  ) {

    container.innerHTML = `

      <span class="report-chip">
        분석 데이터 없음
      </span>

    `;


    return;

  }


  container.innerHTML =
    [
      ...techniqueNames
    ]
      .map(
        technique => `

          <span class="report-chip">

            ${escapeReportHTML(
              technique
            )}

          </span>

        `
      )
      .join("");

}



/* =========================================================
   15. 3D BIOMECHANICS
========================================================= */

function renderReport3D(
  record
) {

  const container =
    reportQuery(
      "[data-report-3d]"
    );


  if (!container) {

    return;

  }


  const enabled =
    Boolean(
      record.threeD?.enabled ||
      record.images.threeD
    );


  const landmarkCount =
    safeNumber(
      record.threeD
        ?.landmarkCount,
      0
    );


  container.innerHTML = `

    <div class="report-data-card">

      <span>
        3D 분석
      </span>

      <strong>
        ${
          enabled
            ? "분석 완료"
            : "2D 분석"
        }
      </strong>

    </div>


    <div class="report-data-card">

      <span>
        추적 포인트
      </span>

      <strong>
        ${landmarkCount || 33}
      </strong>

    </div>


    <div class="report-data-card">

      <span>
        자세 안정성
      </span>

      <strong>
        ${Math.round(
          record.scores
            .stability
        )}
      </strong>

    </div>


    <div class="report-data-card">

      <span>
        좌우 대칭
      </span>

      <strong>
        ${Math.round(
          record.scores
            .symmetry
        )}
      </strong>

    </div>

  `;

}



/* =========================================================
   16. ELITE COMPARISON
========================================================= */

function getEliteComparison(
  record
) {

  const score =
    safeNumber(
      record.scores.elite
    );


  if (
    score >=
    95
  ) {

    return {

      level:
        "ELITE +",

      description:
        "현재 분석 지표가 설정된 엘리트 기준에 매우 근접합니다. 반복 수행에서 같은 기술을 유지하는 것이 중요합니다."

    };

  }


  if (
    score >=
    90
  ) {

    return {

      level:
        "ELITE",

      description:
        "엘리트 기준과 비교했을 때 높은 수준의 동작 패턴을 보입니다. 세부 기술의 일관성을 높여보세요."

    };

  }


  if (
    score >=
    80
  ) {

    return {

      level:
        "ADVANCED",

      description:
        "전반적인 수행 수준은 양호합니다. 낮은 점수의 세부 항목을 우선 개선하면 엘리트 기준에 더 가까워질 수 있습니다."

    };

  }


  if (
    score >=
    70
  ) {

    return {

      level:
        "DEVELOPING",

      description:
        "기본적인 동작 패턴은 형성되어 있습니다. 자세 안정성과 종목 기술을 함께 개선하는 것이 좋습니다."

    };

  }


  return {

    level:
      "FOUNDATION",

    description:
      "기본 동작의 안정성과 좌우 균형을 우선적으로 강화한 뒤 종목 기술을 단계적으로 발전시키는 것이 좋습니다."

  };

}



function renderEliteComparison(
  record
) {

  const container =
    reportQuery(
      "[data-report-elite]"
    );


  if (!container) {

    return;

  }


  const comparison =
    getEliteComparison(
      record
    );


  const score =
    Math.round(
      record.scores.elite
    );


  container.innerHTML = `

    <div class="elite-report-card">

      <div class="elite-report-score">

        <small>
          ELITE PROXIMITY
        </small>

        <strong>
          ${score}
        </strong>

      </div>


      <div>

        <span class="elite-level">

          ${escapeReportHTML(
            comparison.level
          )}

        </span>

        <p>

          ${escapeReportHTML(
            comparison.description
          )}

        </p>

      </div>

    </div>

  `;

}



/* =========================================================
   17. FEEDBACK
========================================================= */

function buildAutomaticFeedback(
  record
) {

  const feedback =
    [];


  const scores =
    record.scores;


  const sorted =
    Object.entries(
      scores
    )
      .sort(
        (a, b) =>
          a[1] -
          b[1]
      );


  const weakest =
    sorted[0];


  const strongest =
    sorted[
      sorted.length -
      1
    ];


  if (weakest) {

    feedback.push({

      title:
        `${REPORT_SCORE_LABELS[weakest[0]] || weakest[0]} 우선 개선`,

      description:
        `현재 ${Math.round(
          weakest[1]
        )}점으로 분석 항목 중 상대적으로 낮습니다. 관련 교정훈련을 우선 적용하세요.`

    });

  }


  if (strongest) {

    feedback.push({

      title:
        `${REPORT_SCORE_LABELS[strongest[0]] || strongest[0]} 강점`,

      description:
        `현재 ${Math.round(
          strongest[1]
        )}점으로 분석 항목 중 강점으로 나타났습니다.`

    });

  }


  return feedback;

}



function renderReportFeedback(
  record
) {

  const container =
    reportQuery(
      "[data-report-feedback]"
    );


  if (!container) {

    return;

  }


  let feedback =
    Array.isArray(
      record.feedback
    )
      ? [
          ...record.feedback
        ]
      : [];


  if (
    !feedback.length
  ) {

    feedback =
      buildAutomaticFeedback(
        record
      );

  }


  if (
    !feedback.length
  ) {

    container.innerHTML = `

      <div class="empty-state">

        피드백 데이터가 없습니다.

      </div>

    `;


    return;

  }


  container.innerHTML =
    feedback
      .map(
        (item, index) => {

          const title =
            typeof item ===
            "string"
              ? `피드백 ${index + 1}`
              : item.title ||
                `피드백 ${index + 1}`;


          const description =
            typeof item ===
            "string"
              ? item
              : item.description ||
                item.reason ||
                "-";


          return `

            <article class="feedback-card">

              <span class="feedback-number">
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
                    title
                  )}
                </strong>

                <p>
                  ${escapeReportHTML(
                    description
                  )}
                </p>

              </div>

            </article>

          `;

        }
      )
      .join("");

}



/* =========================================================
   18. TRAINING
========================================================= */

function normalizeTrainingItem(
  item,
  index
) {

  if (
    typeof item ===
    "string"
  ) {

    return {

      rank:
        index + 1,

      name:
        item,

      category:
        "추천 훈련",

      target:
        "종목 수행 능력",

      reason:
        "현재 자세분석 결과를 기반으로 추천된 훈련입니다.",

      priorityLabel:
        index <
        8
          ? "우선 추천"
          : "보조 추천"

    };

  }


  return {

    rank:
      item.rank ||
      index + 1,

    name:
      item.name ||
      `훈련 ${index + 1}`,

    category:
      item.category ||
      "추천 훈련",

    target:
      item.target ||
      "-",

    reason:
      item.reason ||
      "-",

    priorityLabel:
      item.priorityLabel ||
      (
        index <
        8
          ? "우선 추천"
          : "보조 추천"
      )

  };

}



function renderReportTraining(
  record
) {

  const container =
    reportQuery(
      "[data-report-training]"
    );


  if (!container) {

    return;

  }


  let training =
    Array.isArray(
      record.training
    )
      ? record.training
      : [];


  if (
    !training.length &&
    window.SeolcheonTraining
      ?.build
  ) {

    training =
      window.SeolcheonTraining
        .build(
          window.SeolcheonAnalysisState
        );

  }


  training =
    training
      .slice(
        0,
        30
      )
      .map(
        normalizeTrainingItem
      );


  if (
    !training.length
  ) {

    container.innerHTML = `

      <div class="empty-state">

        추천 훈련 데이터가 없습니다.

      </div>

    `;


    return;

  }


  container.innerHTML = `

    <div class="report-training-summary">

      <div>

        <span>
          추천 훈련
        </span>

        <strong>
          ${training.length}
        </strong>

      </div>

      <div>

        <span>
          우선 훈련
        </span>

        <strong>
          ${
            training.filter(
              item =>
                item.priorityLabel ===
                "우선 추천"
            ).length
          }
        </strong>

      </div>

    </div>


    <div class="report-training-grid">

      ${training
        .map(
          item => `

            <article
              class="report-training-card ${
                item.priorityLabel ===
                "우선 추천"
                  ? "priority"
                  : ""
              }"
            >

              <div class="report-training-top">

                <span class="training-rank">
                  ${String(
                    item.rank
                  ).padStart(
                    2,
                    "0"
                  )}
                </span>

                <span>
                  ${escapeReportHTML(
                    item.category
                  )}
                </span>

              </div>


              <h3>
                ${escapeReportHTML(
                  item.name
                )}
              </h3>


              <div class="report-training-target">

                <small>
                  TARGET
                </small>

                <strong>
                  ${escapeReportHTML(
                    item.target
                  )}
                </strong>

              </div>


              <p>
                ${escapeReportHTML(
                  item.reason
                )}
              </p>


              <span class="report-training-priority">

                ${escapeReportHTML(
                  item.priorityLabel
                )}

              </span>

            </article>

          `
        )
        .join("")}

    </div>

  `;

}



/* =========================================================
   19. COMPLETE REPORT RENDER
========================================================= */

function renderPerformanceReport(
  inputRecord
) {

  const record =
    normalizeReportRecord(
      inputRecord
    );


  ReportState.currentRecord =
    record;


  renderReportHeader(
    record
  );


  renderReportScores(
    record
  );


  renderReportRadar(
    record
  );


  renderReportImages(
    record
  );


  renderReportAngles(
    record
  );


  renderReportSportData(
    record
  );


  renderReportSegments(
    record
  );


  renderReportTechnique(
    record
  );


  renderReport3D(
    record
  );


  renderEliteComparison(
    record
  );


  renderReportFeedback(
    record
  );


  renderReportTraining(
    record
  );


  ReportState.rendered =
    true;


  return record;

}



/* =========================================================
   20. OPEN REPORT
========================================================= */

function openPerformanceReport(
  record
) {

  const normalized =
    renderPerformanceReport(
      record
    );


  window.SeolcheonApp
    ?.navigate(
      "report"
    );


  setTimeout(
    () => {

      renderReportRadar(
        normalized
      );

    },
    100
  );

}



/* =========================================================
   21. ANALYSIS EVENT
========================================================= */

window.addEventListener(
  "seolcheon:open-report",
  event => {

    const record =
      event.detail
        ?.record;


    openPerformanceReport(
      record
    );

  }
);



/* =========================================================
   22. RECORD CLICK SUPPORT
========================================================= */

document.addEventListener(
  "click",
  event => {

    const openButton =
      event.target.closest(
        "[data-open-analysis-report]"
      );


    if (!openButton) {

      return;

    }


    const recordId =
      openButton.dataset
        .openAnalysisReport;


    if (!recordId) {

      return;

    }


    let record =
      null;


    if (
      window.SeolcheonCore
        ?.getAnalysisRecord
    ) {

      record =
        window.SeolcheonCore
          .getAnalysisRecord(
            recordId
          );

    }


    if (
      !record &&
      Array.isArray(
        window.SeolcheonState
          ?.analyses
      )
    ) {

      record =
        window.SeolcheonState
          .analyses
          .find(
            item =>
              String(
                item.id
              ) ===
              String(
                recordId
              )
          );

    }


    if (!record) {

      alert(
        "분석 기록을 찾지 못했습니다."
      );

      return;

    }


    openPerformanceReport(
      record
    );

  }
);



/* =========================================================
   23. REPORT BACK
========================================================= */

document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-report-back]"
      );


    if (!button) {

      return;

    }


    window.SeolcheonApp
      ?.navigate(
        "analysis"
      );

  }
);



/* =========================================================
   24. PRINT / PDF
========================================================= */

function printPerformanceReport() {

  if (
    !ReportState.rendered
  ) {

    renderPerformanceReport();

  }


  document.body
    .classList
    .add(
      "printing-report"
    );


  setTimeout(
    () => {

      window.print();


      setTimeout(
        () => {

          document.body
            .classList
            .remove(
              "printing-report"
            );

        },
        300
      );

    },
    100
  );

}



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


    printPerformanceReport();

  }
);



/* =========================================================
   25. REPORT PAGE NAVIGATION
========================================================= */

document.addEventListener(
  "click",
  event => {

    const nav =
      event.target.closest(
        '[data-nav="report"]'
      );


    if (!nav) {

      return;

    }


    setTimeout(
      () => {

        renderPerformanceReport(
          ReportState.currentRecord
        );

      },
      50
    );

  }
);



/* =========================================================
   26. ANALYSIS SNAPSHOT UPDATE
========================================================= */

function refreshReportFromCurrentAnalysis() {

  const analysis =
    window.SeolcheonAnalysisState;


  if (!analysis) {

    return null;

  }


  try {

    window.SeolcheonAnalysis
      ?.createSnapshot?.();

  }

  catch (error) {

    console.warn(
      "Snapshot refresh failed:",
      error
    );

  }


  return renderPerformanceReport();

}



/* =========================================================
   27. REPORT EXPORT DATA
========================================================= */

function getCurrentReportData() {

  if (
    ReportState.currentRecord
  ) {

    return JSON.parse(
      JSON.stringify(
        ReportState.currentRecord
      )
    );

  }


  return normalizeReportRecord();

}



/* =========================================================
   28. PERFORMANCE GRADE
========================================================= */

function getPerformanceGrade(
  score
) {

  score =
    safeNumber(
      score
    );


  if (
    score >=
    95
  ) {

    return "S";

  }


  if (
    score >=
    90
  ) {

    return "A+";

  }


  if (
    score >=
    85
  ) {

    return "A";

  }


  if (
    score >=
    80
  ) {

    return "B+";

  }


  if (
    score >=
    75
  ) {

    return "B";

  }


  if (
    score >=
    70
  ) {

    return "C+";

  }


  return "C";

}



/* =========================================================
   29. ADD GRADE TO REPORT
========================================================= */

function renderPerformanceGrade(
  record
) {

  let element =
    reportQuery(
      "[data-report-grade-score]"
    );


  if (!element) {

    const circle =
      reportQuery(
        ".report-score-circle"
      );


    if (circle) {

      element =
        document.createElement(
          "span"
        );


      element.className =
        "report-performance-grade";


      element.setAttribute(
        "data-report-grade-score",
        ""
      );


      circle.appendChild(
        element
      );

    }

  }


  if (element) {

    element.textContent =
      getPerformanceGrade(
        record.overallScore
      );

  }

}



/* =========================================================
   30. WRAP MAIN RENDER
========================================================= */

const originalRenderPerformanceReport =
  renderPerformanceReport;


renderPerformanceReport =
  function (
    inputRecord
  ) {

    const record =
      originalRenderPerformanceReport(
        inputRecord
      );


    renderPerformanceGrade(
      record
    );


    return record;

  };



/* =========================================================
   31. SCORE DESCRIPTION
========================================================= */

function getScoreDescription(
  score
) {

  score =
    safeNumber(
      score
    );


  if (
    score >=
    90
  ) {

    return "매우 우수";

  }


  if (
    score >=
    80
  ) {

    return "우수";

  }


  if (
    score >=
    70
  ) {

    return "양호";

  }


  if (
    score >=
    60
  ) {

    return "개선 필요";

  }


  return "기초 교정 필요";

}



/* =========================================================
   32. SCORE COLOR CLASS
========================================================= */

function getScoreClass(
  score
) {

  score =
    safeNumber(
      score
    );


  if (
    score >=
    90
  ) {

    return "score-excellent";

  }


  if (
    score >=
    80
  ) {

    return "score-good";

  }


  if (
    score >=
    70
  ) {

    return "score-normal";

  }


  return "score-warning";

}



/* =========================================================
   33. SCORE CARD ENHANCEMENT
========================================================= */

function enhanceScoreCards(
  record
) {

  Object.entries(
    record.scores
  )
    .forEach(
      ([key, score]) => {

        reportQueryAll(
          `[data-report-score="${key}"]`
        )
          .forEach(
            element => {

              const parent =
                element.parentElement;


              if (!parent) {

                return;

              }


              parent.classList.remove(

                "score-excellent",

                "score-good",

                "score-normal",

                "score-warning"

              );


              parent.classList.add(
                getScoreClass(
                  score
                )
              );


              parent.title =
                getScoreDescription(
                  score
                );

            }
          );

      }
    );

}



/* =========================================================
   34. REPORT SUMMARY
========================================================= */

function createReportSummary(
  record
) {

  const scoreEntries =
    Object.entries(
      record.scores
    )
      .sort(
        (a, b) =>
          b[1] -
          a[1]
      );


  const strongest =
    scoreEntries[0];


  const weakest =
    scoreEntries[
      scoreEntries.length -
      1
    ];


  return {

    grade:
      getPerformanceGrade(
        record.overallScore
      ),

    level:
      getScoreDescription(
        record.overallScore
      ),

    strongest: {

      key:
        strongest?.[0] ||
        null,

      name:
        REPORT_SCORE_LABELS[
          strongest?.[0]
        ] ||
        "-",

      score:
        strongest?.[1] ||
        0

    },

    weakest: {

      key:
        weakest?.[0] ||
        null,

      name:
        REPORT_SCORE_LABELS[
          weakest?.[0]
        ] ||
        "-",

      score:
        weakest?.[1] ||
        0

    }

  };

}



/* =========================================================
   35. REPORT SUMMARY PANEL
========================================================= */

function ensureReportSummaryPanel(
  record
) {

  const report =
    reportQuery(
      ".performance-report"
    );


  if (!report) {

    return;

  }


  let panel =
    reportQuery(
      "[data-report-summary]"
    );


  if (!panel) {

    panel =
      document.createElement(
        "section"
      );


    panel.className =
      "report-section report-summary-section";


    panel.setAttribute(
      "data-report-summary",
      ""
    );


    const athleteInfo =
      reportQuery(
        ".report-athlete-info"
      );


    if (
      athleteInfo &&
      athleteInfo.nextSibling
    ) {

      report.insertBefore(
        panel,
        athleteInfo.nextSibling
      );

    }

    else {

      report.appendChild(
        panel
      );

    }

  }


  const summary =
    createReportSummary(
      record
    );


  panel.innerHTML = `

    <div class="report-section-title">

      <span>
        00
      </span>

      <h2>
        ANALYSIS SUMMARY
      </h2>

    </div>


    <div class="report-summary-grid">


      <div>

        <span>
          종합 평가
        </span>

        <strong>
          ${escapeReportHTML(
            summary.level
          )}
        </strong>

      </div>


      <div>

        <span>
          등급
        </span>

        <strong>
          ${escapeReportHTML(
            summary.grade
          )}
        </strong>

      </div>


      <div>

        <span>
          강점
        </span>

        <strong>
          ${escapeReportHTML(
            summary.strongest.name
          )}
        </strong>

        <small>
          ${Math.round(
            summary.strongest.score
          )}점
        </small>

      </div>


      <div>

        <span>
          우선 개선
        </span>

        <strong>
          ${escapeReportHTML(
            summary.weakest.name
          )}
        </strong>

        <small>
          ${Math.round(
            summary.weakest.score
          )}점
        </small>

      </div>


    </div>

  `;

}



/* =========================================================
   36. FINAL RENDER ENHANCEMENT
========================================================= */

const enhancedRenderPerformanceReport =
  renderPerformanceReport;


renderPerformanceReport =
  function (
    inputRecord
  ) {

    const record =
      enhancedRenderPerformanceReport(
        inputRecord
      );


    enhanceScoreCards(
      record
    );


    ensureReportSummaryPanel(
      record
    );


    ReportState.currentRecord =
      record;


    return record;

  };



/* =========================================================
   37. SAVE REPORT
========================================================= */

function saveCurrentReport() {

  const record =
    getCurrentReportData();


  if (
    window.SeolcheonCore
      ?.saveReport
  ) {

    return window.SeolcheonCore
      .saveReport(
        record
      );

  }


  try {

    const key =
      "seolcheon_performance_reports";


    const reports =
      JSON.parse(
        localStorage.getItem(
          key
        ) ||
        "[]"
      );


    const report = {

      ...record,

      reportId:
        `report_${Date.now()}`,

      savedAt:
        new Date()
          .toISOString()

    };


    reports.unshift(
      report
    );


    localStorage.setItem(
      key,
      JSON.stringify(
        reports
      )
    );


    return report;

  }

  catch (error) {

    console.error(
      "Report save error:",
      error
    );


    return null;

  }

}



/* =========================================================
   38. OPTIONAL SAVE BUTTON
========================================================= */

function ensureReportSaveButton() {

  const toolbar =
    reportQuery(
      ".report-toolbar"
    );


  if (!toolbar) {

    return;

  }


  if (
    reportQuery(
      "[data-report-save]"
    )
  ) {

    return;

  }


  const button =
    document.createElement(
      "button"
    );


  button.type =
    "button";


  button.className =
    "ghost-button";


  button.setAttribute(
    "data-report-save",
    ""
  );


  button.textContent =
    "리포트 저장";


  const printButton =
    toolbar.querySelector(
      "[data-report-print]"
    );


  if (printButton) {

    toolbar.insertBefore(
      button,
      printButton
    );

  }

  else {

    toolbar.appendChild(
      button
    );

  }

}



/* =========================================================
   39. SAVE BUTTON EVENT
========================================================= */

document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-report-save]"
      );


    if (!button) {

      return;

    }


    const result =
      saveCurrentReport();


    if (result) {

      alert(
        "리포트를 저장했습니다."
      );

    }

    else {

      alert(
        "리포트 저장에 실패했습니다."
      );

    }

  }
);



/* =========================================================
   40. INITIALIZE
========================================================= */

function initializeReportSystem() {

  ensureReportSaveButton();


  console.log(
    "SEOLCHEON REPORT ENGINE READY"
  );

}



document.addEventListener(
  "DOMContentLoaded",
  initializeReportSystem
);



if (
  document.readyState !==
  "loading"
) {

  initializeReportSystem();

}



/* =========================================================
   41. PUBLIC API
========================================================= */

window.SeolcheonReport = {

  state:
    ReportState,

  render:
    renderPerformanceReport,

  open:
    openPerformanceReport,

  refresh:
    refreshReportFromCurrentAnalysis,

  print:
    printPerformanceReport,

  save:
    saveCurrentReport,

  getData:
    getCurrentReportData,

  getGrade:
    getPerformanceGrade,

  getSummary:
    createReportSummary

};



/* =========================================================
   END OF REPORT.JS
========================================================= */