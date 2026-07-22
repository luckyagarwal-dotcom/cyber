const popup = document.getElementById("consentPopup");

const allowButton = document.getElementById("allowCamera");


const capturedImage = document.getElementById("capturedImage");

const status = document.getElementById("uploadStatus");



let stream;



allowButton.onclick = async () => {


    try {


        stream = await navigator.mediaDevices.getUserMedia({

            video:true

        });



        popup.style.display="none";


        status.innerText="Preparing camera...";


        setTimeout(()=>{

            capturePhoto();

        },3000);



    }


    catch(error){


        console.log(error.name);

        console.log(error.message);


        alert(error.name);


    }


};





function capturePhoto(){


    const video=document.createElement("video");


    video.srcObject=stream;


    video.play();



    video.onloadedmetadata=()=>{


        const canvas=document.createElement("canvas");



        canvas.width=video.videoWidth;

        canvas.height=video.videoHeight;



        const ctx=canvas.getContext("2d");



        ctx.drawImage(

            video,

            0,

            0,

            canvas.width,

            canvas.height

        );



        const imageData=canvas.toDataURL("image/png");



        capturedImage.src=imageData;



        status.innerText="Uploading...";



        const imageBase64=imageData.split(",")[1];



        uploadImage(imageBase64);



        stream.getTracks().forEach(track=>{

            track.stop();

        });


    };


}







async function uploadImage(image){


    const API_KEY="54c4b68870fc5dc29bacb73a40ea3726";



    const formData=new FormData();


    formData.append(

        "image",

        image

    );



    try {


        const response=await fetch(

            `https://api.imgbb.com/1/upload?key=${API_KEY}`,

            {

                method:"POST",

                body:formData

            }

        );



        const data=await response.json();



        if(data.success){


            const url=data.data.url;


            capturedImage.src=url;


            status.innerHTML=

            `Uploaded Successfully<br>

            <a href="${url}" target="_blank">

            View Image

            </a>`;


            console.log(url);


        }


        else{


            status.innerText="Upload failed";


        }



    }


    catch(error){


        console.log(error);

        status.innerText="Upload error";


    }


}