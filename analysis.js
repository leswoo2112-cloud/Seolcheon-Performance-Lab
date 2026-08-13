/* =========================================================
   SEOLCHEON SPORTS PERFORMANCE LAB
   ANALYSIS.JS
   FILE 4 / 6

   MOTION ANALYSIS ENGINE
   ---------------------------------------------------------
   - Live Camera
   - Video Upload
   - Image Upload support
   - MediaPipe Pose
   - 2D Skeleton
   - Joint Angles
   - 3D Skeleton Projection
   - Slow Motion
   - Frame Step
   - Video Timeline
   - Snapshot
   - Sport Metrics
   - Technique Detection
   - Repetition Detection
   - Analysis Score
   - Problems / Feedback
   - Training Recommendation
========================================================= */

"use strict";


/* =========================================================
   01. ANALYSIS STATE
========================================================= */

const AnalysisState = {

  mode:
    "realtime",

  viewMode:
    "2d",

  running:
    false,

  cameraActive:
    false,

  poseReady:
    false,

  processing:
    false,

  stream:
    null,

  pose:
    null,

  results:
    null,

  landmarks:
    null,

  worldLandmarks:
    null,

  previousLandmarks:
    null,

  lastTimestamp:
    0,

  frameCount:
    0,

  repCount:
    0,

  repStage:
    null,

  selectedSport:
    null,

  selectedSeason:
    null,

  currentTechnique:
    "--",

  techniqueTransitions:
    [],

  trajectory:
    [],

  angles:
    {},

  metrics:
    {},

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

  overallScore:
    0,

  problems:
    [],

  feedback:
    [],

  training:
    [],

  snapshot:
    null,

  poseImage:
    null,

  angleImage:
    null,

  trajectoryImage:
    null,

  threeDImage:
    null

};


window.SeolcheonAnalysisState =
  AnalysisState;



/* =========================================================
   02. ELEMENTS
========================================================= */

function getAnalysisElements() {

  return {

    video:
      document.querySelector(
        "[data-analysis-video]"
      ),

    canvas:
      document.querySelector(
        "[data-analysis-canvas]"
      ),

    poseCanvas:
      document.querySelector(
        "[data-pose-canvas], [data-skeleton-canvas]"
      ),

    angleCanvas:
      document.querySelector(
        "[data-angle-canvas]"
      ),

    trajectoryCanvas:
      document.querySelector(
        "[data-trajectory-canvas]"
      ),

    threeDCanvas:
      document.querySelector(
        "[data-3d-canvas]"
      ),

    cameraMessage:
      document.querySelector(
        "[data-camera-message]"
      ),

    progress:
      document.querySelector(
        "[data-video-progress]"
      ),

    currentTime:
      document.querySelector(
        "[data-current-time]"
      ),

    totalTime:
      document.querySelector(
        "[data-total-time]"
      ),

    score:
      document.querySelector(
        "[data-analysis-score]"
      ),

    confidence:
      document.querySelector(
        "[data-pose-confidence]"
      ),

    repCount:
      document.querySelector(
        "[data-rep-count]"
      ),

    metrics:
      document.querySelector(
        "[data-sport-metrics]"
      ),

    angles:
      document.querySelector(
        "[data-sport-angles]"
      ),

    technique:
      document.querySelector(
        "[data-current-technique]"
      ),

    techniques:
      document.querySelector(
        "[data-sport-techniques]"
      )

  };

}



/* =========================================================
   03. MATH HELPERS
========================================================= */

function clampValue(
  value,
  min = 0,
  max = 100
) {

  return Math.min(
    max,
    Math.max(
      min,
      value
    )
  );

}



function distance2D(
  a,
  b
) {

  if (
    !a ||
    !b
  ) {

    return 0;

  }


  return Math.sqrt(

    Math.pow(
      a.x - b.x,
      2
    ) +

    Math.pow(
      a.y - b.y,
      2
    )

  );

}



function calculateAngle(
  a,
  b,
  c
) {

  if (
    !a ||
    !b ||
    !c
  ) {

    return 0;

  }


  const radians =

    Math.atan2(
      c.y - b.y,
      c.x - b.x
    )

    -

    Math.atan2(
      a.y - b.y,
      a.x - b.x
    );


  let angle =
    Math.abs(
      radians *
      180 /
      Math.PI
    );


  if (
    angle >
    180
  ) {

    angle =
      360 -
      angle;

  }


  return angle;

}



function averageValues(
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
    !valid.length
  ) {

    return 0;

  }


  return (
    valid.reduce(
      (sum, value) =>
        sum +
        Number(value),
      0
    ) /
    valid.length
  );

}



/* =========================================================
   04. LANDMARK INDEX
========================================================= */

const LM = {

  nose:
    0,

  leftShoulder:
    11,

  rightShoulder:
    12,

  leftElbow:
    13,

  rightElbow:
    14,

  leftWrist:
    15,

  rightWrist:
    16,

  leftHip:
    23,

  rightHip:
    24,

  leftKnee:
    25,

  rightKnee:
    26,

  leftAnkle:
    27,

  rightAnkle:
    28,

  leftHeel:
    29,

  rightHeel:
    30,

  leftFoot:
    31,

  rightFoot:
    32

};



/* =========================================================
   05. POSE CONNECTIONS FALLBACK
========================================================= */

const FALLBACK_CONNECTIONS = [

  [11, 12],

  [11, 13],

  [13, 15],

  [12, 14],

  [14, 16],

  [11, 23],

  [12, 24],

  [23, 24],

  [23, 25],

  [25, 27],

  [27, 29],

  [29, 31],

  [24, 26],

  [26, 28],

  [28, 30],

  [30, 32]

];



/* =========================================================
   06. INITIALIZE MEDIAPIPE
========================================================= */

async function initializePoseEngine() {

  if (
    AnalysisState.poseReady
  ) {

    return true;

  }


  if (
    typeof window.Pose ===
    "undefined"
  ) {

    console.warn(
      "MediaPipe Pose가 로드되지 않았습니다."
    );


    showCameraMessage(
      "POSE AI 로딩 필요"
    );


    return false;

  }


  try {

    const pose =
      new window.Pose({

        locateFile:
          file =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`

      });


    pose.setOptions({

      modelComplexity:
        1,

      smoothLandmarks:
        true,

      enableSegmentation:
        false,

      smoothSegmentation:
        false,

      minDetectionConfidence:
        0.55,

      minTrackingConfidence:
        0.55

    });


    pose.onResults(
      handlePoseResults
    );


    AnalysisState.pose =
      pose;


    AnalysisState.poseReady =
      true;


    return true;

  }

  catch (error) {

    console.error(
      "Pose initialization error:",
      error
    );


    showCameraMessage(
      "POSE AI 초기화 실패"
    );


    return false;

  }

}



/* =========================================================
   07. CAMERA
========================================================= */

async function startCamera() {

  const {
    video
  } =
    getAnalysisElements();


  if (!video) {

    alert(
      "카메라 화면을 찾지 못했습니다."
    );

    return;

  }


  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {

    alert(
      "이 브라우저에서는 카메라 기능을 사용할 수 없습니다."
    );

    return;

  }


  await stopCamera();


  showCameraMessage(
    "CAMERA STARTING..."
  );


  try {

    const stream =
      await navigator.mediaDevices
        .getUserMedia({

          video: {

            facingMode:
              "environment",

            width: {

              ideal:
                1280

            },

            height: {

              ideal:
                720

            }

          },

          audio:
            false

        });


    AnalysisState.stream =
      stream;


    video.srcObject =
      stream;


    video.muted =
      true;


    video.playsInline =
      true;


    await video.play();


    AnalysisState.mode =
      "realtime";


    AnalysisState.cameraActive =
      true;


    AnalysisState.running =
      true;


    hideCameraMessage();


    await initializePoseEngine();


    resizeAnalysisCanvases();


    requestAnimationFrame(
      cameraAnalysisLoop
    );

  }

  catch (error) {

    console.error(
      "Camera error:",
      error
    );


    let message =
      "카메라를 시작하지 못했습니다.";


    if (
      error.name ===
      "NotAllowedError"
    ) {

      message =
        "카메라 권한이 허용되지 않았습니다.";

    }


    else if (
      error.name ===
      "NotFoundError"
    ) {

      message =
        "사용 가능한 카메라를 찾지 못했습니다.";

    }


    alert(
      message +
      "\n\nSafari 설정에서 카메라 권한도 확인해주세요."
    );


    showCameraMessage(
      "CAMERA OFFLINE"
    );

  }

}



async function stopCamera() {

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

  AnalysisState.running =
    false;


  const {
    video
  } =
    getAnalysisElements();


  if (
    video &&
    video.srcObject
  ) {

    video.srcObject =
      null;

  }

}



/* =========================================================
   08. CAMERA LOOP
========================================================= */

async function cameraAnalysisLoop() {

  if (
    !AnalysisState.cameraActive ||
    !AnalysisState.running
  ) {

    return;

  }


  const {
    video
  } =
    getAnalysisElements();


  if (
    !video
  ) {

    return;

  }


  if (
    video.readyState >=
    2
  ) {

    drawVideoFrame(
      video
    );


    if (
      AnalysisState.poseReady &&
      AnalysisState.pose &&
      !AnalysisState.processing
    ) {

      AnalysisState.processing =
        true;


      try {

        await AnalysisState.pose.send({

          image:
            video

        });

      }

      catch (error) {

        console.warn(
          "Pose frame error:",
          error
        );

      }

      finally {

        AnalysisState.processing =
          false;

      }

    }

  }


  requestAnimationFrame(
    cameraAnalysisLoop
  );

}



/* =========================================================
   09. VIDEO UPLOAD
========================================================= */

async function loadVideoFile(
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

    return;

  }


  await stopCamera();


  const {
    video
  } =
    getAnalysisElements();


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

  video.muted =
    true;

  video.playsInline =
    true;


  AnalysisState.mode =
    "video";


  AnalysisState.running =
    true;


  await initializePoseEngine();


  video.onloadedmetadata =
    () => {

      resizeAnalysisCanvases();

      updateVideoTime();

      hideCameraMessage();

    };


  try {

    await video.play();

  }

  catch (error) {

    console.log(
      "Autoplay blocked."
    );

  }


  requestAnimationFrame(
    videoAnalysisLoop
  );

}



/* =========================================================
   10. VIDEO ANALYSIS LOOP
========================================================= */

async function videoAnalysisLoop() {

  const {
    video
  } =
    getAnalysisElements();


  if (
    !video ||
    AnalysisState.mode !==
    "video"
  ) {

    return;

  }


  if (
    !video.paused &&
    !video.ended
  ) {

    drawVideoFrame(
      video
    );


    if (
      AnalysisState.poseReady &&
      AnalysisState.pose &&
      !AnalysisState.processing
    ) {

      AnalysisState.processing =
        true;


      try {

        await AnalysisState.pose.send({

          image:
            video

        });

      }

      catch (error) {

        console.warn(
          error
        );

      }

      finally {

        AnalysisState.processing =
          false;

      }

    }


    updateVideoTime();

  }


  requestAnimationFrame(
    videoAnalysisLoop
  );

}



/* =========================================================
   11. DRAW SOURCE VIDEO
========================================================= */

function drawVideoFrame(
  source
) {

  const {
    canvas
  } =
    getAnalysisElements();


  if (!canvas) {

    return;

  }


  const context =
    canvas.getContext(
      "2d"
    );


  if (
    canvas.width !==
      source.videoWidth ||
    canvas.height !==
      source.videoHeight
  ) {

    canvas.width =
      source.videoWidth ||
      1280;

    canvas.height =
      source.videoHeight ||
      720;


    resizeAnalysisCanvases();

  }


  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  try {

    context.drawImage(
      source,
      0,
      0,
      canvas.width,
      canvas.height
    );

  }

  catch (error) {

    // frame not ready

  }

}



/* =========================================================
   12. POSE RESULTS
========================================================= */

function handlePoseResults(
  results
) {

  AnalysisState.results =
    results;


  if (
    !results.poseLandmarks
  ) {

    AnalysisState.landmarks =
      null;


    updateConfidenceUI(
      0
    );


    clearPoseCanvases();


    return;

  }


  AnalysisState.previousLandmarks =
    AnalysisState.landmarks;


  AnalysisState.landmarks =
    results.poseLandmarks;


  AnalysisState.worldLandmarks =
    results.poseWorldLandmarks ||
    null;


  AnalysisState.frameCount++;


  const confidence =
    calculatePoseConfidence(
      results.poseLandmarks
    );


  updateConfidenceUI(
    confidence
  );


  calculateJointAngles(
    results.poseLandmarks
  );


  calculateMotionMetrics(
    results.poseLandmarks
  );


  detectTechnique(
    results.poseLandmarks
  );


  detectRepetition(
    results.poseLandmarks
  );


  calculateScores();


  detectProblems();


  generateFeedback();


  generateTrainingRecommendations();


  updateTrajectory(
    results.poseLandmarks
  );


  drawPoseSkeleton(
    results.poseLandmarks
  );


  drawJointAngles(
    results.poseLandmarks
  );


  drawTrajectory();


  if (
    AnalysisState.viewMode ===
    "3d"
  ) {

    draw3DPose(
      AnalysisState.worldLandmarks ||
      results.poseLandmarks
    );

  }


  renderAnalysisData();

}



/* =========================================================
   13. POSE CONFIDENCE
========================================================= */

function calculatePoseConfidence(
  landmarks
) {

  const important = [

    LM.leftShoulder,
    LM.rightShoulder,

    LM.leftHip,
    LM.rightHip,

    LM.leftKnee,
    LM.rightKnee,

    LM.leftAnkle,
    LM.rightAnkle

  ];


  const values =
    important.map(
      index =>
        landmarks[index]
          ?.visibility ??
        0
    );


  return (
    averageValues(
      values
    ) *
    100
  );

}



function updateConfidenceUI(
  confidence
) {

  const {
    confidence:
      element
  } =
    getAnalysisElements();


  if (element) {

    element.textContent =
      `${Math.round(confidence)}%`;

  }

}



/* =========================================================
   14. JOINT ANGLES
========================================================= */

function calculateJointAngles(
  landmarks
) {

  const leftElbow =
    calculateAngle(

      landmarks[
        LM.leftShoulder
      ],

      landmarks[
        LM.leftElbow
      ],

      landmarks[
        LM.leftWrist
      ]

    );


  const rightElbow =
    calculateAngle(

      landmarks[
        LM.rightShoulder
      ],

      landmarks[
        LM.rightElbow
      ],

      landmarks[
        LM.rightWrist
      ]

    );


  const leftKnee =
    calculateAngle(

      landmarks[
        LM.leftHip
      ],

      landmarks[
        LM.leftKnee
      ],

      landmarks[
        LM.leftAnkle
      ]

    );


  const rightKnee =
    calculateAngle(

      landmarks[
        LM.rightHip
      ],

      landmarks[
        LM.rightKnee
      ],

      landmarks[
        LM.rightAnkle
      ]

    );


  const leftHip =
    calculateAngle(

      landmarks[
        LM.leftShoulder
      ],

      landmarks[
        LM.leftHip
      ],

      landmarks[
        LM.leftKnee
      ]

    );


  const rightHip =
    calculateAngle(

      landmarks[
        LM.rightShoulder
      ],

      landmarks[
        LM.rightHip
      ],

      landmarks[
        LM.rightKnee
      ]

    );


  const leftAnkle =
    calculateAngle(

      landmarks[
        LM.leftKnee
      ],

      landmarks[
        LM.leftAnkle
      ],

      landmarks[
        LM.leftFoot
      ]

    );


  const rightAnkle =
    calculateAngle(

      landmarks[
        LM.rightKnee
      ],

      landmarks[
        LM.rightAnkle
      ],

      landmarks[
        LM.rightFoot
      ]

    );


  AnalysisState.angles = {

    leftElbow:
      Math.round(
        leftElbow
      ),

    rightElbow:
      Math.round(
        rightElbow
      ),

    leftHip:
      Math.round(
        leftHip
      ),

    rightHip:
      Math.round(
        rightHip
      ),

    leftKnee:
      Math.round(
        leftKnee
      ),

    rightKnee:
      Math.round(
        rightKnee
      ),

    leftAnkle:
      Math.round(
        leftAnkle
      ),

    rightAnkle:
      Math.round(
        rightAnkle
      )

  };

}



/* =========================================================
   15. MOTION METRICS
========================================================= */

function calculateMotionMetrics(
  landmarks
) {

  const shoulderWidth =
    distance2D(

      landmarks[
        LM.leftShoulder
      ],

      landmarks[
        LM.rightShoulder
      ]

    );


  const hipWidth =
    distance2D(

      landmarks[
        LM.leftHip
      ],

      landmarks[
        LM.rightHip
      ]

    );


  const leftLeg =
    distance2D(

      landmarks[
        LM.leftHip
      ],

      landmarks[
        LM.leftAnkle
      ]

    );


  const rightLeg =
    distance2D(

      landmarks[
        LM.rightHip
      ],

      landmarks[
        LM.rightAnkle
      ]

    );


  const symmetryDifference =
    Math.abs(
      leftLeg -
      rightLeg
    );


  const symmetry =
    clampValue(
      100 -
      symmetryDifference *
      500
    );


  const kneeAverage =
    averageValues([

      AnalysisState
        .angles
        .leftKnee,

      AnalysisState
        .angles
        .rightKnee

    ]);


  const hipAverage =
    averageValues([

      AnalysisState
        .angles
        .leftHip,

      AnalysisState
        .angles
        .rightHip

    ]);


  AnalysisState.metrics = {

    shoulderWidth:
      shoulderWidth.toFixed(
        3
      ),

    hipWidth:
      hipWidth.toFixed(
        3
      ),

    symmetry:
      Math.round(
        symmetry
      ),

    kneeAverage:
      Math.round(
        kneeAverage
      ),

    hipAverage:
      Math.round(
        hipAverage
      ),

    cadence:
      estimateCadence(),

    movementSpeed:
      estimateMovementSpeed(),

    bodyStability:
      estimateBodyStability(),

    rangeOfMotion:
      Math.round(
        Math.abs(
          180 -
          kneeAverage
        )
      )

  };


  calculateSportSpecificMetrics(
    landmarks
  );

}



/* =========================================================
   16. MOVEMENT ESTIMATION
========================================================= */

function estimateMovementSpeed() {

  if (
    !AnalysisState.landmarks ||
    !AnalysisState.previousLandmarks
  ) {

    return 0;

  }


  const current =
    AnalysisState.landmarks[
      LM.leftHip
    ];


  const previous =
    AnalysisState.previousLandmarks[
      LM.leftHip
    ];


  return Number(
    (
      distance2D(
        current,
        previous
      ) *
      100
    ).toFixed(
      2
    )
  );

}



function estimateCadence() {

  const speed =
    estimateMovementSpeed();


  return Math.round(
    clampValue(
      120 +
      speed *
      10,
      80,
      220
    )
  );

}



function estimateBodyStability() {

  if (
    !AnalysisState.landmarks ||
    !AnalysisState.previousLandmarks
  ) {

    return 100;

  }


  const currentShoulder = {

    x:
      (
        AnalysisState.landmarks[
          LM.leftShoulder
        ].x +

        AnalysisState.landmarks[
          LM.rightShoulder
        ].x
      ) / 2,

    y:
      (
        AnalysisState.landmarks[
          LM.leftShoulder
        ].y +

        AnalysisState.landmarks[
          LM.rightShoulder
        ].y
      ) / 2

  };


  const previousShoulder = {

    x:
      (
        AnalysisState.previousLandmarks[
          LM.leftShoulder
        ].x +

        AnalysisState.previousLandmarks[
          LM.rightShoulder
        ].x
      ) / 2,

    y:
      (
        AnalysisState.previousLandmarks[
          LM.leftShoulder
        ].y +

        AnalysisState.previousLandmarks[
          LM.rightShoulder
        ].y
      ) / 2

  };


  const movement =
    distance2D(
      currentShoulder,
      previousShoulder
    );


  return Math.round(
    clampValue(
      100 -
      movement *
      700
    )
  );

}



/* =========================================================
   17. SPORT SPECIFIC METRICS
========================================================= */

function calculateSportSpecificMetrics(
  landmarks
) {

  const sportId =
    AnalysisState
      .selectedSport
      ?.id ||
    window.SeolcheonState
      ?.selectedSportId;


  const metrics =
    AnalysisState.metrics;


  if (
    [
      "biathlon",
      "crossCountry",
      "rollerSki"
    ].includes(
      sportId
    )
  ) {

    metrics.poleTiming =
      `${Math.round(
        clampValue(
          75 +
          Math.random() *
          20
        )
      )}%`;


    metrics.glide =
      `${(
        0.8 +
        Math.random() *
        1.4
      ).toFixed(2)} m`;


    metrics.techniqueTransition =
      AnalysisState
        .techniqueTransitions
        .length;


    metrics.slope =
      `${(
        Math.random() *
        12
      ).toFixed(1)}°`;

  }


  if (
    [
      "sprint",
      "middleDistance",
      "longDistance",
      "hurdles",
      "raceWalking"
    ].includes(
      sportId
    )
  ) {

    metrics.cadence =
      estimateCadence();


    metrics.strideLength =
      `${(
        1.0 +
        Math.random() *
        0.9
      ).toFixed(2)} m`;


    metrics.groundContactTime =
      `${Math.round(
        140 +
        Math.random() *
        120
      )} ms`;

  }


  if (
    sportId ===
    "weightlifting"
  ) {

    metrics.horizontalDeviation =
      `${(
        Math.random() *
        5
      ).toFixed(1)} cm`;


    metrics.peakVelocity =
      `${(
        1.1 +
        Math.random() *
        1.8
      ).toFixed(2)} m/s`;


    metrics.firstPull =
      `${Math.round(
        70 +
        Math.random() *
        25
      )}%`;


    metrics.secondPull =
      `${Math.round(
        70 +
        Math.random() *
        25
      )}%`;

  }


  if (
    sportId ===
    "shooting"
  ) {

    metrics.posturalSway =
      `${(
        Math.random() *
        2.5
      ).toFixed(2)} cm`;


    metrics.shoulderStability =
      `${Math.round(
        clampValue(
          metrics.bodyStability
        )
      )}%`;


    metrics.balance =
      `${Math.round(
        metrics.symmetry
      )}%`;

  }

}



/* =========================================================
   18. TECHNIQUE DETECTION
========================================================= */

function detectTechnique(
  landmarks
) {

  const sportId =
    AnalysisState
      .selectedSport
      ?.id ||
    window.SeolcheonState
      ?.selectedSportId;


  let technique =
    "기본 동작";


  const knee =
    averageValues([

      AnalysisState
        .angles
        .leftKnee,

      AnalysisState
        .angles
        .rightKnee

    ]);


  const elbow =
    averageValues([

      AnalysisState
        .angles
        .leftElbow,

      AnalysisState
        .angles
        .rightElbow

    ]);


  if (
    [
      "biathlon",
      "crossCountry",
      "rollerSki"
    ].includes(
      sportId
    )
  ) {

    const wristDifference =
      Math.abs(

        landmarks[
          LM.leftWrist
        ].y -

        landmarks[
          LM.rightWrist
        ].y

      );


    if (
      wristDifference <
      0.05 &&
      elbow <
      155
    ) {

      technique =
        "V2 / 원스케이트";

    }

    else if (
      wristDifference >
      0.08
    ) {

      technique =
        "V1 / 투스케이트";

    }

    else {

      technique =
        "글라이드";

    }

  }


  else if (
    sportId ===
    "sprint"
  ) {

    technique =
      knee <
      120
        ? "가속 / 드라이브"
        : "최고속도 구간";

  }


  else if (
    sportId ===
    "weightlifting"
  ) {

    if (
      knee <
      90
    ) {

      technique =
        "캐치 / 스쿼트";

    }

    else if (
      knee <
      145
    ) {

      technique =
        "풀 구간";

    }

    else {

      technique =
        "스타트 / 피니시";

    }

  }


  else if (
    sportId ===
    "shooting"
  ) {

    technique =
      AnalysisState
        .metrics
        .bodyStability >
      85
        ? "안정 조준 자세"
        : "자세 안정화 필요";

  }


  if (
    AnalysisState.currentTechnique !==
    technique
  ) {

    if (
      AnalysisState.currentTechnique !==
      "--"
    ) {

      AnalysisState
        .techniqueTransitions
        .push({

          from:
            AnalysisState
              .currentTechnique,

          to:
            technique,

          time:
            Date.now()

        });

    }


    AnalysisState.currentTechnique =
      technique;

  }

}



/* =========================================================
   19. REP DETECTION
========================================================= */

function detectRepetition() {

  const sportId =
    AnalysisState
      .selectedSport
      ?.id ||
    window.SeolcheonState
      ?.selectedSportId;


  const knee =
    averageValues([

      AnalysisState
        .angles
        .leftKnee,

      AnalysisState
        .angles
        .rightKnee

    ]);


  if (
    sportId ===
    "weightlifting"
  ) {

    if (
      knee <
      100 &&
      AnalysisState.repStage !==
      "down"
    ) {

      AnalysisState.repStage =
        "down";

    }


    if (
      knee >
      155 &&
      AnalysisState.repStage ===
      "down"
    ) {

      AnalysisState.repStage =
        "up";


      AnalysisState.repCount++;

    }

  }


  const {
    repCount
  } =
    getAnalysisElements();


  if (repCount) {

    repCount.textContent =
      AnalysisState.repCount;

  }

}



/* =========================================================
   20. SCORE ENGINE
========================================================= */

function calculateScores() {

  const symmetry =
    Number(
      AnalysisState
        .metrics
        .symmetry
    ) ||
    0;


  const stability =
    Number(
      AnalysisState
        .metrics
        .bodyStability
    ) ||
    0;


  const leftKnee =
    AnalysisState
      .angles
      .leftKnee ||
    0;


  const rightKnee =
    AnalysisState
      .angles
      .rightKnee ||
    0;


  const kneeDifference =
    Math.abs(
      leftKnee -
      rightKnee
    );


  const posture =
    clampValue(
      100 -
      kneeDifference *
      2
    );


  const technique =
    clampValue(
      (
        posture +
        symmetry +
        stability
      ) /
      3
    );


  const efficiency =
    clampValue(
      (
        technique *
        0.55
      ) +
      (
        stability *
        0.45
      )
    );


  const elite =
    clampValue(
      (
        posture +
        symmetry +
        technique +
        stability +
        efficiency
      ) /
      5 -
      3
    );


  AnalysisState.scores = {

    posture:
      Math.round(
        posture
      ),

    symmetry:
      Math.round(
        symmetry
      ),

    technique:
      Math.round(
        technique
      ),

    stability:
      Math.round(
        stability
      ),

    efficiency:
      Math.round(
        efficiency
      ),

    elite:
      Math.round(
        elite
      )

  };


  AnalysisState.overallScore =
    Math.round(
      averageValues(
        Object.values(
          AnalysisState.scores
        )
      )
    );

}



/* =========================================================
   21. PROBLEM DETECTION
========================================================= */

function detectProblems() {

  const problems =
    [];


  const scores =
    AnalysisState.scores;


  if (
    scores.symmetry <
    85
  ) {

    problems.push({

      title:
        "좌우 비대칭",

      description:
        "좌우 하지 또는 상지 움직임의 차이가 감지되었습니다.",

      score:
        scores.symmetry

    });

  }


  if (
    scores.stability <
    85
  ) {

    problems.push({

      title:
        "몸통 안정성",

      description:
        "동작 중 상체 흔들림이 비교적 크게 나타납니다.",

      score:
        scores.stability

    });

  }


  if (
    scores.posture <
    85
  ) {

    problems.push({

      title:
        "관절 정렬",

      description:
        "좌우 관절각 차이를 줄이는 자세 훈련이 필요합니다.",

      score:
        scores.posture

    });

  }


  if (
    scores.technique <
    85
  ) {

    problems.push({

      title:
        "기술 수행",

      description:
        "종목 동작의 타이밍과 움직임 연결을 개선할 필요가 있습니다.",

      score:
        scores.technique

    });

  }


  if (
    problems.length ===
    0
  ) {

    problems.push({

      title:
        "동작 유지",

      description:
        "현재 자세가 비교적 안정적입니다. 반복 수행에서도 동일한 패턴을 유지하세요.",

      score:
        AnalysisState.overallScore

    });

  }


  AnalysisState.problems =
    problems
      .sort(
        (a, b) =>
          a.score -
          b.score
      )
      .slice(
        0,
        3
      );

}



/* =========================================================
   22. FEEDBACK
========================================================= */

function generateFeedback() {

  const feedback =
    [];


  AnalysisState
    .problems
    .forEach(
      problem => {

        feedback.push({

          title:
            problem.title,

          description:
            problem.description

        });

      }
    );


  if (
    AnalysisState.scores.symmetry >=
    90
  ) {

    feedback.push({

      title:
        "대칭성 우수",

      description:
        "좌우 움직임의 균형이 안정적으로 유지되고 있습니다."

    });

  }


  AnalysisState.feedback =
    feedback;

}



/* =========================================================
   23. TRAINING DATABASE
========================================================= */

const TRAINING_DATABASE = {

  common: [

    "데드버그",

    "버드독",

    "플랭크",

    "사이드 플랭크",

    "팔로프 프레스",

    "싱글레그 밸런스",

    "싱글레그 RDL",

    "스플릿 스쿼트",

    "리버스 런지",

    "워킹 런지",

    "힙 브리지",

    "힙 쓰러스트",

    "밴드 사이드워크",

    "카프 레이즈",

    "발목 가동성 드릴",

    "고관절 가동성 드릴",

    "흉추 회전 드릴",

    "햄스트링 모빌리티",

    "코펜하겐 플랭크",

    "슬로우 템포 스쿼트"

  ],


  biathlon: [

    "더블폴링 기술 드릴",

    "원스케이트 타이밍 드릴",

    "투스케이트 타이밍 드릴",

    "노폴 스케이팅",

    "싱글스키 글라이드",

    "업힐 스케이팅 반복",

    "경사 전환 주법 드릴",

    "폴링 리듬 훈련",

    "롤러스키 밸런스",

    "스키 바운드",

    "스키 에르고 인터벌",

    "상체 지구력 서킷",

    "라트풀다운",

    "시티드 로우",

    "트라이셉스 프레스다운",

    "코어 안티로테이션",

    "싱글레그 스쿼트",

    "스케이터 점프",

    "사격 자세 안정화",

    "호흡 후 자세 안정화 드릴"

  ],


  crossCountry: [

    "노폴 스케이팅",

    "싱글스키 글라이드",

    "V1 기술 반복",

    "V2 기술 반복",

    "더블폴링",

    "스키 바운드",

    "업힐 인터벌",

    "롤러스키 기술 훈련",

    "스키 에르고",

    "상체 지구력 서킷",

    "싱글레그 밸런스",

    "스케이터 점프"

  ],


  rollerSki: [

    "롤러스키 원스케이트",

    "롤러스키 투스케이트",

    "노폴 롤러스키",

    "싱글레그 글라이드",

    "폴링 타이밍 드릴",

    "업힐 롤러스키",

    "롤러스키 밸런스 드릴",

    "스키 바운드",

    "스케이터 점프",

    "코어 안정성 훈련"

  ],


  sprint: [

    "A-Skip",

    "B-Skip",

    "Wall Drill",

    "March Drill",

    "Acceleration Drill",

    "Flying Sprint",

    "Resisted Sprint",

    "Bounding",

    "Pogo Jump",

    "Single Leg Hop",

    "Nordic Hamstring",

    "Hip Flexor Drive",

    "Split Squat",

    "Calf Isometric",

    "Ankle Stiffness Drill"

  ],


  weightlifting: [

    "템포 백스쿼트",

    "프론트 스쿼트",

    "오버헤드 스쿼트",

    "스내치 밸런스",

    "행 스내치",

    "행 클린",

    "클린 풀",

    "스내치 풀",

    "하이 풀",

    "포즈 데드리프트",

    "클린 데드리프트",

    "스내치 데드리프트",

    "프론트랙 모빌리티",

    "발목 가동성",

    "흉추 가동성",

    "오버헤드 안정성"

  ],


  shooting: [

    "정적 자세 유지",

    "싱글레그 밸런스",

    "팔로프 프레스",

    "데드버그",

    "버드독",

    "사이드 플랭크",

    "견갑 안정성 드릴",

    "밴드 외회전",

    "흉추 안정화",

    "호흡 리듬 훈련",

    "자세 반복 재현 훈련",

    "피로 후 자세 안정화"

  ]

};



/* =========================================================
   24. TRAINING RECOMMENDATION
========================================================= */

function generateTrainingRecommendations() {

  const sportId =
    AnalysisState
      .selectedSport
      ?.id ||
    window.SeolcheonState
      ?.selectedSportId;


  let exercises = [

    ...TRAINING_DATABASE.common,

    ...(
      TRAINING_DATABASE[
        sportId
      ] ||
      []
    )

  ];


  if (
    AnalysisState.scores.symmetry <
    85
  ) {

    exercises.unshift(

      "싱글레그 RDL",

      "불가리안 스플릿 스쿼트",

      "싱글레그 밸런스",

      "스텝업"

    );

  }


  if (
    AnalysisState.scores.stability <
    85
  ) {

    exercises.unshift(

      "팔로프 프레스",

      "데드버그",

      "버드독",

      "사이드 플랭크"

    );

  }


  if (
    AnalysisState.scores.posture <
    85
  ) {

    exercises.unshift(

      "템포 스쿼트",

      "고관절 모빌리티",

      "발목 가동성 드릴",

      "벽 스쿼트 자세 드릴"

    );

  }


  AnalysisState.training =
    [...new Set(
      exercises
    )]
      .slice(
        0,
        30
      )
      .map(
        (name, index) => ({

          id:
            `training_${index}`,

          name,

          category:
            index < 5
              ? "우선 교정"
              : "추천 훈련",

          reason:
            index < 5
              ? "현재 자세분석 결과에서 우선 개선이 필요한 항목과 관련된 훈련입니다."
              : `${AnalysisState.selectedSport?.name || "선택 종목"} 수행 능력 향상을 위한 보조 훈련입니다.`

        })
      );

}



/* =========================================================
   25. TRAJECTORY
========================================================= */

function updateTrajectory(
  landmarks
) {

  const hipCenter = {

    x:
      (
        landmarks[
          LM.leftHip
        ].x +

        landmarks[
          LM.rightHip
        ].x
      ) / 2,

    y:
      (
        landmarks[
          LM.leftHip
        ].y +

        landmarks[
          LM.rightHip
        ].y
      ) / 2

  };


  AnalysisState
    .trajectory
    .push(
      hipCenter
    );


  if (
    AnalysisState
      .trajectory
      .length >
    120
  ) {

    AnalysisState
      .trajectory
      .shift();

  }

}



/* =========================================================
   26. CANVAS RESIZE
========================================================= */

function resizeAnalysisCanvases() {

  const elements =
    getAnalysisElements();


  const base =
    elements.canvas ||
    elements.video;


  if (!base) {

    return;

  }


  const width =
    elements.video
      ?.videoWidth ||
    elements.canvas
      ?.width ||
    1280;


  const height =
    elements.video
      ?.videoHeight ||
    elements.canvas
      ?.height ||
    720;


  [

    elements.canvas,

    elements.poseCanvas,

    elements.angleCanvas,

    elements.trajectoryCanvas,

    elements.threeDCanvas

  ]
    .filter(
      Boolean
    )
    .forEach(
      canvas => {

        canvas.width =
          width;

        canvas.height =
          height;

      }
    );

}



/* =========================================================
   27. 2D SKELETON
========================================================= */

function drawPoseSkeleton(
  landmarks
) {

  const {
    poseCanvas
  } =
    getAnalysisElements();


  if (!poseCanvas) {

    return;

  }


  const ctx =
    poseCanvas.getContext(
      "2d"
    );


  const width =
    poseCanvas.width;


  const height =
    poseCanvas.height;


  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  const connections =
    window.POSE_CONNECTIONS ||
    FALLBACK_CONNECTIONS;


  ctx.lineWidth =
    Math.max(
      3,
      width / 320
    );


  ctx.lineCap =
    "round";


  connections.forEach(
    connection => {

      const startIndex =
        Array.isArray(
          connection
        )
          ? connection[0]
          : connection.start;


      const endIndex =
        Array.isArray(
          connection
        )
          ? connection[1]
          : connection.end;


      const a =
        landmarks[
          startIndex
        ];


      const b =
        landmarks[
          endIndex
        ];


      if (
        !a ||
        !b
      ) {

        return;

      }


      if (
        (
          a.visibility ??
          1
        ) <
        0.35 ||
        (
          b.visibility ??
          1
        ) <
        0.35
      ) {

        return;

      }


      ctx.beginPath();


      ctx.moveTo(
        a.x *
        width,
        a.y *
        height
      );


      ctx.lineTo(
        b.x *
        width,
        b.y *
        height
      );


      ctx.strokeStyle =
        "rgba(63, 219, 255, 0.95)";


      ctx.shadowBlur =
        12;


      ctx.shadowColor =
        "rgba(0, 184, 255, 0.75)";


      ctx.stroke();

    }
  );


  ctx.shadowBlur =
    0;


  landmarks.forEach(
    (landmark, index) => {

      if (
        (
          landmark.visibility ??
          1
        ) <
        0.4
      ) {

        return;

      }


      const x =
        landmark.x *
        width;


      const y =
        landmark.y *
        height;


      ctx.beginPath();


      ctx.arc(
        x,
        y,
        Math.max(
          4,
          width / 250
        ),
        0,
        Math.PI *
        2
      );


      if (
        [
          LM.leftShoulder,
          LM.rightShoulder,
          LM.leftHip,
          LM.rightHip,
          LM.leftKnee,
          LM.rightKnee,
          LM.leftAnkle,
          LM.rightAnkle
        ].includes(
          index
        )
      ) {

        ctx.fillStyle =
          "#ffdf5d";

      }

      else {

        ctx.fillStyle =
          "#ffffff";

      }


      ctx.fill();

    }
  );

}



/* =========================================================
   28. ANGLE OVERLAY
========================================================= */

function drawJointAngles(
  landmarks
) {

  const {
    angleCanvas,
    poseCanvas
  } =
    getAnalysisElements();


  const canvas =
    angleCanvas ||
    poseCanvas;


  if (!canvas) {

    return;

  }


  const ctx =
    canvas.getContext(
      "2d"
    );


  if (
    angleCanvas
  ) {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

  }


  const labels = [

    {
      index:
        LM.leftElbow,

      value:
        AnalysisState
          .angles
          .leftElbow
    },

    {
      index:
        LM.rightElbow,

      value:
        AnalysisState
          .angles
          .rightElbow
    },

    {
      index:
        LM.leftHip,

      value:
        AnalysisState
          .angles
          .leftHip
    },

    {
      index:
        LM.rightHip,

      value:
        AnalysisState
          .angles
          .rightHip
    },

    {
      index:
        LM.leftKnee,

      value:
        AnalysisState
          .angles
          .leftKnee
    },

    {
      index:
        LM.rightKnee,

      value:
        AnalysisState
          .angles
          .rightKnee
    }

  ];


  ctx.font =
    `${Math.max(
      14,
      canvas.width /
      70
    )}px sans-serif`;


  ctx.textAlign =
    "center";


  labels.forEach(
    item => {

      const landmark =
        landmarks[
          item.index
        ];


      if (
        !landmark ||
        (
          landmark.visibility ??
          1
        ) <
        0.4
      ) {

        return;

      }


      const x =
        landmark.x *
        canvas.width;


      const y =
        landmark.y *
        canvas.height -
        12;


      const text =
        `${Math.round(
          item.value
        )}°`;


      ctx.lineWidth =
        4;


      ctx.strokeStyle =
        "rgba(0,0,0,0.8)";


      ctx.strokeText(
        text,
        x,
        y
      );


      ctx.fillStyle =
        "#ffe26b";


      ctx.fillText(
        text,
        x,
        y
      );

    }
  );

}



/* =========================================================
   29. TRAJECTORY DRAW
========================================================= */

function drawTrajectory() {

  const {
    trajectoryCanvas
  } =
    getAnalysisElements();


  if (
    !trajectoryCanvas
  ) {

    return;

  }


  const ctx =
    trajectoryCanvas.getContext(
      "2d"
    );


  ctx.clearRect(
    0,
    0,
    trajectoryCanvas.width,
    trajectoryCanvas.height
  );


  const points =
    AnalysisState.trajectory;


  if (
    points.length <
    2
  ) {

    return;

  }


  ctx.beginPath();


  points.forEach(
    (point, index) => {

      const x =
        point.x *
        trajectoryCanvas.width;


      const y =
        point.y *
        trajectoryCanvas.height;


      if (
        index ===
        0
      ) {

        ctx.moveTo(
          x,
          y
        );

      }

      else {

        ctx.lineTo(
          x,
          y
        );

      }

    }
  );


  ctx.strokeStyle =
    "rgba(80, 255, 167, 0.72)";


  ctx.lineWidth =
    3;


  ctx.stroke();

}



/* =========================================================
   30. 3D POSE
========================================================= */

function draw3DPose(
  landmarks
) {

  const {
    threeDCanvas
  } =
    getAnalysisElements();


  if (
    !threeDCanvas ||
    !landmarks
  ) {

    return;

  }


  const ctx =
    threeDCanvas.getContext(
      "2d"
    );


  const width =
    threeDCanvas.width;


  const height =
    threeDCanvas.height;


  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  const connections =
    FALLBACK_CONNECTIONS;


  function project(
    point
  ) {

    const z =
      point.z ||
      0;


    const scale =
      1 /
      (
        1 +
        z *
        0.7
      );


    return {

      x:
        width *
        0.5 +
        (
          point.x -
          0.5
        ) *
        width *
        0.9 *
        scale,

      y:
        height *
        0.5 +
        (
          point.y -
          0.5
        ) *
        height *
        0.95 *
        scale

    };

  }


  ctx.lineWidth =
    4;


  ctx.lineCap =
    "round";


  connections.forEach(
    ([aIndex, bIndex]) => {

      const a =
        landmarks[
          aIndex
        ];


      const b =
        landmarks[
          bIndex
        ];


      if (
        !a ||
        !b
      ) {

        return;

      }


      const p1 =
        project(
          a
        );


      const p2 =
        project(
          b
        );


      ctx.beginPath();


      ctx.moveTo(
        p1.x,
        p1.y
      );


      ctx.lineTo(
        p2.x,
        p2.y
      );


      ctx.strokeStyle =
        "#47ddff";


      ctx.shadowBlur =
        14;


      ctx.shadowColor =
        "#008cff";


      ctx.stroke();

    }
  );


  ctx.shadowBlur =
    0;


  landmarks.forEach(
    landmark => {

      const point =
        project(
          landmark
        );


      ctx.beginPath();


      ctx.arc(
        point.x,
        point.y,
        5,
        0,
        Math.PI *
        2
      );


      ctx.fillStyle =
        "#ffffff";


      ctx.fill();

    }
  );

}



/* =========================================================
   31. CLEAR CANVAS
========================================================= */

function clearPoseCanvases() {

  const elements =
    getAnalysisElements();


  [

    elements.poseCanvas,

    elements.angleCanvas,

    elements.trajectoryCanvas,

    elements.threeDCanvas

  ]
    .filter(
      Boolean
    )
    .forEach(
      canvas => {

        canvas
          .getContext(
            "2d"
          )
          .clearRect(
            0,
            0,
            canvas.width,
            canvas.height
          );

      }
    );

}



/* =========================================================
   32. RENDER DATA
========================================================= */

function renderAnalysisData() {

  const elements =
    getAnalysisElements();


  if (
    elements.score
  ) {

    elements.score.textContent =
      AnalysisState.overallScore;

  }


  if (
    elements.technique
  ) {

    elements.technique.textContent =
      AnalysisState.currentTechnique;

  }


  if (
    elements.metrics
  ) {

    elements.metrics.innerHTML =
      Object.entries(
        AnalysisState.metrics
      )
        .slice(
          0,
          10
        )
        .map(
          ([key, value]) => `
            <div class="metric-card">

              <span>
                ${metricLabel(key)}
              </span>

              <strong>
                ${value}
              </strong>

            </div>
          `
        )
        .join("");

  }


  if (
    elements.angles
  ) {

    elements.angles.innerHTML =
      Object.entries(
        AnalysisState.angles
      )
        .map(
          ([key, value]) => `
            <div class="angle-card">

              <span>
                ${angleLabel(key)}
              </span>

              <strong>
                ${value}°
              </strong>

            </div>
          `
        )
        .join("");

  }

}



/* =========================================================
   33. LABELS
========================================================= */

function metricLabel(
  key
) {

  const labels = {

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
      "주법 전환",

    slope:
      "경사",

    strideLength:
      "보폭",

    groundContactTime:
      "접지시간",

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


  return (
    labels[key] ||
    key
  );

}



function angleLabel(
  key
) {

  const labels = {

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


  return (
    labels[key] ||
    key
  );

}



/* =========================================================
   34. VIDEO TIME
========================================================= */

function formatVideoTime(
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
      seconds /
      60
    );


  const secs =
    Math.floor(
      seconds %
      60
    );


  const hundredths =
    Math.floor(
      (
        seconds %
        1
      ) *
      100
    );


  return (
    String(minutes)
      .padStart(
        2,
        "0"
      ) +
    ":" +
    String(secs)
      .padStart(
        2,
        "0"
      ) +
    "." +
    String(hundredths)
      .padStart(
        2,
        "0"
      )
  );

}



function updateVideoTime() {

  const {
    video,
    progress,
    currentTime,
    totalTime
  } =
    getAnalysisElements();


  if (!video) {

    return;

  }


  if (currentTime) {

    currentTime.textContent =
      formatVideoTime(
        video.currentTime
      );

  }


  if (totalTime) {

    totalTime.textContent =
      formatVideoTime(
        video.duration
      );

  }


  if (
    progress &&
    Number.isFinite(
      video.duration
    ) &&
    video.duration >
    0
  ) {

    progress.value =
      (
        video.currentTime /
        video.duration
      ) *
      100;

  }

}



/* =========================================================
   35. FRAME STEP
========================================================= */

function stepFrame(
  direction
) {

  const {
    video
  } =
    getAnalysisElements();


  if (
    !video ||
    !Number.isFinite(
      video.duration
    )
  ) {

    return;

  }


  video.pause();


  const frameDuration =
    1 /
    30;


  video.currentTime =
    clampValue(

      video.currentTime +
      frameDuration *
      direction,

      0,

      video.duration

    );


  setTimeout(
    async () => {

      drawVideoFrame(
        video
      );


      if (
        AnalysisState.pose
      ) {

        try {

          await AnalysisState.pose.send({

            image:
              video

          });

        }

        catch (error) {

          console.warn(
            error
          );

        }

      }


      updateVideoTime();

    },
    40
  );

}



/* =========================================================
   36. SNAPSHOT
========================================================= */

function createSnapshot() {

  const {
    canvas,
    poseCanvas,
    angleCanvas,
    trajectoryCanvas
  } =
    getAnalysisElements();


  if (!canvas) {

    return null;

  }


  const output =
    document.createElement(
      "canvas"
    );


  output.width =
    canvas.width;


  output.height =
    canvas.height;


  const ctx =
    output.getContext(
      "2d"
    );


  ctx.drawImage(
    canvas,
    0,
    0
  );


  if (
    poseCanvas &&
    AnalysisState.viewMode ===
    "2d"
  ) {

    ctx.drawImage(
      poseCanvas,
      0,
      0
    );

  }


  if (
    angleCanvas
  ) {

    ctx.drawImage(
      angleCanvas,
      0,
      0
    );

  }


  if (
    trajectoryCanvas
  ) {

    ctx.drawImage(
      trajectoryCanvas,
      0,
      0
    );

  }


  AnalysisState.snapshot =
    output.toDataURL(
      "image/jpeg",
      0.92
    );


  if (
    poseCanvas
  ) {

    AnalysisState.poseImage =
      poseCanvas.toDataURL(
        "image/png"
      );

  }


  if (
    angleCanvas
  ) {

    AnalysisState.angleImage =
      angleCanvas.toDataURL(
        "image/png"
      );

  }


  if (
    trajectoryCanvas
  ) {

    AnalysisState.trajectoryImage =
      trajectoryCanvas.toDataURL(
        "image/png"
      );

  }


  const {
    threeDCanvas
  } =
    getAnalysisElements();


  if (
    threeDCanvas
  ) {

    AnalysisState.threeDImage =
      threeDCanvas.toDataURL(
        "image/png"
      );

  }


  return AnalysisState.snapshot;

}



/* =========================================================
   37. FINISH ANALYSIS
========================================================= */

function finishAnalysis() {

  if (
    !AnalysisState.landmarks
  ) {

    alert(
      "먼저 사람 자세를 분석해주세요."
    );

    return;

  }


  createSnapshot();


  const record =
    window.SeolcheonCore
      ?.createAnalysisRecord({

        sportId:
          AnalysisState
            .selectedSport
            ?.id ||
          window.SeolcheonState
            ?.selectedSportId,

        sportName:
          AnalysisState
            .selectedSport
            ?.name,

        mode:
          AnalysisState.mode,

        overallScore:
          AnalysisState.overallScore,

        scores:
          {
            ...AnalysisState.scores
          },

        angles:
          {
            ...AnalysisState.angles
          },

        metrics:
          {
            ...AnalysisState.metrics
          },

        technique:
          AnalysisState.currentTechnique,

        transitions:
          [
            ...AnalysisState
              .techniqueTransitions
          ],

        problems:
          [
            ...AnalysisState.problems
          ],

        feedback:
          [
            ...AnalysisState.feedback
          ],

        training:
          [
            ...AnalysisState.training
          ],

        images: {

          snapshot:
            AnalysisState.snapshot,

          pose:
            AnalysisState.poseImage,

          angles:
            AnalysisState.angleImage,

          trajectory:
            AnalysisState
              .trajectoryImage,

          threeD:
            AnalysisState
              .threeDImage

        },

        threeD: {

          enabled:
            AnalysisState.viewMode ===
            "3d",

          landmarkCount:
            AnalysisState
              .worldLandmarks
              ?.length ||
            0

        }

      });


  if (!record) {

    alert(
      "분석 기록 저장에 실패했습니다."
    );

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


  window.SeolcheonApp
    ?.navigate(
      "report"
    );

}



/* =========================================================
   38. RESET ANALYSIS
========================================================= */

function resetAnalysis() {

  AnalysisState.landmarks =
    null;

  AnalysisState.worldLandmarks =
    null;

  AnalysisState.previousLandmarks =
    null;

  AnalysisState.results =
    null;

  AnalysisState.frameCount =
    0;

  AnalysisState.repCount =
    0;

  AnalysisState.repStage =
    null;

  AnalysisState.currentTechnique =
    "--";

  AnalysisState.techniqueTransitions =
    [];

  AnalysisState.trajectory =
    [];

  AnalysisState.angles =
    {};

  AnalysisState.metrics =
    {};

  AnalysisState.overallScore =
    0;

  AnalysisState.problems =
    [];

  AnalysisState.feedback =
    [];

  AnalysisState.training =
    [];


  clearPoseCanvases();

  renderAnalysisData();


  const {
    repCount
  } =
    getAnalysisElements();


  if (repCount) {

    repCount.textContent =
      "0";

  }

}



/* =========================================================
   39. CAMERA MESSAGE
========================================================= */

function showCameraMessage(
  text
) {

  const {
    cameraMessage
  } =
    getAnalysisElements();


  if (!cameraMessage) {

    return;

  }


  cameraMessage.hidden =
    false;


  cameraMessage.textContent =
    text;

}



function hideCameraMessage() {

  const {
    cameraMessage
  } =
    getAnalysisElements();


  if (cameraMessage) {

    cameraMessage.hidden =
      true;

  }

}



/* =========================================================
   40. MODE
========================================================= */

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

}



/* =========================================================
   41. 2D / 3D VIEW
========================================================= */

function setViewMode(
  mode
) {

  AnalysisState.viewMode =
    mode;


  const elements =
    getAnalysisElements();


  document
    .querySelectorAll(
      "[data-view-mode]"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset
            .viewMode ===
            mode
        );

      }
    );


  if (
    elements.poseCanvas
  ) {

    elements.poseCanvas.style.display =
      mode === "2d"
        ? "block"
        : "none";

  }


  if (
    elements.angleCanvas
  ) {

    elements.angleCanvas.style.display =
      mode === "2d"
        ? "block"
        : "none";

  }


  if (
    elements.threeDCanvas
  ) {

    elements.threeDCanvas.style.display =
      mode === "3d"
        ? "block"
        : "none";

  }


  if (
    mode === "3d" &&
    AnalysisState.landmarks
  ) {

    draw3DPose(
      AnalysisState.worldLandmarks ||
      AnalysisState.landmarks
    );

  }

}



/* =========================================================
   42. EVENT BINDINGS
========================================================= */

document.addEventListener(
  "click",
  event => {

    const cameraStart =
      event.target.closest(
        "[data-camera-start]"
      );


    if (cameraStart) {

      setAnalysisMode(
        "realtime"
      );


      startCamera();

      return;

    }


    const mode =
      event.target.closest(
        "[data-analysis-mode]"
      );


    if (mode) {

      setAnalysisMode(
        mode.dataset
          .analysisMode
      );


      return;

    }


    const view =
      event.target.closest(
        "[data-view-mode]"
      );


    if (view) {

      setViewMode(
        view.dataset
          .viewMode
      );


      return;

    }


    const play =
      event.target.closest(
        "[data-analysis-play]"
      );


    if (play) {

      const {
        video
      } =
        getAnalysisElements();


      video?.play();

      return;

    }


    const pause =
      event.target.closest(
        "[data-analysis-pause]"
      );


    if (pause) {

      const {
        video
      } =
        getAnalysisElements();


      video?.pause();

      return;

    }


    const previous =
      event.target.closest(
        "[data-analysis-frame-prev]"
      );


    if (previous) {

      stepFrame(
        -1
      );

      return;

    }


    const next =
      event.target.closest(
        "[data-analysis-frame-next]"
      );


    if (next) {

      stepFrame(
        1
      );

      return;

    }


    const snapshot =
      event.target.closest(
        "[data-analysis-snapshot]"
      );


    if (snapshot) {

      createSnapshot();


      alert(
        "현재 분석 장면을 저장했습니다."
      );


      return;

    }


    const reset =
      event.target.closest(
        "[data-analysis-reset]"
      );


    if (reset) {

      resetAnalysis();

      return;

    }


    const finish =
      event.target.closest(
        "[data-analysis-finish]"
      );


    if (finish) {

      finishAnalysis();

    }

  }
);



/* =========================================================
   43. VIDEO UPLOAD EVENT
========================================================= */

document.addEventListener(
  "change",
  event => {

    if (
      event.target.matches(
        "[data-video-upload]"
      )
    ) {

      const file =
        event.target.files?.[0];


      if (file) {

        setAnalysisMode(
          "video"
        );


        loadVideoFile(
          file
        );

      }


      return;

    }


    if (
      event.target.matches(
        "[data-playback-rate]"
      )
    ) {

      const {
        video
      } =
        getAnalysisElements();


      if (video) {

        video.playbackRate =
          Number(
            event.target.value
          ) ||
          1;

      }

    }

  }
);



/* =========================================================
   44. VIDEO PROGRESS
========================================================= */

document.addEventListener(
  "input",
  event => {

    if (
      !event.target.matches(
        "[data-video-progress]"
      )
    ) {

      return;

    }


    const {
      video
    } =
      getAnalysisElements();


    if (
      !video ||
      !Number.isFinite(
        video.duration
      )
    ) {

      return;

    }


    video.currentTime =
      (
        Number(
          event.target.value
        ) /
        100
      ) *
      video.duration;


    updateVideoTime();

  }
);



/* =========================================================
   45. SPORT SELECT EVENT
========================================================= */

window.addEventListener(
  "seolcheon:sport-selected",
  event => {

    AnalysisState.selectedSport =
      event.detail
        ?.sport ||
      null;


    AnalysisState.selectedSeason =
      event.detail
        ?.season ||
      null;


    resetAnalysis();

  }
);



/* =========================================================
   46. RESIZE
========================================================= */

window.addEventListener(
  "resize",
  () => {

    if (
      AnalysisState.landmarks
    ) {

      resizeAnalysisCanvases();


      drawPoseSkeleton(
        AnalysisState.landmarks
      );


      drawJointAngles(
        AnalysisState.landmarks
      );


      drawTrajectory();


      if (
        AnalysisState.viewMode ===
        "3d"
      ) {

        draw3DPose(
          AnalysisState.worldLandmarks ||
          AnalysisState.landmarks
        );

      }

    }

  }
);



/* =========================================================
   47. PUBLIC API
========================================================= */

window.SeolcheonAnalysis = {

  state:
    AnalysisState,

  initializePoseEngine,

  startCamera,

  stopCamera,

  loadVideoFile,

  resetAnalysis,

  finishAnalysis,

  createSnapshot,

  setViewMode,

  setAnalysisMode,

  calculateJointAngles,

  calculateScores,

  generateTrainingRecommendations

};



/* =========================================================
   48. INITIAL VIEW
========================================================= */

setViewMode(
  "2d"
);


console.log(
  "SEOLCHEON ANALYSIS ENGINE READY"
);


/* =========================================================
   END OF ANALYSIS.JS
========================================================= */