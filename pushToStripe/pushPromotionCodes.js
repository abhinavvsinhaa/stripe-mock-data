// pushToStripe/pushPromotionCodes.js
import dotenv from "dotenv";
import Stripe from "stripe";
import generatePromotionCodes from "../dataGenerators/promotionCodes.js";
import pLimit from "p-limit";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Pushes generated promotion codes to Stripe.
 * @param {number} count - Number of promotion codes to generate and push.
 * @param {Array} couponIds - Array of existing coupon IDs.
 * @returns {Promise<Array>} - Array of created Stripe promotion code IDs.
 */
const pushPromotionCodesToStripe = async (count = 10, couponIds) => {
  if (!couponIds || couponIds.length === 0) {
    console.error("No valid coupon IDs provided for promotion codes");
    return [];
  }

  const promotionCodes = generatePromotionCodes(count);
  const stripePromotionCodeIds = [];
  const limitConcurrency = pLimit(5);

  const promises = promotionCodes.map((promo, index) =>
    limitConcurrency(async () => {
      try {
        // Use an existing coupon ID from the provided array
        const couponId = couponIds[index % couponIds.length];

        const stripePromo = await stripe.promotionCodes.create({
          coupon: couponId,
          code: promo.code,
          active: promo.active,
          max_redemptions: promo.max_redemptions,
          metadata: promo.metadata,
          ...(promo.expires_at && { expires_at: promo.expires_at }),
        });

        console.log(
          `Created promotion code: ${stripePromo.id} for coupon: ${couponId}`
        );
        stripePromotionCodeIds.push(stripePromo.id);
      } catch (error) {
        console.error(
          `Error creating promotion code (${promo.id}): ${error.message}`
        );
      }
    })
  );

  await Promise.all(promises);
  return stripePromotionCodeIds;
};

export default pushPromotionCodesToStripe;
