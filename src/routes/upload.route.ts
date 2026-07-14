import { Router } from "express";

import upload from "../config/multer";

import {
 uploadImage
} from "../controllers/upload.controller";


const router = Router();



router.post(

"/",

upload.single("image"),

uploadImage

);



export default router;