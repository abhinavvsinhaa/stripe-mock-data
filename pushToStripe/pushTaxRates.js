// pushToStripe/pushTaxRates.js
import dotenv from "dotenv";
import Stripe from "stripe";
import generateTaxRates from "../dataGenerators/taxRates.js";
import pLimit from "p-limit";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Pushes generated tax rates to Stripe.
 * @param {number} count - Number of tax rates to generate and push.
 * @returns {Promise<Array>} - Array of created Stripe tax rate IDs.
 */
const pushTaxRatesToStripe = async (count = 10) => {
  const taxRates = generateTaxRates(count);
  const stripeTaxRateIds = [];
  const limitConcurrency = pLimit(5);

  const promises = taxRates.map((taxRate) =>
    limitConcurrency(async () => {
      try {
        // Create tax rate object without null values
        const taxRateData = {
          display_name: taxRate.display_name,
          description: taxRate.description,
          jurisdiction: taxRate.jurisdiction,
          percentage: taxRate.percentage,
          inclusive: taxRate.inclusive,
          country: taxRate.country,
          active: taxRate.active,
          metadata: taxRate.metadata,
        };

        // Only add state if it exists
        if (taxRate.state) {
          taxRateData.state = taxRate.state;
        }

        const stripeTaxRate = await stripe.taxRates.create(taxRateData);
        console.log(
          `Created tax rate: ${stripeTaxRate.id} with percentage: ${stripeTaxRate.percentage}%`
        );
        stripeTaxRateIds.push(stripeTaxRate.id);
      } catch (error) {
        console.error(
          `Error creating tax rate (${taxRate.id}): ${error.message}`
        );
      }
    })
  );

  await Promise.all(promises);
  return stripeTaxRateIds;
};

export default pushTaxRatesToStripe;
