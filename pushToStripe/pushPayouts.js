// pushToStripe/pushPayouts.js
import dotenv from "dotenv";
import Stripe from "stripe";
import generatePayouts from "../dataGenerators/payouts.js";
import pLimit from "p-limit";
import { faker } from "@faker-js/faker";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Pushes generated payouts to Stripe.
 * @param {number} count - Number of payouts to generate and push.
 * @returns {Promise<Array>} - Array of created Stripe payout IDs.
 */
const pushPayoutsToStripe = async (count = 10) => {
  const payouts = generatePayouts(count);
  const stripePayoutIds = [];
  const limitConcurrency = pLimit(5);

  try {
    // First, create a Custom Connect account
    const account = await stripe.accounts.create({
      type: "custom",
      country: "US",
      email: faker.internet.email(),
      capabilities: {
        transfers: { requested: true },
        card_payments: { requested: true },
      },
      business_type: "individual",
      business_profile: {
        url: faker.internet.url(),
        mcc: "5734", // Computer Software Stores
      },
      individual: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: {
          line1: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          postal_code: faker.location.zipCode(),
          country: "US",
        },
        dob: {
          day: faker.number.int({ min: 1, max: 28 }),
          month: faker.number.int({ min: 1, max: 12 }),
          year: faker.number.int({ min: 1960, max: 2000 }),
        },
        ssn_last_4: "0000",
      },
      external_account: {
        object: "bank_account",
        country: "US",
        currency: "usd",
        routing_number: "110000000", // Test routing number
        account_number: "000123456789", // Test account number
      },
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: faker.internet.ip(),
      },
    });

    console.log(`Created Connect account: ${account.id}`);

    // Then create payouts using this account
    const promises = payouts.map((payout) =>
      limitConcurrency(async () => {
        try {
          const stripePayout = await stripe.payouts.create(
            {
              amount: payout.amount,
              currency: payout.currency,
              method: payout.method,
              metadata: payout.metadata,
            },
            {
              stripeAccount: account.id, // Use the created Connect account
            }
          );

          console.log(`Created payout: ${stripePayout.id}`);
          stripePayoutIds.push(stripePayout.id);
        } catch (error) {
          console.error(
            `Error creating payout (${payout.id}): ${error.message}`
          );
        }
      })
    );

    await Promise.all(promises);
  } catch (error) {
    console.error("Error creating Connect account:", error.message);
  }

  return stripePayoutIds;
};

export default pushPayoutsToStripe;
