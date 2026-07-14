import {
  Router,
  type Response,
} from "express";

import {
  generateToken,
} from "../controllers/auth.controller";

import {
  verifyJWT,
  type AuthRequest,
} from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/token",
  generateToken
);

router.get(
  "/verify",
  verifyJWT,
  (
    req: AuthRequest,
    res: Response
  ) => {
    return res.status(200).json({
      success: true,
      message: "JWT verified successfully",
      user: req.user,
    });
  }
);

export default router;