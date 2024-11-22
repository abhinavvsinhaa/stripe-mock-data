// pushToStripe/pushPrices.js
import dotenv from "dotenv";
import Stripe from "stripe";
import generatePrices from "../dataGenerators/prices.js";
import pLimit from "p-limit";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Pushes generated prices to Stripe.
 * @param {number} count - Number of prices to generate and push.
 * @param {Array} productIds - Array of valid product IDs.
 * @returns {Promise<Array>} - Array of created Stripe price IDs.
 */
const pushPricesToStripe = async (count = 10, productIds) => {
  if (!productIds || productIds.length === 0) {
    console.error("No valid product IDs provided for prices");
    return [];
  }

  const prices = generatePrices(count);
  const stripePriceIds = [];
  const limitConcurrency = pLimit(5);

  const promises = prices.map((price, index) =>
    limitConcurrency(async () => {
      try {
        // Use a real product ID from the provided array
        const productId = productIds[index % productIds.length];

        const stripePrice = await stripe.prices.create({
          currency: price.currency,
          unit_amount: price.unit_amount,
          active: price.active,
          nickname: price.nickname,
          product: productId,
          recurring: {
            interval: price.recurring.interval,
            interval_count: price.recurring.interval_count,
            usage_type: price.recurring.usage_type,
          },
          metadata: price.metadata,
        });

        console.log(
          `Created price: ${stripePrice.id} for product: ${productId}`
        );
        stripePriceIds.push(stripePrice.id);
      } catch (error) {
        console.error(`Error creating price (${price.id}): ${error.message}`);
      }
    })
  );

  await Promise.all(promises);
  return stripePriceIds;
};

export default pushPricesToStripe;
