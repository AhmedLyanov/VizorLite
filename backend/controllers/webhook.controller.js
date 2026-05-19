import Stripe from 'stripe';
import { User } from '../models/User.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const customerId = session.customer;
      const subscriptionId = session.subscription;

      const user = await User.findOne({ stripeCustomerId: customerId });
        user.stripeSubscriptionId = subscriptionId;
        user.plan = 'pro'; 
        await user.save();
      break;
    }
    case 'invoice.paid': {
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const user = await User.findOne({ stripeSubscriptionId: subscription.id });
      if (user) {
        user.plan = 'free';
        user.stripeSubscriptionId = null;
        await user.save();
      }
      break;
    }
    default:
  }

  res.json({ received: true });
};