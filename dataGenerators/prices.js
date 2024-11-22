// dataGenerators/prices.js
import { generateId } from "../utils/utils.js";
import { faker } from "@faker-js/faker";

/**
 * Generates a list of mock prices.
 * @param {number} limit - Number of prices to generate.
 * @returns {Array} - Array of price objects.
 */
const generatePrices = (limit = 10) => {
  const prices = [];

  const intervals = ["day", "week", "month", "year"];

  for (let i = 0; i < limit; i++) {
    const interval = faker.helpers.arrayElement(intervals);

    // Set appropriate max interval_count based on interval type
    const maxIntervalCount = interval === "year" ? 3 : 12;

    prices.push({
      id: generateId("price"),
      object: "price",
      currency: "usd",
      unit_amount: faker.number.int({ min: 500, max: 50000 }),
      active: faker.datatype.boolean(),
      nickname: faker.commerce.productName(),
      product: generateId("prod"),
      recurring: {
        interval: interval,
        interval_count: faker.number.int({ min: 1, max: maxIntervalCount }),
        usage_type: "licensed",
      },
      metadata: {
        [faker.word.sample()]: faker.word.sample(),
      },
    });
  }

  return prices;
};

export default generatePrices;
