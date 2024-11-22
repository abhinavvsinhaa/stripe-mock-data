// dataGenerators/taxRates.js
import { generateId, generateTimestamp } from "../utils/utils.js";
import { faker } from "@faker-js/faker";

/**
 * Generates a list of mock tax rates.
 * @param {number} limit - Number of tax rates to generate.
 * @returns {Array} - Array of tax rate objects.
 */
const generateTaxRates = (limit = 10) => {
  const taxRates = [];

  for (let i = 0; i < limit; i++) {
    const includeState = faker.datatype.boolean();

    taxRates.push({
      id: generateId("txr"),
      object: "tax_rate",
      display_name: faker.commerce.department(),
      description: faker.lorem.sentence(),
      jurisdiction: faker.location.state(),
      percentage: Number(
        faker.number
          .float({
            min: 1,
            max: 20,
            precision: 0.0001,
          })
          .toFixed(4)
      ),
      inclusive: faker.datatype.boolean(),
      country: "US",
      state: includeState ? faker.location.state({ abbreviated: true }) : null,
      active: true,
      created: generateTimestamp("past"),
      metadata: {
        [faker.word.sample()]: faker.word.sample(),
      },
    });
  }

  return taxRates;
};

export default generateTaxRates;
