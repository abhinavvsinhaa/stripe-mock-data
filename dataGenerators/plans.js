// dataGenerators/plans.js
import { generateId, generateTimestamp } from "../utils/utils.js";
import { faker } from "@faker-js/faker";

/**
 * Generates a list of mock plans.
 * @param {number} limit - Number of plans to generate.
 * @returns {Array} - Array of plan objects.
 */
const generatePlans = (limit = 10) => {
  const plans = [];

  const intervals = ["day", "week", "month", "year"];

  for (let i = 0; i < limit; i++) {
    plans.push({
      id: generateId("plan"),
      object: "plan",
      amount: faker.number.int({ min: 100, max: 10000 }), // Changed from datatype.number to number.int
      currency: "usd",
      interval: faker.helpers.arrayElement(intervals),
      product: generateId("prod"),
      nickname: faker.commerce.productName(),
      active: faker.datatype.boolean(),
      created: generateTimestamp("past"),
      metadata: {
        [faker.word.sample()]: faker.word.sample(), // Changed from lorem.word to word.sample
      },
      // Add more fields as needed
    });
  }

  return plans;
};

export default generatePlans;
