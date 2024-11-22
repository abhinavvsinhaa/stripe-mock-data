// dataGenerators/customers.js
import { generateId } from "../utils/utils.js";
import { faker } from "@faker-js/faker";

/**
 * Generates a list of mock customers.
 * @param {number} limit - Number of customers to generate.
 * @returns {Array} - Array of customer objects.
 */
const generateCustomers = (limit = 10) => {
  const customers = [];

  for (let i = 0; i < limit; i++) {
    customers.push({
      id: generateId("cus"),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      phone: `+1${faker.string.numeric(10)}`,
      address: {
        line1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        postal_code: faker.location.zipCode(),
        country: "US",
      },
      metadata: {
        [faker.word.sample()]: faker.word.sample(),
      },
    });
  }

  return customers;
};

export default generateCustomers;
