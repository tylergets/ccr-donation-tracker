import {useDrizzle} from "~/server/utils/drizzle";
import {donations, donors} from "../database/schema";
import {asc, count, desc, sum, getTableColumns} from "drizzle-orm";

export default eventHandler(async (event) => {

    const db = useDrizzle();

    return db.query.donations.findMany({
        with: {
            donor: true
        }
    })

});
