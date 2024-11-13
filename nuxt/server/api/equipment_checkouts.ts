import { useDrizzle } from "~/server/utils/drizzle";
import * as tables from "../database/schema";
import { isNull, and } from "drizzle-orm";

export default eventHandler(async (event) => {
  // Get drizzle instance
  const drizzle = useDrizzle();

  // Fetch all non-approved equipment requests
  const nonApprovedRequests = await drizzle.query.equipmentCheckOuts.findMany({
    where: and(isNull(tables.equipmentCheckOuts.approvedBy), isNull(tables.equipmentCheckOuts.deniedAt)),
    with: {
      volunteer: true
    }
  });

  return {
    status: "success",
    data: nonApprovedRequests,
  };
});
