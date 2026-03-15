import express from "express";
import { getAggregatedTheme } from "../controllers/themeMobileController.js";
import { userAuthentication } from "../middlewares/middleware.js";

const router = express.Router();

// Get aggregated theme for mobile
router.get("/", userAuthentication, getAggregatedTheme);

export default router;
