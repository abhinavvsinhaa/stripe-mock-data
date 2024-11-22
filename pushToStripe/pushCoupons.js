// pushToStripe/pushCoupons.js
import dotenv from "dotenv";
import Stripe from "stripe";
import generateCoupons from "../dataGenerators/coupons.js";
import pLimit from "p-limit";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Pushes generated coupons to Stripe.
 * @param {number} count - Number of coupons to generate and push.
 * @returns {Promise<Array>} - Array of created Stripe coupon IDs.
 */
const pushCouponsToStripe = async (count = 10) => {
  const coupons = generateCoupons(count);
  const stripeCouponIds = [];
  const limitConcurrency = pLimit(5);

  const promises = coupons.map((coupon) =>
    limitConcurrency(async () => {
      try {
        // Create the coupon with validated data
        const stripeCoupon = await stripe.coupons.create({
          duration: coupon.duration,
          ...(coupon.amount_off && {
            amount_off: coupon.amount_off,
            currency: coupon.currency,
          }),
          ...(coupon.percent_off && { percent_off: coupon.percent_off }),
          ...(coupon.duration_in_months && {
            duration_in_months: coupon.duration_in_months,
          }),
          ...(coupon.max_redemptions && {
            max_redemptions: coupon.max_redemptions,
          }),
          ...(coupon.redeem_by && { redeem_by: coupon.redeem_by }),
          metadata: coupon.metadata,
        });

        console.log(`Created coupon: ${stripeCoupon.id}`);
        stripeCouponIds.push(stripeCoupon.id);
      } catch (error) {
        console.error(`Error creating coupon (${coupon.id}): ${error.message}`);
      }
    })
  );

  await Promise.all(promises);
  return stripeCouponIds;
};

export default pushCouponsToStripe;
