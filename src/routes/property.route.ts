import { Router } from "express";

import {

  createProperty,

  getProperties,

  getSingleProperty,

  

  updateProperty,

  deleteProperty,
  getMyProperties

} from "../controllers/property.controller";


import { verifyJWT } from "../middleware/auth.middleware";



const router = Router();




// Get all properties

router.get(
  "/",
  getProperties
);




// Get holder properties

router.get(
  "/my-properties",
  verifyJWT,
  getMyProperties
);



// Get single property

router.get(
  "/:id",
  getSingleProperty
);




// Create property

router.post(
  "/",
  verifyJWT,
  createProperty
);



// Update property (protected)

router.patch(
  "/:id",
  verifyJWT,
  updateProperty
);




// Delete property (protected)

router.delete(
  "/:id",
  verifyJWT,
  deleteProperty
);



export default router;