import axios from 'axios';
import Config from '../config/index.js';

export const sendOtpEmail = async (to, subject, html) => {
  try {
    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { email: Config.email, name: 'KitchenPulse' },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          'api-key': Config.brevoApiKey,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Email error:', error.response?.data || error.message);
    throw new Error('Email sending failed');
  }
};
