import express from "express";
import {
  loginController,
  logoutController,
  signupController,
  googleAuthController

} from "../controllers/auth.controller.js";
import { refreshAccessToken } from "../middleware/tokenRefresh.js";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/refresh", refreshAccessToken);
router.post("/google-auth", googleAuthController);

export default router;
