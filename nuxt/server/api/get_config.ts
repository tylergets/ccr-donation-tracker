import { useDrizzle } from "~/server/utils/drizzle";
import * as tables from "../database/schema";

export default eventHandler(async (event) => {
  const drizzle = useDrizzle();
  const configItems = await drizzle.query.config.findMany();

  const config = configItems.reduce<any>((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

  return {
    status: "success",
    config,
  };
});
