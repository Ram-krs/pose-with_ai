async function startCountdown(){

    const countdown =
    document.getElementById(
        "countdown"
    );

    for(let i=3;i>0;i--){

        countdown.innerHTML = i;

        await new Promise(resolve=>
            setTimeout(resolve,1000)
        );
    }

    countdown.innerHTML = "📸";

    setTimeout(()=>{
        countdown.innerHTML = "";
    },1000);

    capturePhoto();
}

function capturePhoto(){

    const video =
    document.getElementById(
        "video"
    );

    const canvas =
    document.createElement(
        "canvas"
    );

    canvas.width =
    video.videoWidth;

    canvas.height =
    video.videoHeight;

    const ctx =
    canvas.getContext("2d");

    ctx.save();

    ctx.scale(-1,1);

    ctx.drawImage(
        video,
        -canvas.width,
        0,
        canvas.width,
        canvas.height
    );

    ctx.restore();

    const link =
    document.createElement("a");

    link.href =
    canvas.toDataURL("image/png");

    link.download =
    `pose_${Date.now()}.png`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}