import { useDrizzle } from "~/server/utils/drizzle";
import * as tables from "../database/schema";
import {useEmail} from "~/server/utils/email";

export default eventHandler(async (event) => {
  // Read the body of the request
  const body = await readBody(event);

  // Insert the new donor into the database
  const drizzle = useDrizzle();
  const donor = await drizzle.query.donors.findFirst({
    where:  eq(tables.donors.id, body.donorId)
  });

  console.log({
    donor
  })

  if(!donor) {
    return {
      status: 'error',
      message: 'Donor not found'
    }
  }

  const donation = await drizzle.insert(tables.donations).values({
    ...body,
    createdAt: body.createdAt || new Date() // Use current timestamp if not provided
  }).returning();

  const { send } = useEmail()

  const itemCounts = Object.entries<any>(body.itemCounts)
      .filter(([itemType, count]) => count > 0)
      .map(([itemType, count]) => {
        return `${itemType} - ${count} units`
  });

  try {
    if (donor.email) {
      await send({
        to: donor.email,
        from: 'office@cincinnaticomputercooperative.org',
        subject: 'Thank you for your donation!',
        text: [
            `Thank you for your donation to Cincinnati Computer Reuse!`,
            '',
            ...itemCounts,
            '',
        ].join("\n"),
      });
    }
  } catch (e) {
    console.log('Error sending email', e)
  }

  return {
    status: 'success',
    message: 'Donation created successfully',
    donation
  };
});
