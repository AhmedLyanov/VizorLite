import Stripe from 'stripe';
import { User } from '../models/User.model.js';
import {
  sendEmailByType,
  EmailType,
} from '../services/email.service.js';

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
    console.error(
      'Webhook signature verification failed:',
      err.message
    );

    return res
      .status(400)
      .send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        const customerId = session.customer;
        const subscriptionId = session.subscription;

        const user = await User.findOne({
          stripeCustomerId: customerId,
        });

        if (!user) {
          console.error(
            'User not found for customer:',
            customerId
          );

          break;
        }

        user.stripeSubscriptionId = subscriptionId;
        user.plan = 'pro';

        await user.save();

        let amount = '$0.00';

        if (session.amount_total) {
          amount = `$${(
            session.amount_total / 100
          ).toFixed(2)}`;
        }

        try {
          await sendEmailByType({
            to: user.email,
            type: EmailType.PRO_SUBSCRIPTION,
            data: {
              username: user.username,
              amount,
              invoiceId:
                session.invoice || 'NO_INVOICE',
            },
          });

          console.log(
            `✅ Pro subscription email sent to ${user.email}`
          );
        } catch (emailError) {
          console.error(
            'Failed to send payment email:',
            emailError
          );
        }

        console.log(
          `✅ User ${user.email} upgraded to PRO`
        );

        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;

        console.log(
          `💰 Invoice paid: ${invoice.id}`
        );

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        const user = await User.findOne({
          stripeSubscriptionId: subscription.id,
        });

        if (user) {
          user.plan = 'free';
          user.stripeSubscriptionId = null;

          await user.save();

          console.log(
            `❌ Subscription cancelled for ${user.email}`
          );
        }

        break;
      }

      default:
        console.log(
          `Unhandled event type ${event.type}`
        );
    }

    res.json({ received: true });
  } catch (error) {
    console.error(
      'Stripe webhook processing error:',
      error
    );

    res.status(500).json({
      error: 'Webhook processing failed',
    });
  }
};