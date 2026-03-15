import { User } from "../models/User.model.js";

export const checkSubscription = async (req, res, next) => {

  if (!req.userId) return next();

  const user = await User.findById(req.userId);

  if (!user) return next();

  if (user.subscriptionEnd && user.subscriptionEnd < new Date()) {

    console.log("Subscription expired for:", user.email);

    user.plan = "free";
    user.subscriptionStatus = "expired";

    await user.save();
  }

  next();
};