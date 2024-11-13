import { useDrizzle } from "~/server/utils/drizzle";
import * as tables from "../database/schema";

export default eventHandler(async (event) => {
  const drizzle = useDrizzle();

  try {
    const items = await drizzle
        .select()
        .from(tables.config)
        .execute();

    // Convert the array of config items into an object
    const configObject = items.reduce((acc, item) => {
      //@ts-ignore
      acc[item.key] = item.value;
      return acc;
    }, {});

    return configObject;
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "An error occurred while retrieving the config.",
    };
  }
});
