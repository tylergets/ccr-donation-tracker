import { useDrizzle } from "~/server/utils/drizzle";
import * as tables from "../database/schema";

export default eventHandler(async (event) => {
  const body = await readBody(event);

  const drizzle = useDrizzle();

  const returnData = [];
  for (const [key, value] of Object.entries(body) as any) {
    console.log({ key, value });
    // const item = await drizzle
    //   .update(tables.config)
    //   .set({
    //     value: value,
    //   })
    //   .where(eq(tables.config.key, key))
    //   .returning();
    const item = await drizzle
      .insert(tables.config)
      .values({
        key,
        value,
        createdAt: new Date(),
      } as any)
      .onConflictDoUpdate({
        target: tables.config.key,
        set: { value },
      });
    returnData.push(item);
  }

  return {
    status: "success",
    message: "Config updated successfully",
    returnData,
  };
});
