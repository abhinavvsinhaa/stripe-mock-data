// pushToStripe/pushCreditNotes.js
import dotenv from "dotenv";
import Stripe from "stripe";
import generateCreditNotes from "../dataGenerators/creditNotes.js";
import pLimit from "p-limit";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Pushes generated credit notes to Stripe.
 * @param {number} count - Number of credit notes to generate and push.
 * @returns {Promise<Array>} - Array of created Stripe credit note IDs.
 */
const pushCreditNotesToStripe = async (count = 10) => {
  const creditNotes = generateCreditNotes(count);
  const stripeCreditNoteIds = [];
  const limitConcurrency = pLimit(5); // Limit concurrency to 5

  const promises = creditNotes.map((creditNote) =>
    limitConcurrency(async () => {
      try {
        // Ensure the invoice exists in Stripe
        const stripeCreditNote = await stripe.creditNotes.create({
          invoice: creditNote.invoice, // Assuming invoice exists
          amount: creditNote.amount,
          memo: creditNote.memo,
          metadata: creditNote.metadata,
        });
        console.log(`Created credit note: ${stripeCreditNote.id}`);
        stripeCreditNoteIds.push(stripeCreditNote.id);
      } catch (error) {
        console.error(
          `Error creating credit note (${creditNote.id}): ${error.message}`
        );
      }
    })
  );

  await Promise.all(promises);
  return stripeCreditNoteIds;
};

export default pushCreditNotesToStripe;
