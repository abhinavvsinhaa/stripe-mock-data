// dataGenerators/balanceTransactions.js
import { generateId, generateTimestamp } from "../utils/utils.js";
import { faker } from "@faker-js/faker";

/**
 * Generates a list of mock balance transactions.
 * @param {number} limit - Number of balance transactions to generate.
 * @returns {Array} - Array of balance transaction objects.
 */
const generateBalanceTransactions = (limit = 10) => {
  const balanceTransactions = [];

  const types = ["charge", "refund", "payout", "fee"];

  for (let i = 0; i < limit; i++) {
    balanceTransactions.push({
      id: generateId("txn"),
      object: "balance_transaction",
      amount: faker.number.int({ min: -10000, max: 10000 }),
      currency: "usd",
      description: faker.lorem.sentence(),
      created: generateTimestamp("past"),
      type: faker.helpers.arrayElement(types),
      net: faker.number.int({ min: -10000, max: 10000 }),
      fee: faker.number.int({ min: 0, max: 500 }),
      fee_details: [
        {
          amount: faker.number.int({ min: 0, max: 500 }),
          currency: "usd",
          type: "stripe_fee",
          description: "Stripe processing fee",
        },
      ],
      source: generateId("ch"), // Assuming source is a charge
      metadata: {
        [faker.word.sample()]: faker.word.sample(),
      },
      // Add more fields as needed
    });
  }

  return balanceTransactions;
};

export default generateBalanceTransactions;
