import { Request, Response } from "express";
import { createToken } from "../utils/jwt";



export const generateToken = (

req:Request,

res:Response

)=>{


try{


const {
userId
}=req.body;



if(!userId){


return res.status(400).json({

success:false,

message:"User ID required"

});


}



const token =
createToken({

userId:userId

});




res.status(200).json({

success:true,

token

});




}
catch(error){


res.status(500).json({

success:false,

message:"Token generation failed"

});


}


};