import dotenv from "dotenv";

dotenv.config();
import { Router } from "express";


import {
 createProperty,
 getProperties
} from "../controllers/property.controller";


const router = Router();



router.post(
 "/",
 createProperty
);



router.get(
 "/",
 getProperties
);



export default router;