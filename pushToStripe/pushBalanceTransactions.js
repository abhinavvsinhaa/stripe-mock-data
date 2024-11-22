// pushToStripe/pushBalanceTransactions.js
import dotenv from "dotenv";
import Stripe from "stripe";
import generateBalanceTransactions from "../dataGenerators/balanceTransactions.js";
import pLimit from "p-limit";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Pushes generated balance transactions to Stripe.
 * @param {number} count - Number of balance transactions to generate and push.
 * @returns {Promise<Array>} - Array of created Stripe balance transaction IDs.
 */
const pushBalanceTransactionsToStripe = async (count = 10) => {
  const balanceTransactions = generateBalanceTransactions(count);
  const stripeBalanceTransactionIds = [];
  const limitConcurrency = pLimit(5); // Limit concurrency to 5

  const promises = balanceTransactions.map((txn) =>
    limitConcurrency(async () => {
      try {
        // Balance transactions are typically read-only in Stripe.
        // To simulate, you might create charges, refunds, payouts, etc.
        // Here, we'll create charges as a way to generate balance transactions.

        if (txn.type === "charge") {
          const charge = await stripe.charges.create({
            amount: txn.amount > 0 ? txn.amount : 1000, // Ensure positive amount
            currency: txn.currency,
            source: "tok_visa", // Use a test token
            description: txn.description,
            metadata: txn.metadata,
          });
          console.log(`Created charge: ${charge.id}`);
          stripeBalanceTransactionIds.push(charge.balance_transaction);
        } else if (txn.type === "refund") {
          // Requires an existing charge to refund
          // For demonstration, create a charge first
          const charge = await stripe.charges.create({
            amount: txn.amount > 0 ? txn.amount : 1000,
            currency: txn.currency,
            source: "tok_visa",
            description: "Charge for refund",
            metadata: txn.metadata,
          });
          const refund = await stripe.refunds.create({
            charge: charge.id,
            amount: txn.amount > 0 ? txn.amount : 500,
            metadata: txn.metadata,
          });
          console.log(`Created refund: ${refund.id}`);
          stripeBalanceTransactionIds.push(refund.balance_transaction);
        }
        // Add more transaction types as needed
      } catch (error) {
        console.error(
          `Error creating balance transaction (${txn.id}): ${error.message}`
        );
      }
    })
  );

  await Promise.all(promises);
  return stripeBalanceTransactionIds;
};

export default pushBalanceTransactionsToStripe;
