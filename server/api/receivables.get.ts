import {useDrizzle} from "~/server/utils/drizzle";
import * as tables from "../database/schema";

export default eventHandler(async () => {
  const receivables = await useDrizzle().select().from(tables.receivables).all()

  return receivables
})
