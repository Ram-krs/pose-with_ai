const video = document.getElementById("video");
const button = document.getElementById("startBtn");
const statusText = document.getElementById("status");

button.addEventListener("click", async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        video.srcObject = stream;

        statusText.innerText = "✅ Camera Running";
    }
    catch(err){
        statusText.innerText = "❌ Camera Access Denied";
        console.log(err);
    }
});