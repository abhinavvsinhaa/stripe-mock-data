// dataGenerators/subscriptions.js
import { generateId, generateTimestamp } from "../utils/utils.js";
import { faker } from "@faker-js/faker";

/**
 * Generates a list of mock subscriptions.
 * @param {number} limit - Number of subscriptions to generate.
 * @returns {Array} - Array of subscription objects.
 */
const generateSubscriptions = (limit = 10) => {
  const subscriptions = [];

  for (let i = 0; i < limit; i++) {
    subscriptions.push({
      id: generateId("sub"),
      object: "subscription",
      customer: generateId("cus"),
      items: {
        object: "list",
        data: [
          {
            id: generateId("si"),
            price: generateId("price"),
            quantity: faker.number.int({ min: 1, max: 5 }),
          },
        ],
        has_more: false,
      },
      cancel_at_period_end: faker.datatype.boolean(),
      canceled_at: faker.datatype.boolean() ? generateTimestamp("past") : null,
      created: generateTimestamp("past"),
      metadata: {
        [faker.word.sample()]: faker.word.sample(),
      },
    });
  }

  return subscriptions;
};

export default generateSubscriptions;
