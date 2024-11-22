// dataGenerators/promotionCodes.js
import { generateId, generateTimestamp } from "../utils/utils.js";
import { faker } from "@faker-js/faker";

/**
 * Generates a list of mock promotion codes.
 * @param {number} limit - Number of promotion codes to generate.
 * @returns {Array} - Array of promotion code objects.
 */
const generatePromotionCodes = (limit = 10) => {
  const promotionCodes = [];

  for (let i = 0; i < limit; i++) {
    promotionCodes.push({
      id: generateId("promo"),
      object: "promotion_code",
      code: faker.string.alphanumeric(10),
      coupon: generateId("coupon"),
      active: faker.datatype.boolean(),
      created: generateTimestamp("past"),
      expires_at: faker.datatype.boolean() ? generateTimestamp("future") : null,
      max_redemptions: faker.number.int({ min: 1, max: 100 }),
      times_redeemed: faker.number.int({ min: 0, max: 100 }),
      metadata: {
        [faker.word.sample()]: faker.word.sample(),
      },
      // Add more fields as needed
    });
  }

  return promotionCodes;
};

export default generatePromotionCodes;
