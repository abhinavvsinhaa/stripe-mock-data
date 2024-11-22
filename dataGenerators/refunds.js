// dataGenerators/refunds.js
import { generateId, generateTimestamp } from "../utils/utils.js";
import { faker } from "@faker-js/faker";

/**
 * Generates a list of mock refunds.
 * @param {number} limit - Number of refunds to generate.
 * @returns {Array} - Array of refund objects.
 */
const generateRefunds = (limit = 10) => {
  const refunds = [];

  const reasons = ["duplicate", "fraudulent", "requested_by_customer"];

  for (let i = 0; i < limit; i++) {
    refunds.push({
      id: generateId("re"),
      object: "refund",
      amount: faker.number.int({ min: 500, max: 10000 }), // Amount in cents
      currency: "usd",
      reason: faker.helpers.arrayElement(reasons),
      metadata: {
        [faker.word.sample()]: faker.word.sample(),
      },
    });
  }

  return refunds;
};

export default generateRefunds;
