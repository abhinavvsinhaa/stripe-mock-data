// dataGenerators/payouts.js
import { generateId, generateTimestamp } from "../utils/utils.js";
import { faker } from "@faker-js/faker";

/**
 * Generates a list of mock payouts.
 * @param {number} limit - Number of payouts to generate.
 * @returns {Array} - Array of payout objects.
 */
const generatePayouts = (limit = 10) => {
  const payouts = [];
  const methods = ["standard", "instant"];

  for (let i = 0; i < limit; i++) {
    payouts.push({
      id: generateId("po"),
      object: "payout",
      amount: faker.number.int({ min: 1000, max: 100000 }),
      currency: "usd",
      arrival_date: generateTimestamp("future"),
      method: faker.helpers.arrayElement(methods),
      status: "pending",
      type: "bank_account",
      metadata: {
        [faker.word.sample()]: faker.word.sample(),
      },
    });
  }

  return payouts;
};

export default generatePayouts;
