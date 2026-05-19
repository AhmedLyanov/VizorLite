import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckout = async (req, res) => {
  try {
    const user = req.user; 

    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user._id.toString() },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
      console.log(`Created new Stripe customer for user ${user.email}: ${customerId}`);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/pricing?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.stripeCustomerId) {
      return res.json([]);
    }

    const invoices = await stripe.invoices.list({
      customer: user.stripeCustomerId,
      limit: 100,
    });

    const transactions = invoices.data.map(invoice => {
      let status = 'pending';
      if (invoice.paid) status = 'paid';
      else if (invoice.status === 'void' || invoice.status === 'uncollectible') status = 'expired';

      let description = 'Подписка';
      if (invoice.lines?.data?.[0]?.description) {
        description = invoice.lines.data[0].description;
      } else if (invoice.description) {
        description = invoice.description;
      }

      const amount = invoice.amount_paid
        ? `$${(invoice.amount_paid / 100).toFixed(2)}`
        : invoice.amount_due
        ? `$${(invoice.amount_due / 100).toFixed(2)}`
        : '$0.00';

      return {
        id: invoice.id,
        date: new Date(invoice.created * 1000).toISOString().slice(0, 10),
        amount,
        status,
        description,
        invoiceUrl: invoice.hosted_invoice_url || null,
      };
    });

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(transactions);
  } catch (error) {
    console.error('Stripe invoices error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};