import {useDrizzle} from "~/server/utils/drizzle";


export default eventHandler(async (event) => {

    const id = parseInt(getRouterParam(event, 'id')!)

    return useDrizzle().query.donations.findFirst({
        where: (donations, {eq}) => eq(donations.id, id),
        with: {
            donor: true,
        }
    })

})
