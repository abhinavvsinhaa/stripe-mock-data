// dataGenerators/creditNotes.js
import { generateId, generateTimestamp } from "../utils/utils.js";
import { faker } from "@faker-js/faker";

/**
 * Generates a list of mock credit notes.
 * @param {number} limit - Number of credit notes to generate.
 * @returns {Array} - Array of credit note objects.
 */
const generateCreditNotes = (limit = 10) => {
  const creditNotes = [];

  for (let i = 0; i < limit; i++) {
    creditNotes.push({
      id: generateId("cn"),
      object: "credit_note",
      amount: faker.number.int({ min: 100, max: 10000 }),
      created: generateTimestamp("past"),
      invoice: generateId("in"),
      memo: faker.lorem.sentence(),
      metadata: {
        [faker.word.sample()]: faker.word.sample(),
      },
    });
  }

  return creditNotes;
};

export default generateCreditNotes;
