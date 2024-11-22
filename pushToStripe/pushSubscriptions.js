// pushToStripe/pushSubscriptions.js
import dotenv from "dotenv";
import Stripe from "stripe";
import generateSubscriptions from "../dataGenerators/subscriptions.js";
import pLimit from "p-limit";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Pushes generated subscriptions to Stripe.
 * @param {Array} customerIds - Array of Stripe customer IDs.
 * @param {Array} priceIds - Array of Stripe price IDs.
 * @param {number} count - Number of subscriptions to generate and push.
 * @returns {Promise<Array>} - Array of created Stripe subscription IDs.
 */
const pushSubscriptionsToStripe = async (count = 10) => {
  const subscriptions = generateSubscriptions(count);
  const stripeSubscriptionIds = [];
  const limitConcurrency = pLimit(5);

  const promises = subscriptions.map((subscription) =>
    limitConcurrency(async () => {
      try {
        // 1. First create a payment method
        const paymentMethod = await stripe.paymentMethods.create({
          type: "card",
          card: {
            number: "4242424242424242",
            exp_month: 12,
            exp_year: 2025,
            cvc: "314",
          },
        });

        // 2. Attach payment method to customer
        await stripe.paymentMethods.attach(paymentMethod.id, {
          customer: subscription.customer,
        });

        // 3. Set as default payment method
        await stripe.customers.update(subscription.customer, {
          invoice_settings: {
            default_payment_method: paymentMethod.id,
          },
        });

        // 4. Create the subscription
        const stripeSubscription = await stripe.subscriptions.create({
          customer: subscription.customer,
          items: subscription.items.data.map((item) => ({
            price: item.price,
            quantity: item.quantity,
          })),
          metadata: subscription.metadata,
          cancel_at_period_end: subscription.cancel_at_period_end,
          ...(subscription.canceled_at && {
            canceled_at: subscription.canceled_at,
          }),
          default_payment_method: paymentMethod.id,
        });

        console.log(`Created subscription: ${stripeSubscription.id}`);
        stripeSubscriptionIds.push(stripeSubscription.id);
      } catch (error) {
        console.error(
          `Error creating subscription (${subscription.id}): ${error.message}`
        );
      }
    })
  );

  await Promise.all(promises);
  return stripeSubscriptionIds;
};

export default pushSubscriptionsToStripe;
