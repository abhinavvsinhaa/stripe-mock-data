// dataGenerators/quotes.js
import { generateId, generateTimestamp } from "../utils/utils.js";
import { faker } from "@faker-js/faker";

/**
 * Generates a list of mock quotes.
 * @param {number} limit - Number of quotes to generate.
 * @returns {Array} - Array of quote objects.
 */
const generateQuotes = (limit = 10, customerIds) => {
  const quotes = [];

  for (let i = 0; i < limit; i++) {
    // Use a real customer ID from the provided array
    const customerId = customerIds[i % customerIds.length];

    quotes.push({
      id: generateId("qt"),
      object: "quote",
      customer: customerId,
      line_items: {
        object: "list",
        data: [
          {
            quantity: faker.number.int({ min: 1, max: 10 }),
            description: faker.commerce.productDescription(),
          },
        ],
        has_more: false,
      },
      status: "draft",
      metadata: {
        [faker.word.sample()]: faker.word.sample(),
      },
    });
  }

  return quotes;
};

export default generateQuotes;
