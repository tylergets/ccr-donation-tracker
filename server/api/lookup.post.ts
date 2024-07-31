import {useDrizzle} from "~/server/utils/drizzle";
import * as tables from "../database/schema";
import { eq } from 'drizzle-orm';

export default eventHandler(async (event) => {

  const {phone, email, lastName} = await readBody(event);
  const conditions: any = [];

  if(phone) {
    conditions.push(eq(tables.donors.phone, phone));
  } else if (email) {
    conditions.push(eq(tables.donors.email, email));
  } else if (lastName) {
    conditions.push(eq(tables.donors.lastName, lastName));
  } else {
    throw new Error('No lookup condition provided');
  }

  return useDrizzle().select().from(tables.donors).where(conditions).execute()

})
