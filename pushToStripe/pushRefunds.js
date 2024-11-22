// pushToStripe/pushRefunds.js
import dotenv from "dotenv";
import Stripe from "stripe";
import generateRefunds from "../dataGenerators/refunds.js";
import pLimit from "p-limit";
import faker from "faker";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Pushes generated refunds to Stripe.
 * @param {number} count - Number of refunds to generate and push.
 * @returns {Promise<Array>} - Array of created Stripe refund IDs.
 */
const pushRefundsToStripe = async (count = 10) => {
  const refunds = generateRefunds(count);
  const stripeRefundIds = [];
  const limitConcurrency = pLimit(5);

  // First create a test customer in US
  const customer = await stripe.customers.create({
    email: faker.internet.email(),
    source: "tok_visa", // Test card token
    address: {
      country: "US",
    },
  });

  const promises = refunds.map((refund) =>
    limitConcurrency(async () => {
      try {
        // 1. Create a charge first
        const charge = await stripe.charges.create({
          amount: refund.amount,
          currency: "usd",
          customer: customer.id,
          description: "Test charge for refund",
        });

        // 2. Then create the refund
        const stripeRefund = await stripe.refunds.create({
          charge: charge.id,
          amount: refund.amount,
          metadata: refund.metadata,
          reason: refund.reason,
        });

        console.log(
          `Created refund: ${stripeRefund.id} for charge: ${charge.id}`
        );
        stripeRefundIds.push(stripeRefund.id);
      } catch (error) {
        console.error(`Error creating refund (${refund.id}): ${error.message}`);
      }
    })
  );

  await Promise.all(promises);
  return stripeRefundIds;
};

export default pushRefundsToStripe;
