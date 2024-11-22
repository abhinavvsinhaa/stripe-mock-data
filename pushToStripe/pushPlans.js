// pushToStripe/pushPlans.js
import dotenv from "dotenv";
import Stripe from "stripe";
import generatePlans from "../dataGenerators/plans.js";
import pLimit from "p-limit";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Pushes generated plans to Stripe.
 * @param {number} count - Number of plans to generate and push.
 * @returns {Promise<Array>} - Array of created Stripe plan IDs.
 */
const pushPlansToStripe = async (count = 10) => {
  const plans = generatePlans(count);
  const stripePlanIds = [];
  const limitConcurrency = pLimit(5); // Limit concurrency to 5

  const promises = plans.map((plan) =>
    limitConcurrency(async () => {
      try {
        // First, create a product
        const product = await stripe.products.create({
          name: plan.nickname || `Plan ${plan.id}`,
          metadata: { generated: "true" },
        });

        // Then, create the plan
        const stripePlan = await stripe.plans.create({
          amount: plan.amount,
          currency: plan.currency,
          interval: plan.interval,
          product: product.id,
          nickname: plan.nickname,
          metadata: plan.metadata,
        });

        console.log(
          `Created plan: ${stripePlan.id} for product: ${product.id}`
        );
        stripePlanIds.push(stripePlan.id);
      } catch (error) {
        console.error(`Error creating plan (${plan.id}): ${error.message}`);
      }
    })
  );

  await Promise.all(promises);
  return stripePlanIds;
};

export default pushPlansToStripe;
