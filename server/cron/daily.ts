// server/cron/job.ts
import { defineCronHandler } from '#nuxt/cron'
import {sendDailyReport} from "~/server/tasks/daily_report";

export default defineCronHandler(() => '0 17 * * *', async () => {
    console.log(await sendDailyReport());
})