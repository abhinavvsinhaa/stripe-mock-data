// utils/utils.js
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

/**
 * Generates a unique ID with a specific prefix.
 * @param {string} prefix - The prefix for the ID (e.g., 'cus', 're').
 * @returns {string} - The generated ID.
 */
export const generateId = (prefix) => `${prefix}_${uuidv4()}`;

/**
 * Generates a random timestamp within the past or future.
 * @param {string} period - 'past' or 'future'.
 * @returns {number} - Unix timestamp in seconds.
 */
export const generateTimestamp = (period = "past") => {
  const date = period === "past" ? faker.date.past() : faker.date.future();
  return Math.floor(date.getTime() / 1000);
};
