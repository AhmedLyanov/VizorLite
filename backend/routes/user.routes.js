import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount,
  updateSettings,
  updateSettingsSection,
  getSettings
} from "../controllers/user.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.delete("/account", auth, deleteAccount);

router.get('/settings', auth, getSettings);
router.put('/settings', auth, updateSettings);
router.patch('/settings/:section', auth, updateSettingsSection);

export default router;