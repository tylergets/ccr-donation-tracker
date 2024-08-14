
import {sendDailyReport} from "~/server/tasks/daily_report";

export default eventHandler(async (event) => {
    return sendDailyReport();
});
