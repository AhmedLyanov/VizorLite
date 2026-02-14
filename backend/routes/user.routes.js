import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount,
} from "../controllers/user.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.delete("/account", auth, deleteAccount);

export default router;
