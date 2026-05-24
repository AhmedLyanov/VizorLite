import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getSettings,
  updateSettings,
  updateSettingsSection
} from "../controllers/settings.controller.js";

const router = express.Router();


router.use(auth);

router.get('/', getSettings);
router.put('/', updateSettings);
router.patch('/:section', updateSettingsSection);

export default router;