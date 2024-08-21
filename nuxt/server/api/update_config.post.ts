import { useDrizzle } from "~/server/utils/drizzle";
import * as tables from "../database/schema";

export default eventHandler(async (event) => {
  // Read the body of the request
  const body = await readBody(event);

  // Insert the new donor into the database
  const drizzle = useDrizzle();
  const donor = await drizzle.update(tables.config).set({
    value: body.value,
  }).where(eq(tables.config.key, body.key)).returning();

  return {
    status: 'success',
    message: 'Config updated successfully',
    donor
  };
});
