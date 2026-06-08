const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const captureBtn = document.getElementById("captureBtn");

const scoreText = document.getElementById("score");
const bestScoreText = document.getElementById("bestScore");
const tips = document.getElementById("tips");

const poseType =
document.getElementById("poseType");

let bestScore = 0;
let currentScore = 0;

const CONNECTIONS = [
    [11,12],
    [11,13],
    [13,15],
    [12,14],
    [14,16],
    [11,23],
    [12,24],
    [23,24],
    [23,25],
    [25,27],
    [24,26],
    [26,28]
];

startBtn.addEventListener(
"click",
async ()=>{

    try{

        const stream =
        await navigator.mediaDevices
        .getUserMedia({
            video:true
        });

        video.srcObject = stream;

        video.onloadedmetadata = ()=>{

            canvas.width =
            video.clientWidth;

            canvas.height =
            video.clientHeight;

            startPoseDetection();
        };

    }catch(err){

        console.log(err);

        alert(
        "Camera Access Denied"
        );
    }
});

captureBtn.addEventListener(
"click",
()=>{
    startCountdown();

    addPoseHistory(
        poseType.value,
        currentScore
    );
});

poseType.addEventListener(
"change",
()=>{
    updateRecommendedPose(
        poseType.value
    );
});

updateRecommendedPose(
poseType.value
);

function startPoseDetection(){

    const pose = new Pose({

        locateFile:(file)=>{

            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
    });

    pose.setOptions({

        modelComplexity:1,

        smoothLandmarks:true,

        minDetectionConfidence:0.6,

        minTrackingConfidence:0.6
    });

    pose.onResults((results)=>{

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        if(results.poseLandmarks){

            drawSkeleton(
                results.poseLandmarks
            );

            analyzePosture(
                results.poseLandmarks
            );
        }
    });

    async function detect(){

        await pose.send({
            image:video
        });

        requestAnimationFrame(
            detect
        );
    }

    detect();
}

function drawSkeleton(
landmarks
){

    CONNECTIONS.forEach(pair=>{

        const p1 =
        landmarks[pair[0]];

        const p2 =
        landmarks[pair[1]];

        ctx.beginPath();

        ctx.moveTo(
            p1.x * canvas.width,
            p1.y * canvas.height
        );

        ctx.lineTo(
            p2.x * canvas.width,
            p2.y * canvas.height
        );

        ctx.strokeStyle =
        "#00ff99";

        ctx.lineWidth = 3;

        ctx.stroke();
    });

    landmarks.forEach(point=>{

        ctx.beginPath();

        ctx.arc(
            point.x * canvas.width,
            point.y * canvas.height,
            4,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
        "#00ff99";

        ctx.fill();
    });
}

function analyzePosture(
landmarks
){

    const nose =
    landmarks[0];

    const leftShoulder =
    landmarks[11];

    const rightShoulder =
    landmarks[12];

    const leftHip =
    landmarks[23];

    const rightHip =
    landmarks[24];

    const leftKnee =
    landmarks[25];

    const rightKnee =
    landmarks[26];

    let score = 0;

    let feedback = [];

    const shoulderDiff =
    Math.abs(
        leftShoulder.y -
        rightShoulder.y
    );

    const hipDiff =
    Math.abs(
        leftHip.y -
        rightHip.y
    );

    const headCenter =
    Math.abs(
        nose.x -
        (
            leftShoulder.x +
            rightShoulder.x
        ) / 2
    );

    const spineAlignment =
    Math.abs(
        (
            leftShoulder.x +
            rightShoulder.x
        ) / 2
        -
        (
            leftHip.x +
            rightHip.x
        ) / 2
    );

    const bodyBalance =
    Math.abs(
        leftKnee.x -
        rightKnee.x
    );

    if(headCenter < 0.05){

        score += 20;

        feedback.push(
        "✅ Head Centered"
        );

    }else{

        feedback.push(
        "❌ Center Head"
        );
    }

    if(shoulderDiff < 0.03){

        score += 20;

        feedback.push(
        "✅ Shoulders Aligned"
        );

    }else{

        feedback.push(
        "❌ Align Shoulders"
        );
    }

    if(hipDiff < 0.03){

        score += 20;

        feedback.push(
        "✅ Balanced Hips"
        );

    }else{

        feedback.push(
        "❌ Balance Hips"
        );
    }

    if(spineAlignment < 0.05){

        score += 20;

        feedback.push(
        "✅ Straight Spine"
        );

    }else{

        feedback.push(
        "❌ Straighten Back"
        );
    }

    if(bodyBalance > 0.08){

        score += 20;

        feedback.push(
        "✅ Stable Stance"
        );

    }else{

        feedback.push(
        "❌ Improve Balance"
        );
    }

    currentScore = score;

    scoreText.innerHTML =
    `Posture Score: ${score}%`;

    if(score > bestScore){

        bestScore = score;

        bestScoreText.innerHTML =
        `Best Score: ${bestScore}%`;
    }

    if(score >= 90){

        feedback.unshift(
        "🎉 PERFECT POSE"
        );
    }

    const mode =
    poseType.value;

    if(mode === "trendy"){

        feedback.unshift(
        "🔥 Trendy Fashion Pose"
        );
    }

    if(mode === "casual"){

        feedback.unshift(
        "😎 Casual Fashion Pose"
        );
    }

    if(mode === "professional"){

        feedback.unshift(
        "💼 Professional Fashion Pose"
        );
    }

    if(mode === "social"){

        feedback.unshift(
        "📸 Social Media Pose"
        );
    }

    tips.innerHTML =
    feedback.join("<br>");
}