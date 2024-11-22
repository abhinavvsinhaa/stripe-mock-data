// dataGenerators/coupons.js
import { generateId, generateTimestamp } from "../utils/utils.js";
import { faker } from "@faker-js/faker";

/**
 * Generates a list of mock coupons.
 * @param {number} limit - Number of coupons to generate.
 * @returns {Array} - Array of coupon objects.
 */
const generateCoupons = (limit = 10) => {
  const coupons = [];

  const durations = ["forever", "once", "repeating"];

  for (let i = 0; i < limit; i++) {
    const duration = faker.helpers.arrayElement(durations);
    const isAmountOff = faker.datatype.boolean();

    let couponData = {
      id: generateId("coupon"),
      duration: duration,
      currency: "usd",
      metadata: {
        [faker.word.sample()]: faker.word.sample(),
      },
    };

    // Add duration_in_months only for repeating coupons
    if (duration === "repeating") {
      couponData.duration_in_months = faker.number.int({ min: 1, max: 12 });
    }

    // Either set amount_off (integer) or percent_off (integer), not both
    if (isAmountOff) {
      couponData.amount_off = faker.number.int({ min: 500, max: 5000 }); // Amount in cents
    } else {
      couponData.percent_off = faker.number.int({ min: 5, max: 90 }); // Whole number percentage
    }

    // Optionally add redemption limits
    if (faker.datatype.boolean()) {
      couponData.max_redemptions = faker.number.int({ min: 1, max: 100 });
    }

    // Optionally add expiration
    if (faker.datatype.boolean()) {
      couponData.redeem_by = generateTimestamp("future");
    }

    coupons.push(couponData);
  }

  return coupons;
};

export default generateCoupons;
