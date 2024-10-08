
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST ?? "localhost", 
    port: process.env.MAIL_HOST === undefined ? 1025 : 587,
    tls: {rejectUnauthorized: false},
    ...process.env.MAIL_HOST === undefined ? {} : {
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    },
  });

export function useEmail() {
    return {
        send: async ({ to, subject, text }: any) => {
            console.log(`Sending email to ${to}`);
            const result = await transport.sendMail({
                from: process.env.MAIL_FROM ?? 'office@ccreuse.org',
                to,
                subject,
                text,
            });
            console.log(result);
            return result;
        }
    };

}