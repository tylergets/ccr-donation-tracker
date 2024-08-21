import {useDrizzle} from "~/server/utils/drizzle";


export default eventHandler(async (event) => {

    const id = parseInt(getRouterParam(event, 'id')!)

    return useDrizzle().query.donors.findFirst({
        where: (users, {eq}) => eq(users.id, id),
    })

})
