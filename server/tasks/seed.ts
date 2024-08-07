import {useDrizzle} from "~/server/utils/drizzle";
import * as tables from "../database/schema";

export async function seedDb() {
  console.log('Running DB seed task...')

  const itemTypes = [
    "Desktops",
    "Laptops",
    "Servers",
    "Portable Electronics",
    "CRT Monitor",
    "LCD Monitor",
    "Network Device",
    "UPS",
    "Printer",
    "Box of Accessories",
    "Boxes of Wires"
  ];

  await useDrizzle().insert(tables.receivables).values(itemTypes.map((item) => {
    return {
      name: item,
      createdAt: new Date(),
    }
  }));

  return {result: 'success'}
}

export default defineTask({
  meta: {
    name: 'db:seed',
    description: 'Run database seed task'
  },
  async run() {
    return await seedDb();
  }
})
