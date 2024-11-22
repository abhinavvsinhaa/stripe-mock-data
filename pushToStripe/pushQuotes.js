// pushToStripe/pushQuotes.js
import dotenv from "dotenv";
import Stripe from "stripe";
import generateQuotes from "../dataGenerators/quotes.js";
import pLimit from "p-limit";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Pushes generated quotes to Stripe.
 * @param {number} count - Number of quotes to generate and push.
 * @param {Array} customerIds - Array of customer IDs to use for quotes.
 * @returns {Promise<Array>} - Array of created Stripe quote IDs.
 */
const pushQuotesToStripe = async (count = 10, customerIds) => {
  if (!customerIds || customerIds.length === 0) {
    console.error("No valid customer IDs provided for quotes");
    return [];
  }

  const quotes = generateQuotes(count, customerIds);
  const stripeQuoteIds = [];
  const limitConcurrency = pLimit(5);

  const promises = quotes.map((quote) =>
    limitConcurrency(async () => {
      try {
        const stripeQuote = await stripe.quotes.create({
          customer: quote.customer,
          line_items: quote.line_items.data.map((item) => ({
            price_data: {
              currency: "usd",
              product_data: {
                name: item.description || "Product",
              },
              unit_amount: faker.number.int({ min: 1000, max: 50000 }),
            },
            quantity: item.quantity,
          })),
          metadata: quote.metadata,
        });

        console.log(
          `Created quote: ${stripeQuote.id} for customer: ${quote.customer}`
        );
        stripeQuoteIds.push(stripeQuote.id);
      } catch (error) {
        console.error(`Error creating quote (${quote.id}): ${error.message}`);
      }
    })
  );

  await Promise.all(promises);
  return stripeQuoteIds;
};

export default pushQuotesToStripe;
