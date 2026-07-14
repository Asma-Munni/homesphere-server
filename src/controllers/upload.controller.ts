import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";



export const uploadImage = async(
req: Request,
res: Response
)=>{


try{


if(!req.file){

 return res.status(400).json({

  success:false,

  message:"No image found"

 });

}



const result =
await new Promise<any>(

(resolve,reject)=>{


const stream =
cloudinary.uploader.upload_stream(

{
folder:"homesphere"
},


(error,result)=>{


if(error){

reject(error);

}

else{

resolve(result);

}

}

);


stream.end(
req.file!.buffer
);


}

);




res.status(200).json({

success:true,

url:result.secure_url

});



}
catch(error){


console.log(
"UPLOAD ERROR:",
error
);



res.status(500).json({

success:false,

message:"Image upload failed"

});


}


};