import { migrate } from "drizzle-orm/better-sqlite3/migrator";

export default defineNitroPlugin(async (nitroApp) => {
  console.log(`Registering Nitro Plugin for Drizzle`);

  onHubReady(async () => {
    console.log("onHubReady");

    let migrationsFolder = "server/database/migrations";
    if (process.env.MIGRATIONS_FOLDER) {
      migrationsFolder = process.env.MIGRATIONS_FOLDER;
    }
    console.log(`Migrations Folder: ${migrationsFolder}`);

    migrate(useDrizzle(), { migrationsFolder });
    console.log("onHubReady done");
  });
});