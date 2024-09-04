import {useDrizzle} from "~/server/utils/drizzle";
import {Parser} from '@json2csv/plainjs';
import {eq, between, gte, lte} from 'drizzle-orm'

export default eventHandler(async (event) => {

    const body = await readBody(event);

    function subtractHours(date: any, hours: any) {
        const dateCopy = new Date(date);
        dateCopy.setHours(dateCopy.getHours() - hours);
        return date;
    }

    const donations = await useDrizzle()
        .query
        .donations
        .findMany({
            where: (donations, { between }) => {
                const start = subtractHours(new Date(body.start), 5);
                const end = subtractHours(new Date(body.end), 5);
                if (body.start && body.end) {
                    return between(donations.createdAt, start, end);
                } else if (body.start) {
                    return gte(donations.createdAt, start);
                } else if (body.end) {
                    return lte(donations.createdAt, end);
                }
            },
            with: {
                donor: true,
            },
        })

    const parser = new Parser();
    return parser.parse(donations.map((donation) => {
        const {itemCounts, donor, ...rest} = donation;

        const counts: any = itemCounts;

        return {
            ...rest, ...donor, ...counts,
        }
    }));

});
