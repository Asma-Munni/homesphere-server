import jwt from "jsonwebtoken";


const secret =
process.env.JWT_SECRET as string;



export const createToken = (
payload:object
)=>{


return jwt.sign(

payload,

secret,

{
expiresIn:"7d"
}

);


};



export const verifyToken = (
token:string
)=>{


return jwt.verify(

token,

secret

);


};