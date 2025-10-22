import express from "express";

import { updateUserProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.put("/profile/:userId", protectRoute, updateUserProfile);

export default router;
