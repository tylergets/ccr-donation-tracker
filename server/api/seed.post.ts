import {useDrizzle} from "~/server/utils/drizzle";
import * as tables from "../database/schema";
import {seedDb} from "~/server/tasks/seed";

export default eventHandler(async () => {
  return await seedDb();
})
