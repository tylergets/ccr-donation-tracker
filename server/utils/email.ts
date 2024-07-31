
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
});

export function useEmail() {
    return {
        send: async ({ to, subject, text }: any) => {
            return transport.sendMail({
                from: 'office@cincinnaticomputercooperative.org',
                to,
                subject,
                text,
            });
        }
    };

}