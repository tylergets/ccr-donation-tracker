import {useDrizzle} from "~/server/utils/drizzle";
import {useEmail} from "~/server/utils/email";

function getStartOfToday() {
    const start = new Date();
    start.setUTCHours(0,0,0,0);
    return start;
}

export async function sendDailyReport() {
    const drizzle = useDrizzle();

    // Get the start of today as a UNIX timestamp
    const startOfToday = getStartOfToday();

    // Query donations created today
    const donations = await drizzle.query.donations.findMany({
        where: (donation, { gt }) => gt(donation.createdAt, getStartOfToday()),
        with: {
            donor: true,
        }
    });

    const { send } = useEmail();

    try {
        await send({
            to: process.env.MAIL_FROM ?? 'office@ccreuse.org',
            from: process.env.MAIL_FROM ?? 'office@ccreuse.org',
            subject: 'Daily Donation Report',
            text: [
                'Donations for Today',
                '',
                ...donations.map<any>((d) => {
                    return `#${d.id} - ${d.donor.firstName} ${d.donor.lastName} - ${d.centsReceived ? '$' + d.centsReceived : 'No Money Received'}`
                }),
            ].join("\n"),
        });
    } catch (e) {
        console.log('Error sending email', e);
    }

    return {
        status: 'success',
    };
}