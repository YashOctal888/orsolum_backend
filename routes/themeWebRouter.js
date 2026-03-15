import express from "express";
import { 
  getColorTheme, getHomeTheme, getPosterTheme, 
  updateColorTheme, updateHomeTheme, updatePosterTheme 
} from "../controllers/themeWebController.js";
import { adminAuthentication } from "../middlewares/middleware.js";

const router = express.Router();

// GET modular themes
router.get("/color", adminAuthentication, getColorTheme);
router.get("/home", adminAuthentication, getHomeTheme);
router.get("/poster", adminAuthentication, getPosterTheme);

// PUT modular themes
router.put("/color", adminAuthentication, updateColorTheme);
router.put("/home", adminAuthentication, updateHomeTheme);
router.put("/poster", adminAuthentication, updatePosterTheme);

export default router;
