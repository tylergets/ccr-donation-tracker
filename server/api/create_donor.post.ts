import { useDrizzle } from "~/server/utils/drizzle";
import * as tables from "../database/schema";

function castInt(input: boolean) {
  if(input) {
    return 1;
  }
  return 0;
}

export default eventHandler(async (event) => {
  // Read the body of the request
  const body = await readBody(event);

  // Insert the new donor into the database
  const drizzle = useDrizzle();
  const donor = await drizzle.insert(tables.donors).values({
    ...body,
    isIndividual: castInt(body.isIndividual),
    isBusiness: castInt(body.isBusiness),
    createdAt: body.createdAt || new Date() // Use current timestamp if not provided
  }).returning();

  return {
    status: 'success',
    message: 'Donor created successfully',
    donor
  };
});
