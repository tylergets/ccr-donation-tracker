
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST ?? "localhost", 
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

export function useEmail() {
    return {
        send: async ({ to, subject, text }: any) => {
            return transport.sendMail({
                from: process.env.MAIL_FROM ?? 'office@ccreuse.org',
                to,
                subject,
                text,
            });
        }
    };

}