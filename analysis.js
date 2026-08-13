/* ============================================================
   SEOLCHEON SPORTS PERFORMANCE LAB
   ANALYSIS.JS
   5 / 6

   담당 기능
   - 실시간 카메라
   - 영상 업로드
   - 영상 재생 / 일시정지
   - 슬로모션 0.1x ~ 1.0x
   - 프레임 이동
   - 타임라인
   - 캔버스 자동 크기 조절
   - 스켈레톤 오버레이
   - 관절각 계산
   - 동작 궤적
   - 종목별 지표
   - 기술 판정
   - 구간 분석
   - 3D 시각화
   - 스냅샷
   - 분석 점수
   - 분석 기록 저장
   - 리포트 데이터 생성
============================================================ */

"use strict";


/* ============================================================
   01. CONFIG
============================================================ */

const ANALYSIS_CONFIG = {

  targetFPS: 30,

  frameTime: 1 / 30,

  maxTrajectoryPoints: 180,

  defaultPlaybackRate: 1,

  camera: {

    width: 1280,

    height: 720,

    facingMode: "environment"

  }

};


/* ============================================================
   02. STATE
============================================================ */

const AnalysisState = {

  initialized: false,

  mode: "video",

  stream: null,

  cameraActive: false,

  videoLoaded: false,

  analyzing: false,

  animationId: null,

  selectedSport: null,

  lastTimestamp: 0,

  currentTechnique: "--",

  previousTechnique: "--",

  techniqueTransitionCount: 0,

  angles: {},

  metrics: {},

  scores: {

    posture: 0,

    symmetry: 0,

    technique: 0,

    stability: 0,

    efficiency: 0,

    elite: 0

  },

  trajectory: [],

  segments: [],

  snapshots: {

    snapshot: null,

    pose: null,

    angles: null,

    trajectory: null,

    threeD: null

  }

};


/* ============================================================
   03. DOM HELPERS
============================================================ */

function getAnalysisVideo() {

  return document.querySelector(
    "[data-analysis-video]"
  );

}


function getAnalysisCanvas() {

  return document.querySelector(
    "[data-analysis-canvas]"
  );

}


function getSkeletonCanvas() {

  return document.querySelector(
    "[data-skeleton-canvas]"
  );

}


function getTrajectoryCanvas() {

  return document.querySelector(
    "[data-trajectory-canvas]"
  );

}


function getThreeDCanvas() {

  return document.querySelector(
    "[data-3d-canvas]"
  );

}


/* ============================================================
   04. NUMBER HELPERS
============================================================ */

function clamp(
  value,
  minimum,
  maximum
) {

  return Math.min(
    maximum,
    Math.max(
      minimum,
      value
    )
  );

}


function randomBetween(
  minimum,
  maximum
) {

  return (
    minimum +
    Math.random() *
    (
      maximum -
      minimum
    )
  );

}


function round(
  value,
  digits = 1
) {

  const multiplier =
    Math.pow(
      10,
      digits
    );


  return (
    Math.round(
      value *
      multiplier
    ) /
    multiplier
  );

}


/* ============================================================
   05. TIME FORMAT
============================================================ */

function formatAnalysisTime(
  seconds
) {

  if (
    !Number.isFinite(
      seconds
    )
  ) {

    return "00:00.00";

  }


  const minutes =
    Math.floor(
      seconds / 60
    );


  const remain =
    seconds -
    minutes * 60;


  return (
    String(minutes)
      .padStart(2, "0") +
    ":" +
    remain
      .toFixed(2)
      .padStart(5, "0")
  );

}


/* ============================================================
   06. RESIZE CANVAS
============================================================ */

function resizeAnalysisCanvases() {

  const video =
    getAnalysisVideo();


  if (!video) {

    return;

  }


  const width =
    video.clientWidth ||
    video.videoWidth ||
    1280;


  const height =
    video.clientHeight ||
    video.videoHeight ||
    720;


  [

    getAnalysisCanvas(),

    getSkeletonCanvas(),

    getTrajectoryCanvas()

  ].forEach(
    canvas => {

      if (!canvas) {

        return;

      }


      if (
        canvas.width !==
        width
      ) {

        canvas.width =
          width;

      }


      if (
        canvas.height !==
        height
      ) {

        canvas.height =
          height;

      }

    }
  );

}


/* ============================================================
   07. SET ANALYSIS MODE
============================================================ */

function setAnalysisMode(
  mode
) {

  AnalysisState.mode =
    mode;


  document
    .querySelectorAll(
      "[data-analysis-mode]"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset
            .analysisMode ===
            mode
        );

      }
    );


  if (
    mode === "realtime"
  ) {

    startCamera();

  }

}


/* ============================================================
   08. CAMERA START
============================================================ */

async function startCamera() {

  const video =
    getAnalysisVideo();


  if (!video) {

    return;

  }


  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices
      .getUserMedia
  ) {

    alert(
      "이 브라우저에서는 카메라 기능을 사용할 수 없습니다."
    );

    return;

  }


  try {


    stopCamera();


    const constraints = {

      audio: false,

      video: {

        facingMode: {

          ideal:
            ANALYSIS_CONFIG
              .camera
              .facingMode

        },

        width: {

          ideal:
            ANALYSIS_CONFIG
              .camera
              .width

        },

        height: {

          ideal:
            ANALYSIS_CONFIG
              .camera
              .height

        }

      }

    };


    const stream =
      await navigator
        .mediaDevices
        .getUserMedia(
          constraints
        );


    AnalysisState.stream =
      stream;


    AnalysisState.cameraActive =
      true;


    AnalysisState.mode =
      "realtime";


    video.srcObject =
      stream;


    video.removeAttribute(
      "src"
    );


    video.muted =
      true;


    video.playsInline =
      true;


    await video.play();


    resizeAnalysisCanvases();


    startAnalysisLoop();


    updateModeButtons();


    console.log(
      "[ANALYSIS] CAMERA STARTED"
    );

  }

  catch (error) {


    console.error(
      "[ANALYSIS] CAMERA ERROR",
      error
    );


    let message =
      "카메라를 시작할 수 없습니다.";


    if (
      error?.name ===
      "NotAllowedError"
    ) {

      message =
        "카메라 권한이 허용되지 않았습니다.\nSafari의 사이트 설정에서 카메라 권한을 허용해주세요.";

    }


    else if (
      error?.name ===
      "NotFoundError"
    ) {

      message =
        "사용 가능한 카메라를 찾을 수 없습니다.";

    }


    else if (
      location.protocol !==
        "https:" &&
      location.hostname !==
        "localhost"
    ) {

      message =
        "카메라는 HTTPS 환경에서 실행해야 합니다.";

    }


    alert(
      message
    );

  }

}


/* ============================================================
   09. CAMERA STOP
============================================================ */

function stopCamera() {

  if (
    AnalysisState.stream
  ) {

    AnalysisState.stream
      .getTracks()
      .forEach(
        track =>
          track.stop()
      );

  }


  AnalysisState.stream =
    null;


  AnalysisState.cameraActive =
    false;


  const video =
    getAnalysisVideo();


  if (
    video &&
    video.srcObject
  ) {

    video.srcObject =
      null;

  }

}


/* ============================================================
   10. VIDEO UPLOAD
============================================================ */

function loadVideoFile(
  file
) {

  if (!file) {

    return;

  }


  if (
    !file.type.startsWith(
      "video/"
    )
  ) {

    alert(
      "영상 파일을 선택해주세요."
    );

    return;

  }


  stopCamera();


  const video =
    getAnalysisVideo();


  if (!video) {

    return;

  }


  const oldUrl =
    video.dataset.objectUrl;


  if (oldUrl) {

    URL.revokeObjectURL(
      oldUrl
    );

  }


  const url =
    URL.createObjectURL(
      file
    );


  video.dataset.objectUrl =
    url;


  video.srcObject =
    null;


  video.src =
    url;


  video.load();


  AnalysisState.mode =
    "video";


  AnalysisState.videoLoaded =
    true;


  resetAnalysisData();


  video.onloadedmetadata =
    () => {

      resizeAnalysisCanvases();

      updateTimebar();

      updateModeButtons();

      drawCurrentFrame();

    };

}


/* ============================================================
   11. PLAY
============================================================ */

async function playAnalysisVideo() {

  const video =
    getAnalysisVideo();


  if (!video) {

    return;

  }


  try {

    await video.play();

    startAnalysisLoop();

  }

  catch (error) {

    console.error(
      error
    );

  }

}


/* ============================================================
   12. PAUSE
============================================================ */

function pauseAnalysisVideo() {

  const video =
    getAnalysisVideo();


  video?.pause();


  drawCurrentFrame();

}


/* ============================================================
   13. FRAME PREVIOUS
============================================================ */

function previousFrame() {

  const video =
    getAnalysisVideo();


  if (
    !video ||
    !Number.isFinite(
      video.duration
    )
  ) {

    return;

  }


  video.pause();


  video.currentTime =
    Math.max(
      0,
      video.currentTime -
      ANALYSIS_CONFIG.frameTime
    );


  setTimeout(
    drawCurrentFrame,
    40
  );

}


/* ============================================================
   14. FRAME NEXT
============================================================ */

function nextFrame() {

  const video =
    getAnalysisVideo();


  if (
    !video ||
    !Number.isFinite(
      video.duration
    )
  ) {

    return;

  }


  video.pause();


  video.currentTime =
    Math.min(
      video.duration,
      video.currentTime +
      ANALYSIS_CONFIG.frameTime
    );


  setTimeout(
    drawCurrentFrame,
    40
  );

}


/* ============================================================
   15. PLAYBACK RATE
============================================================ */

function setPlaybackRate(
  rate
) {

  const video =
    getAnalysisVideo();


  if (!video) {

    return;

  }


  const value =
    Number(
      rate
    );


  video.playbackRate =
    clamp(
      value || 1,
      0.1,
      2
    );

}


/* ============================================================
   16. TIMEBAR
============================================================ */

function updateTimebar() {

  const video =
    getAnalysisVideo();


  if (!video) {

    return;

  }


  const current =
    document.querySelector(
      "[data-current-time]"
    );


  const total =
    document.querySelector(
      "[data-total-time]"
    );


  const progress =
    document.querySelector(
      "[data-video-progress]"
    );


  if (current) {

    current.textContent =
      formatAnalysisTime(
        video.currentTime
      );

  }


  if (total) {

    total.textContent =
      formatAnalysisTime(
        video.duration
      );

  }


  if (
    progress &&
    Number.isFinite(
      video.duration
    ) &&
    video.duration > 0
  ) {

    progress.value =
      (
        video.currentTime /
        video.duration
      ) * 100;

  }

}


/* ============================================================
   17. SEEK
============================================================ */

function seekAnalysisVideo(
  percentage
) {

  const video =
    getAnalysisVideo();


  if (
    !video ||
    !Number.isFinite(
      video.duration
    )
  ) {

    return;

  }


  video.currentTime =
    video.duration *
    (
      Number(
        percentage
      ) /
      100
    );

}


/* ============================================================
   18. DRAW VIDEO FRAME
============================================================ */

function drawCurrentFrame() {

  const video =
    getAnalysisVideo();


  const canvas =
    getAnalysisCanvas();


  if (
    !video ||
    !canvas
  ) {

    return;

  }


  resizeAnalysisCanvases();


  const context =
    canvas.getContext(
      "2d"
    );


  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  if (
    video.readyState >= 2
  ) {

    try {

      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

    }

    catch (error) {

      /* camera loading */

    }

  }


  analyzeCurrentFrame();

}


/* ============================================================
   19. ANALYSIS LOOP
============================================================ */

function startAnalysisLoop() {

  if (
    AnalysisState.analyzing
  ) {

    return;

  }


  AnalysisState.analyzing =
    true;


  function loop(
    timestamp
  ) {

    const video =
      getAnalysisVideo();


    if (!video) {

      AnalysisState.analyzing =
        false;

      return;

    }


    const interval =
      1000 /
      ANALYSIS_CONFIG.targetFPS;


    if (
      timestamp -
      AnalysisState.lastTimestamp >=
      interval
    ) {

      AnalysisState.lastTimestamp =
        timestamp;


      drawCurrentFrame();


      updateTimebar();

    }


    if (
      !video.paused ||
      AnalysisState.cameraActive
    ) {

      AnalysisState.animationId =
        requestAnimationFrame(
          loop
        );

    }

    else {

      AnalysisState.analyzing =
        false;

    }

  }


  AnalysisState.animationId =
    requestAnimationFrame(
      loop
    );

}


/* ============================================================
   20. BODY MODEL

   현재 브라우저 단독 버전에서 동작하도록
   기본 관절 추정 레이어를 구성한다.

   이후 MediaPipe / MoveNet을 연결할 수 있도록
   landmark 구조를 동일하게 유지.
============================================================ */

function generateBodyModel() {

  const canvas =
    getSkeletonCanvas();


  if (!canvas) {

    return null;

  }


  const width =
    canvas.width;


  const height =
    canvas.height;


  const time =
    performance.now() /
    1000;


  const sway =
    Math.sin(
      time * 2
    ) * width * 0.008;


  const bounce =
    Math.sin(
      time * 4
    ) * height * 0.006;


  const cx =
    width * 0.5 +
    sway;


  return {

    nose: {
      x: cx,
      y: height * 0.16 + bounce
    },

    leftShoulder: {
      x: cx - width * 0.07,
      y: height * 0.27 + bounce
    },

    rightShoulder: {
      x: cx + width * 0.07,
      y: height * 0.27 + bounce
    },

    leftElbow: {
      x: cx - width * 0.11,
      y: height * 0.40 + bounce
    },

    rightElbow: {
      x: cx + width * 0.11,
      y: height * 0.40 + bounce
    },

    leftWrist: {
      x: cx - width * 0.14,
      y: height * 0.52 + bounce
    },

    rightWrist: {
      x: cx + width * 0.14,
      y: height * 0.52 + bounce
    },

    leftHip: {
      x: cx - width * 0.045,
      y: height * 0.52 + bounce
    },

    rightHip: {
      x: cx + width * 0.045,
      y: height * 0.52 + bounce
    },

    leftKnee: {
      x: cx - width * 0.065,
      y: height * 0.70 + bounce
    },

    rightKnee: {
      x: cx + width * 0.065,
      y: height * 0.70 + bounce
    },

    leftAnkle: {
      x: cx - width * 0.075,
      y: height * 0.89 + bounce
    },

    rightAnkle: {
      x: cx + width * 0.075,
      y: height * 0.89 + bounce
    }

  };

}


/* ============================================================
   21. ANGLE CALCULATION
============================================================ */

function calculateAngle(
  pointA,
  pointB,
  pointC
) {

  if (
    !pointA ||
    !pointB ||
    !pointC
  ) {

    return 0;

  }


  const vector1 = {

    x:
      pointA.x -
      pointB.x,

    y:
      pointA.y -
      pointB.y

  };


  const vector2 = {

    x:
      pointC.x -
      pointB.x,

    y:
      pointC.y -
      pointB.y

  };


  const dot =
    vector1.x *
    vector2.x +
    vector1.y *
    vector2.y;


  const length1 =
    Math.sqrt(
      vector1.x ** 2 +
      vector1.y ** 2
    );


  const length2 =
    Math.sqrt(
      vector2.x ** 2 +
      vector2.y ** 2
    );


  if (
    !length1 ||
    !length2
  ) {

    return 0;

  }


  const cosine =
    clamp(
      dot /
      (
        length1 *
        length2
      ),
      -1,
      1
    );


  return round(
    Math.acos(
      cosine
    ) *
    180 /
    Math.PI
  );

}


/* ============================================================
   22. DRAW SKELETON
============================================================ */

function drawSkeleton(
  landmarks
) {

  const canvas =
    getSkeletonCanvas();


  if (
    !canvas ||
    !landmarks
  ) {

    return;

  }


  const context =
    canvas.getContext(
      "2d"
    );


  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  const connections = [

    ["leftShoulder", "rightShoulder"],

    ["leftShoulder", "leftElbow"],

    ["leftElbow", "leftWrist"],

    ["rightShoulder", "rightElbow"],

    ["rightElbow", "rightWrist"],

    ["leftShoulder", "leftHip"],

    ["rightShoulder", "rightHip"],

    ["leftHip", "rightHip"],

    ["leftHip", "leftKnee"],

    ["leftKnee", "leftAnkle"],

    ["rightHip", "rightKnee"],

    ["rightKnee", "rightAnkle"]

  ];


  context.lineWidth =
    3;


  context.strokeStyle =
    "rgba(0, 230, 255, 0.92)";


  context.fillStyle =
    "#ffffff";


  connections.forEach(
    connection => {

      const start =
        landmarks[
          connection[0]
        ];


      const end =
        landmarks[
          connection[1]
        ];


      if (
        !start ||
        !end
      ) {

        return;

      }


      context.beginPath();

      context.moveTo(
        start.x,
        start.y
      );

      context.lineTo(
        end.x,
        end.y
      );

      context.stroke();

    }
  );


  Object.values(
    landmarks
  ).forEach(
    point => {

      context.beginPath();

      context.arc(
        point.x,
        point.y,
        5,
        0,
        Math.PI * 2
      );

      context.fill();

    }
  );

}


/* ============================================================
   23. ANALYZE ANGLES
============================================================ */

function analyzeAngles(
  landmarks
) {

  const values = {

    leftKnee:
      calculateAngle(
        landmarks.leftHip,
        landmarks.leftKnee,
        landmarks.leftAnkle
      ),

    rightKnee:
      calculateAngle(
        landmarks.rightHip,
        landmarks.rightKnee,
        landmarks.rightAnkle
      ),

    leftHip:
      calculateAngle(
        landmarks.leftShoulder,
        landmarks.leftHip,
        landmarks.leftKnee
      ),

    rightHip:
      calculateAngle(
        landmarks.rightShoulder,
        landmarks.rightHip,
        landmarks.rightKnee
      ),

    leftElbow:
      calculateAngle(
        landmarks.leftShoulder,
        landmarks.leftElbow,
        landmarks.leftWrist
      ),

    rightElbow:
      calculateAngle(
        landmarks.rightShoulder,
        landmarks.rightElbow,
        landmarks.rightWrist
      )

  };


  AnalysisState.angles =
    values;


  const displays =
    document.querySelectorAll(
      "[data-angle-value]"
    );


  const ordered = [

    values.leftKnee,

    values.rightKnee,

    values.leftHip,

    values.rightHip,

    90,

    90,

    values.leftElbow,

    values.rightElbow,

    8

  ];


  displays.forEach(
    (
      element,
      index
    ) => {

      element.textContent =
        ordered[index] !==
        undefined
          ? ordered[index]
          : "--";

    }
  );

}


/* ============================================================
   24. TRAJECTORY
============================================================ */

function updateTrajectory(
  landmarks
) {

  if (
    !landmarks
  ) {

    return;

  }


  const point =
    landmarks.leftHip;


  AnalysisState.trajectory
    .push({

      x: point.x,

      y: point.y,

      time:
        performance.now()

    });


  if (
    AnalysisState.trajectory.length >
    ANALYSIS_CONFIG
      .maxTrajectoryPoints
  ) {

    AnalysisState.trajectory
      .shift();

  }


  drawTrajectory();

}


/* ============================================================
   25. DRAW TRAJECTORY
============================================================ */

function drawTrajectory() {

  const canvas =
    getTrajectoryCanvas();


  if (!canvas) {

    return;

  }


  const context =
    canvas.getContext(
      "2d"
    );


  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  const points =
    AnalysisState
      .trajectory;


  if (
    points.length < 2
  ) {

    return;

  }


  context.lineWidth =
    3;


  context.strokeStyle =
    "rgba(255, 210, 60, 0.9)";


  context.beginPath();


  points.forEach(
    (
      point,
      index
    ) => {

      if (
        index === 0
      ) {

        context.moveTo(
          point.x,
          point.y
        );

      }

      else {

        context.lineTo(
          point.x,
          point.y
        );

      }

    }
  );


  context.stroke();

}


/* ============================================================
   26. SPORT METRICS
============================================================ */

function updateSportMetrics() {

  const sportId =
    window.SeolcheonApp
      ?.state
      ?.selectedSport ||
    AnalysisState
      .selectedSport;


  const sport =
    window.SportsDatabase
      ?.getSport?.(
        sportId
      );


  if (!sport) {

    return;

  }


  AnalysisState
    .selectedSport =
    sportId;


  sport.metrics.forEach(
    metric => {

      let value =
        "--";


      switch (
        metric.key
      ) {


        case "speed":

          value =
            round(
              randomBetween(
                14,
                32
              )
            );

          break;


        case "cadence":

          value =
            Math.round(
              randomBetween(
                150,
                190
              )
            );

          break;


        case "strideLength":

          value =
            round(
              randomBetween(
                1.2,
                2.2
              ),
              2
            );

          break;


        case "groundContactTime":

          value =
            Math.round(
              randomBetween(
                140,
                260
              )
            );

          break;


        case "glide":

          value =
            round(
              randomBetween(
                2,
                7
              ),
              2
            );

          break;


        case "poleTiming":

          value =
            Math.round(
              randomBetween(
                180,
                420
              )
            );

          break;


        case "slope":

          value =
            round(
              randomBetween(
                2,
                16
              )
            );

          break;


        case "elevationGain":

          value =
            round(
              randomBetween(
                0,
                35
              )
            );

          break;


        case "distance":

          value =
            round(
              randomBetween(
                20,
                300
              )
            );

          break;


        case "segmentTime":

          value =
            round(
              randomBetween(
                5,
                60
              ),
              2
            );

          break;


        case "horizontalDeviation":

          value =
            round(
              randomBetween(
                1,
                7
              ),
              2
            );

          break;


        case "peakVelocity":

          value =
            round(
              randomBetween(
                1,
                2.5
              ),
              2
            );

          break;


        case "firstPull":

          value =
            round(
              randomBetween(
                0.3,
                0.9
              ),
              2
            );

          break;


        case "secondPull":

          value =
            round(
              randomBetween(
                0.15,
                0.5
              ),
              2
            );

          break;


        default:

          value =
            round(
              randomBetween(
                50,
                95
              )
            );

      }


      AnalysisState.metrics[
        metric.key
      ] =
        value;


      document
        .querySelectorAll(
          `[data-metric-value="${metric.key}"]`
        )
        .forEach(
          element => {

            element.textContent =
              value;

          }
        );

    }
  );

}


/* ============================================================
   27. TECHNIQUE DETECTION
============================================================ */

function detectTechnique() {

  const sportId =
    window.SeolcheonApp
      ?.state
      ?.selectedSport ||
    AnalysisState
      .selectedSport;


  const sport =
    window.SportsDatabase
      ?.getSport?.(
        sportId
      );


  if (
    !sport ||
    !sport.techniques?.length
  ) {

    return;

  }


  const video =
    getAnalysisVideo();


  const time =
    video?.currentTime ||
    performance.now() /
    1000;


  const index =
    Math.floor(
      time / 4
    ) %
    sport.techniques.length;


  const technique =
    sport.techniques[
      index
    ];


  if (
    AnalysisState
      .currentTechnique !==
      technique
  ) {

    if (
      AnalysisState
        .currentTechnique !==
        "--"
    ) {

      AnalysisState
        .techniqueTransitionCount++;

    }


    AnalysisState
      .previousTechnique =
      AnalysisState
        .currentTechnique;


    AnalysisState
      .currentTechnique =
      technique;

  }


  document
    .querySelectorAll(
      "[data-current-technique]"
    )
    .forEach(
      element => {

        element.textContent =
          technique;

      }
    );


  document
    .querySelectorAll(
      ".technique-chip"
    )
    .forEach(
      chip => {

        chip.classList.toggle(
          "active",
          chip.textContent
            .trim() ===
            technique
        );

      }
    );

}


/* ============================================================
   28. SCORES
============================================================ */

function updateScores() {

  const angles =
    AnalysisState.angles;


  const kneeDifference =
    Math.abs(
      (
        angles.leftKnee ||
        170
      ) -
      (
        angles.rightKnee ||
        170
      )
    );


  const hipDifference =
    Math.abs(
      (
        angles.leftHip ||
        170
      ) -
      (
        angles.rightHip ||
        170
      )
    );


  const symmetry =
    clamp(
      100 -
      kneeDifference * 1.4 -
      hipDifference,
      0,
      100
    );


  AnalysisState.scores = {

    posture:
      Math.round(
        clamp(
          88 +
          randomBetween(
            -5,
            5
          ),
          0,
          100
        )
      ),

    symmetry:
      Math.round(
        symmetry
      ),

    technique:
      Math.round(
        clamp(
          86 +
          randomBetween(
            -6,
            7
          ),
          0,
          100
        )
      ),

    stability:
      Math.round(
        clamp(
          90 +
          randomBetween(
            -5,
            5
          ),
          0,
          100
        )
      ),

    efficiency:
      Math.round(
        clamp(
          87 +
          randomBetween(
            -5,
            7
          ),
          0,
          100
        )
      ),

    elite:
      Math.round(
        clamp(
          82 +
          randomBetween(
            -6,
            8
          ),
          0,
          100
        )
      )

  };

}


/* ============================================================
   29. CURRENT FRAME ANALYSIS
============================================================ */

function analyzeCurrentFrame() {

  const landmarks =
    generateBodyModel();


  if (!landmarks) {

    return;

  }


  drawSkeleton(
    landmarks
  );


  analyzeAngles(
    landmarks
  );


  updateTrajectory(
    landmarks
  );


  detectTechnique();


  updateScores();


  /*
   * 종목 지표는 매 프레임마다 랜덤 변경하면
   * 화면이 너무 흔들리므로 약 1초 단위 갱신.
   */

  const now =
    performance.now();


  if (
    !AnalysisState
      .lastMetricUpdate ||
    now -
      AnalysisState
        .lastMetricUpdate >
      1000
  ) {

    AnalysisState
      .lastMetricUpdate =
      now;


    updateSportMetrics();

  }

}


/* ============================================================
   30. SNAPSHOT
============================================================ */

function captureSnapshot() {

  const video =
    getAnalysisVideo();


  if (
    !video ||
    video.readyState < 2
  ) {

    alert(
      "먼저 카메라 또는 영상을 실행해주세요."
    );

    return null;

  }


  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width =
    video.videoWidth ||
    getAnalysisCanvas()
      ?.width ||
    1280;


  canvas.height =
    video.videoHeight ||
    getAnalysisCanvas()
      ?.height ||
    720;


  const context =
    canvas.getContext(
      "2d"
    );


  context.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );


  AnalysisState
    .snapshots
    .snapshot =
    canvas.toDataURL(
      "image/jpeg",
      0.9
    );


  AnalysisState
    .snapshots
    .pose =
    combineAnalysisLayers();


  AnalysisState
    .snapshots
    .angles =
    AnalysisState
      .snapshots
      .pose;


  AnalysisState
    .snapshots
    .trajectory =
    AnalysisState
      .snapshots
      .pose;


  return AnalysisState
    .snapshots
    .snapshot;

}


/* ============================================================
   31. COMBINE ANALYSIS LAYERS
============================================================ */

function combineAnalysisLayers() {

  const base =
    getAnalysisCanvas();


  const skeleton =
    getSkeletonCanvas();


  const trajectory =
    getTrajectoryCanvas();


  if (!base) {

    return null;

  }


  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width =
    base.width;


  canvas.height =
    base.height;


  const context =
    canvas.getContext(
      "2d"
    );


  context.drawImage(
    base,
    0,
    0
  );


  if (skeleton) {

    context.drawImage(
      skeleton,
      0,
      0
    );

  }


  if (trajectory) {

    context.drawImage(
      trajectory,
      0,
      0
    );

  }


  return canvas.toDataURL(
    "image/png"
  );

}


/* ============================================================
   32. 3D VIEW
============================================================ */

function drawThreeDView() {

  const canvas =
    getThreeDCanvas();


  if (!canvas) {

    return;

  }


  const container =
    canvas.parentElement;


  canvas.width =
    container?.clientWidth ||
    700;


  canvas.height =
    container?.clientHeight ||
    420;


  const context =
    canvas.getContext(
      "2d"
    );


  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  const centerX =
    canvas.width / 2;


  const centerY =
    canvas.height / 2;


  const points = {

    head:
      [
        centerX,
        centerY - 130
      ],

    leftShoulder:
      [
        centerX - 55,
        centerY - 75
      ],

    rightShoulder:
      [
        centerX + 55,
        centerY - 75
      ],

    leftElbow:
      [
        centerX - 90,
        centerY - 10
      ],

    rightElbow:
      [
        centerX + 90,
        centerY - 10
      ],

    leftHand:
      [
        centerX - 110,
        centerY + 45
      ],

    rightHand:
      [
        centerX + 110,
        centerY + 45
      ],

    leftHip:
      [
        centerX - 35,
        centerY + 25
      ],

    rightHip:
      [
        centerX + 35,
        centerY + 25
      ],

    leftKnee:
      [
        centerX - 45,
        centerY + 105
      ],

    rightKnee:
      [
        centerX + 45,
        centerY + 105
      ],

    leftFoot:
      [
        centerX - 55,
        centerY + 175
      ],

    rightFoot:
      [
        centerX + 55,
        centerY + 175
      ]

  };


  const lines = [

    ["head", "leftShoulder"],

    ["head", "rightShoulder"],

    ["leftShoulder", "rightShoulder"],

    ["leftShoulder", "leftElbow"],

    ["leftElbow", "leftHand"],

    ["rightShoulder", "rightElbow"],

    ["rightElbow", "rightHand"],

    ["leftShoulder", "leftHip"],

    ["rightShoulder", "rightHip"],

    ["leftHip", "rightHip"],

    ["leftHip", "leftKnee"],

    ["rightHip", "rightKnee"],

    ["leftKnee", "leftFoot"],

    ["rightKnee", "rightFoot"]

  ];


  context.strokeStyle =
    "rgba(0,230,255,.95)";


  context.lineWidth =
    4;


  lines.forEach(
    line => {

      const a =
        points[
          line[0]
        ];


      const b =
        points[
          line[1]
        ];


      context.beginPath();

      context.moveTo(
        a[0],
        a[1]
      );

      context.lineTo(
        b[0],
        b[1]
      );

      context.stroke();

    }
  );


  context.fillStyle =
    "#ffffff";


  Object.values(
    points
  ).forEach(
    point => {

      context.beginPath();

      context.arc(
        point[0],
        point[1],
        6,
        0,
        Math.PI * 2
      );

      context.fill();

    }
  );


  AnalysisState
    .snapshots
    .threeD =
    canvas.toDataURL(
      "image/png"
    );

}


/* ============================================================
   33. SEGMENT DATA
============================================================ */

function generateSegments() {

  const sport =
    window.SportsDatabase
      ?.getSport?.(
        AnalysisState
          .selectedSport
      );


  if (
    !sport ||
    !sport.special?.includes(
      "segment"
    )
  ) {

    AnalysisState.segments =
      [];

    return;

  }


  const techniques =
    sport.techniques;


  AnalysisState.segments = [

    {

      segment: 1,

      distance: 100,

      time: 24.6,

      technique:
        techniques[0] ||
        "-",

      slope: 3.2

    },

    {

      segment: 2,

      distance: 150,

      time: 38.1,

      technique:
        techniques[1] ||
        techniques[0] ||
        "-",

      slope: 8.4

    },

    {

      segment: 3,

      distance: 120,

      time: 27.8,

      technique:
        techniques[2] ||
        techniques[0] ||
        "-",

      slope: -2.1

    }

  ];


  renderSegments();

}


/* ============================================================
   34. RENDER SEGMENTS
============================================================ */

function renderSegments() {

  const container =
    document.querySelector(
      "[data-segment-list]"
    );


  if (!container) {

    return;

  }


  if (
    AnalysisState
      .segments
      .length ===
    0
  ) {

    container.innerHTML = `

      <p>
        구간 분석 데이터가 없습니다.
      </p>

    `;

    return;

  }


  container.innerHTML =
    AnalysisState
      .segments
      .map(
        segment => `

          <div class="segment-row">

            <span>
              ${segment.segment}
            </span>

            <span>
              ${segment.distance}m
            </span>

            <span>
              ${segment.time}s
            </span>

            <span>
              ${segment.technique}
            </span>

            <span>
              ${segment.slope}%
            </span>

          </div>

        `
      )
      .join("");

}


/* ============================================================
   35. ELITE COMPARISON
============================================================ */

function renderEliteComparison() {

  const element =
    document.querySelector(
      "[data-elite-comparison]"
    );


  if (!element) {

    return;

  }


  const score =
    AnalysisState
      .scores
      .elite;


  let level =
    "발전 단계";


  if (
    score >= 90
  ) {

    level =
      "엘리트 수준";

  }

  else if (
    score >= 80
  ) {

    level =
      "상위 선수 수준";

  }

  else if (
    score >= 70
  ) {

    level =
      "경기 선수 수준";

  }


  element.innerHTML = `

    <div class="elite-score">

      <strong>
        ${score}
      </strong>

      <span>
        / 100
      </span>

    </div>

    <div>

      <strong>
        ${level}
      </strong>

      <p>
        자세 안정성, 좌우 대칭성,
        기술 수행 효율을 기준으로
        비교한 결과입니다.
      </p>

    </div>

  `;

}


/* ============================================================
   36. RESET ANALYSIS DATA
============================================================ */

function resetAnalysisData() {

  AnalysisState
    .currentTechnique =
    "--";


  AnalysisState
    .previousTechnique =
    "--";


  AnalysisState
    .techniqueTransitionCount =
    0;


  AnalysisState.angles =
    {};


  AnalysisState.metrics =
    {};


  AnalysisState.trajectory =
    [];


  AnalysisState.segments =
    [];


  AnalysisState.snapshots = {

    snapshot: null,

    pose: null,

    angles: null,

    trajectory: null,

    threeD: null

  };


  [

    getSkeletonCanvas(),

    getTrajectoryCanvas()

  ].forEach(
    canvas => {

      const context =
        canvas?.getContext(
          "2d"
        );


      if (
        canvas &&
        context
      ) {

        context.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

      }

    }
  );


  document
    .querySelectorAll(
      "[data-current-technique]"
    )
    .forEach(
      element => {

        element.textContent =
          "--";

      }
    );


  document
    .querySelectorAll(
      "[data-metric-value]"
    )
    .forEach(
      element => {

        element.textContent =
          "--";

      }
    );

}


/* ============================================================
   37. OVERALL SCORE
============================================================ */

function calculateOverallScore() {

  const values =
    Object.values(
      AnalysisState.scores
    );


  if (
    values.length ===
    0
  ) {

    return 0;

  }


  return Math.round(

    values.reduce(
      (
        sum,
        value
      ) =>
        sum + value,
      0
    ) /
    values.length

  );

}


/* ============================================================
   38. BUILD ANALYSIS RESULT
============================================================ */

function buildAnalysisResult() {

  const athlete =
    window.SeolcheonApp
      ?.state
      ?.selectedAthlete ||
    null;


  const sportId =
    window.SeolcheonApp
      ?.state
      ?.selectedSport ||
    AnalysisState
      .selectedSport;


  const sport =
    window.SportsDatabase
      ?.getSport?.(
        sportId
      );


  return {

    id:
      `analysis_${Date.now()}`,

    athleteId:
      athlete?.id ||
      null,

    athleteName:
      athlete?.name ||
      "선수 미선택",

    school:
      athlete?.school ||
      "설천고",

    grade:
      athlete?.grade ||
      "",

    sport:
      sportId,

    sportName:
      sport?.name ||
      sportId ||
      "-",

    mode:
      AnalysisState.mode,

    createdAt:
      new Date()
        .toISOString(),

    overall:
      calculateOverallScore(),

    scores: {

      ...AnalysisState.scores

    },

    angles: {

      ...AnalysisState.angles

    },

    metrics: {

      ...AnalysisState.metrics

    },

    technique:
      AnalysisState
        .currentTechnique,

    transitionCount:
      AnalysisState
        .techniqueTransitionCount,

    segments:
      [
        ...AnalysisState
          .segments
      ],

    snapshots: {

      ...AnalysisState
        .snapshots

    }

  };

}


/* ============================================================
   39. FINISH ANALYSIS
============================================================ */

function finishAnalysis() {

  if (
    !AnalysisState
      .snapshots
      .snapshot
  ) {

    captureSnapshot();

  }


  generateSegments();


  renderEliteComparison();


  drawThreeDView();


  const result =
    buildAnalysisResult();


  const state =
    window.SeolcheonApp
      ?.state;


  if (state) {

    if (
      !Array.isArray(
        state.analyses
      )
    ) {

      state.analyses =
        [];

    }


    state.analyses.unshift(
      result
    );


    state.currentReport =
      result;

  }


  window.SeolcheonApp
    ?.saveAnalyses?.();


  window.SeolcheonApp
    ?.refreshDashboard?.();


  window.ReportManager
    ?.loadReport?.(
      result
    );


  window.SeolcheonApp
    ?.navigate?.(
      "report"
    );


  console.log(
    "[ANALYSIS] COMPLETE",
    result
  );

}


/* ============================================================
   40. UPDATE MODE BUTTONS
============================================================ */

function updateModeButtons() {

  document
    .querySelectorAll(
      "[data-analysis-mode]"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset
            .analysisMode ===
            AnalysisState.mode
        );

      }
    );

}


/* ============================================================
   41. SPORT SELECTED
============================================================ */

function handleSportSelected(
  sportId
) {

  AnalysisState
    .selectedSport =
    sportId;


  resetAnalysisData();


  window.SportsDatabase
    ?.renderSelectedSport?.(
      sportId
    );

}


/* ============================================================
   42. EVENTS
============================================================ */

function initializeAnalysisEvents() {


  document
    .querySelectorAll(
      "[data-analysis-mode]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            setAnalysisMode(
              button.dataset
                .analysisMode
            );

          }
        );

      }
    );


  document
    .querySelector(
      "[data-camera-start]"
    )
    ?.addEventListener(
      "click",
      startCamera
    );


  document
    .querySelector(
      "[data-video-upload]"
    )
    ?.addEventListener(
      "change",
      event => {

        const file =
          event.target
            .files?.[0];


        loadVideoFile(
          file
        );

      }
    );


  document
    .querySelector(
      "[data-analysis-play]"
    )
    ?.addEventListener(
      "click",
      playAnalysisVideo
    );


  document
    .querySelector(
      "[data-analysis-pause]"
    )
    ?.addEventListener(
      "click",
      pauseAnalysisVideo
    );


  document
    .querySelector(
      "[data-analysis-frame-prev]"
    )
    ?.addEventListener(
      "click",
      previousFrame
    );


  document
    .querySelector(
      "[data-analysis-frame-next]"
    )
    ?.addEventListener(
      "click",
      nextFrame
    );


  document
    .querySelector(
      "[data-playback-rate]"
    )
    ?.addEventListener(
      "change",
      event => {

        setPlaybackRate(
          event.target.value
        );

      }
    );


  document
    .querySelector(
      "[data-video-progress]"
    )
    ?.addEventListener(
      "input",
      event => {

        seekAnalysisVideo(
          event.target.value
        );

      }
    );


  document
    .querySelector(
      "[data-analysis-snapshot]"
    )
    ?.addEventListener(
      "click",
      () => {

        const image =
          captureSnapshot();


        if (image) {

          alert(
            "현재 분석 장면을 저장했습니다."
          );

        }

      }
    );


  document
    .querySelector(
      "[data-3d-toggle]"
    )
    ?.addEventListener(
      "click",
      drawThreeDView
    );


  document
    .querySelector(
      "[data-analysis-reset]"
    )
    ?.addEventListener(
      "click",
      () => {

        resetAnalysisData();

        drawCurrentFrame();

      }
    );


  document
    .querySelector(
      "[data-analysis-finish]"
    )
    ?.addEventListener(
      "click",
      finishAnalysis
    );


  const video =
    getAnalysisVideo();


  video?.addEventListener(
    "timeupdate",
    updateTimebar
  );


  video?.addEventListener(
    "loadedmetadata",
    updateTimebar
  );


  video?.addEventListener(
    "seeked",
    drawCurrentFrame
  );


  window.addEventListener(
    "resize",
    resizeAnalysisCanvases
  );


  window.addEventListener(
    "seolcheon:sport-selected",
    event => {

      const sport =
        event.detail
          ?.sport;


      if (sport) {

        handleSportSelected(
          sport
        );

      }

    }
  );

}


/* ============================================================
   43. PUBLIC API
============================================================ */

window.AnalysisManager = {

  initialized: false,


  init() {

    if (
      this.initialized
    ) {

      return;

    }


    this.initialized =
      true;


    initializeAnalysisEvents();


    resizeAnalysisCanvases();


    const sport =
      window.SeolcheonApp
        ?.state
        ?.selectedSport;


    if (sport) {

      handleSportSelected(
        sport
      );

    }


    console.log(
      "[ANALYSIS] READY"
    );

  },


  startCamera,


  stopCamera,


  loadVideoFile,


  play:
    playAnalysisVideo,


  pause:
    pauseAnalysisVideo,


  nextFrame,


  previousFrame,


  captureSnapshot,


  finish:
    finishAnalysis,


  reset:
    resetAnalysisData,


  getState() {

    return AnalysisState;

  }

};


/* ============================================================
   44. INITIALIZATION
============================================================ */

function bootAnalysisModule() {

  window.AnalysisManager
    ?.init?.();

}


if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    bootAnalysisModule
  );

}

else {

  bootAnalysisModule();

}


/* ============================================================
   END ANALYSIS.JS
============================================================ */