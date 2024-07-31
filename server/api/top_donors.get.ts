import {useDrizzle} from "~/server/utils/drizzle";
import {donations, donors} from "../database/schema";
import {asc, count, desc, sum, getTableColumns} from "drizzle-orm";

export default eventHandler(async (event) => {

    const db = useDrizzle();

    return db
        .select({
            ...getTableColumns(donors),
            totalCount: sum(donations.totalCount)
        })
        .from(donors)
        .leftJoin(donations, eq(donors.id, donations.donorId))
        .orderBy(desc(sum(donations.totalCount)))
        .groupBy(donors.id)

});
