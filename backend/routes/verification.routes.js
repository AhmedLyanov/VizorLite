import express from "express";
import { verifyEmail } from "../controllers/verification.controller.js";

const router = express.Router();

router.post("/email", verifyEmail);

export default router;