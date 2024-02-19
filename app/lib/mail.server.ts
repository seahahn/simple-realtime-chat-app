import nodemailer from "nodemailer";
import {
  EMAIL_DEFAULT_FROM,
  EMAIL_HOST,
  EMAIL_HOST_PASSWORD,
  EMAIL_HOST_USER,
  EMAIL_PORT,
} from "~/constants/envs";
import Mail from "nodemailer/lib/mailer";

const transport = nodemailer.createTransport({
  pool: true,
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: true, // use TLS
  auth: {
    user: EMAIL_HOST_USER,
    pass: EMAIL_HOST_PASSWORD,
  },
});

const sendMail = async ({subject, from = EMAIL_DEFAULT_FROM, to, html}: Mail.Options) =>
  await transport.sendMail({
    subject,
    from,
    to,
    html,
  });

export default sendMail;
