import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../database/schema";

export { sql, eq, and, or } from "drizzle-orm";

export const tables = schema;

const sqlite = new Database(process.env.DATABASE_PATH ?? "db.sqlite");

export function useDrizzle() {
  return drizzle(sqlite, { schema });
}

export type Donors = typeof schema.donors.$inferSelect
export type Donations = typeof schema.donations.$inferSelect
export type Receivables = typeof schema.receivables.$inferSelect
