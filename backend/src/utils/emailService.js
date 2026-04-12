import nodemailer from 'nodemailer';
import Config from '../config/index.js';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: Config.email,
    pass: Config.emailPassword,
  },
});

export const sendOtpEmail = async (to, subject, html) => {
  await transporter.sendMail({ from: Config.email, to, subject, html });
};
