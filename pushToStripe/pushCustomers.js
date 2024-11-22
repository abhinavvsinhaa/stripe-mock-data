// pushToStripe/pushCustomers.js
import dotenv from "dotenv";
import Stripe from "stripe";
import generateCustomers from "../dataGenerators/customers.js";
import pLimit from "p-limit";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const limit = pLimit(5); // Limit concurrency to 5

/**
 * Pushes generated customers to Stripe.
 * @param {number} count - Number of customers to generate and push.
 * @returns {Promise<Array>} - Array of created Stripe customer IDs.
 */
const pushCustomersToStripe = async (count = 10) => {
  const customers = generateCustomers(count);
  const stripeCustomerIds = [];
  const limitConcurrency = pLimit(5);

  const promises = customers.map((customer) =>
    limitConcurrency(async () => {
      try {
        const stripeCustomer = await stripe.customers.create({
          email: customer.email,
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          metadata: customer.metadata,
        });

        console.log(`Created customer: ${stripeCustomer.id}`);
        stripeCustomerIds.push(stripeCustomer.id);
      } catch (error) {
        console.error(
          `Error creating customer (${customer.email}): ${error.message}`
        );
      }
    })
  );

  await Promise.all(promises);
  return stripeCustomerIds;
};

export default pushCustomersToStripe;
