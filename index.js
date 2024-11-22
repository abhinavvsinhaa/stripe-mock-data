// index.js
import dotenv from "dotenv";
import pushCustomersToStripe from "./pushToStripe/pushCustomers.js";
import pushPricesToStripe from "./pushToStripe/pushPrices.js";
import pushSubscriptionsToStripe from "./pushToStripe/pushSubscriptions.js";
import pushCouponsToStripe from "./pushToStripe/pushCoupons.js";
import pushPromotionCodesToStripe from "./pushToStripe/pushPromotionCodes.js";
import pushTaxRatesToStripe from "./pushToStripe/pushTaxRates.js";
import pushRefundsToStripe from "./pushToStripe/pushRefunds.js";
import pushPayoutsToStripe from "./pushToStripe/pushPayouts.js";
import pushCreditNotesToStripe from "./pushToStripe/pushCreditNotes.js";
import pushPlansToStripe from "./pushToStripe/pushPlans.js";
import pushQuotesToStripe from "./pushToStripe/pushQuotes.js";
import pushBalanceTransactionsToStripe from "./pushToStripe/pushBalanceTransactions.js";

dotenv.config();

/**
 * Main function to orchestrate data generation and pushing to Stripe.
 */
const main = async () => {
  try {
    console.log("--- Creating Customers ---");
    const customerIds = await pushCustomersToStripe(10);
    console.log("Created customer IDs:", customerIds);

    if (customerIds.length > 0) {
      console.log("\n--- Creating Quotes ---");
      const quoteIds = await pushQuotesToStripe(10, customerIds);
      console.log("Created quote IDs:", quoteIds);
    }

    console.log("\n--- Creating Prices and Products ---");
    const priceIds = await pushPricesToStripe(100);

    console.log("\n--- Creating Subscriptions ---");
    const subscriptionIds = await pushSubscriptionsToStripe(
      customerIds,
      priceIds,
      60
    );

    console.log("\n--- Creating Coupons ---");
    const couponIds = await pushCouponsToStripe(10);
    console.log("Created coupon IDs:", couponIds);

    console.log("\n--- Creating Promotion Codes ---");
    if (couponIds.length > 0) {
      const promoIds = await pushPromotionCodesToStripe(10, couponIds);
      console.log("Created promotion code IDs:", promoIds);
    }

    console.log("\n--- Creating Tax Rates ---");
    const taxRateIds = await pushTaxRatesToStripe(50);

    console.log("\n--- Creating Refunds ---");
    const refundIds = await pushRefundsToStripe(50);

    console.log("\n--- Creating Payouts ---");
    const payoutIds = await pushPayoutsToStripe(50);

    console.log("\n--- Creating Credit Notes ---");
    const creditNoteIds = await pushCreditNotesToStripe(50);

    console.log("\n--- Creating Plans ---");
    const planIds = await pushPlansToStripe(50);

    console.log("\n--- Creating Balance Transactions ---");
    // const balanceTransactionIds = await pushBalanceTransactionsToStripe(50);

    console.log("\n--- All resources created successfully ---");
  } catch (error) {
    console.error(`Unexpected error: ${error.message}`);
  }
};

// Execute the main function
main();
