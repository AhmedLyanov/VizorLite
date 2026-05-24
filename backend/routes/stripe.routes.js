import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { getTransactions, createCheckout } from '../controllers/stripe.controller.js';
import { handleStripeWebhook } from '../controllers/webhook.controller.js';

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);
router.post("/create-checkout", auth, createCheckout);
router.get('/transactions', auth, getTransactions);

export default router;