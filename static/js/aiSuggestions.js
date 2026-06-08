const poseRecommendations = {

    standing: [
        "✓ Stand straight",
        "✓ Keep shoulders level",
        "✓ Look directly at camera",
        "✓ Keep feet shoulder-width apart"
    ],

    sitting: [
        "✓ Sit upright",
        "✓ Keep neck straight",
        "✓ Relax shoulders",
        "✓ Keep screen at eye level"
    ],

    confident: [
        "✓ Chest open",
        "✓ Head slightly raised",
        "✓ Shoulders back",
        "✓ Balanced stance"
    ],

    interview: [
        "✓ Sit professionally",
        "✓ Maintain eye contact",
        "✓ Keep hands relaxed",
        "✓ Slight confident smile"
    ],

    casual: [
        "✓ One hand in pocket",
        "✓ Relax shoulders",
        "✓ Slight body angle",
        "✓ Natural expression"
    ],

    professional: [
        "✓ Straight posture",
        "✓ Hands together",
        "✓ Chin slightly raised",
        "✓ Direct eye contact"
    ],

    traditional: [
        "✓ Stand elegantly",
        "✓ Hands relaxed",
        "✓ Gentle smile",
        "✓ Face camera naturally"
    ],

    trendy: [
        "✓ Turn body 15°",
        "✓ One shoulder forward",
        "✓ Relaxed smile",
        "✓ Stylish stance"
    ],

    social: [
        "✓ Look slightly away",
        "✓ Natural smile",
        "✓ Relaxed body angle",
        "✓ Casual standing pose"
    ]
};

function updateRecommendedPose(mode){

    const panel =
    document.getElementById(
        "recommendedPose"
    );

    const poses =
    poseRecommendations[mode];

    panel.innerHTML =
    poses.join("<br>");
}