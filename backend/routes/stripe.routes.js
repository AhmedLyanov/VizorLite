import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import { auth } from "../middleware/auth.js";
import { User } from "../models/User.model.js";

dotenv.config();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);




router.post("/webhook", async (req, res) => {

  const sig = req.headers["stripe-signature"];

  let event;

  try {

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

  } catch (err) {

    console.log("Webhook signature verification failed:", err.message);
    return res.sendStatus(400);

  }



  if (event.type === "checkout.session.completed") {

    const session = event.data.object;

    const customerId = session.customer;

    const user = await User.findOne({
      stripeCustomerId: customerId
    });

    if (!user) {
      return res.json({ received: true });
    }
    user.plan = "business";

    user.subscriptionStatus = "active";

    user.subscriptionStart = new Date();

    // тест: подписка 2 минуты
    user.subscriptionEnd = new Date(Date.now() + 2 * 60 * 1000);

    await user.save();

    console.log("TEST subscription end:", user.subscriptionEnd);
  }




  if (event.type === "customer.subscription.deleted") {

    const subscription = event.data.object;

    const user = await User.findOne({
      stripeCustomerId: subscription.customer
    });

    if (user) {

      user.plan = "free";

      await user.save();

      console.log("Subscription cancelled:", user.email);

    }

  }


  res.json({ received: true });

});


router.post("/create-checkout", auth, async (req, res) => {

  try {

    const user = await User.findById(req.userId);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }




    let customerId = user.stripeCustomerId;

    if (!customerId) {

      const customer = await stripe.customers.create({
        email: user.email
      });

      customerId = customer.id;

      user.stripeCustomerId = customerId;

      await user.save();

    }




    const session = await stripe.checkout.sessions.create({

      customer: customerId,

      payment_method_types: ["card"],

      mode: "subscription",

      line_items: [
        {
          price: "price_1TBEyvRxnNqxOIRC9lKZA3Ai",
          quantity: 1
        }
      ],

      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel"

    });


    res.json({
      url: session.url
    });

  } catch (error) {

    console.error("Stripe error:", error);

    res.status(500).json({
      success: false,
      message: "Stripe checkout error"
    });

  }

});



export default router;