import { Resend } from 'resend';
import dotenv from 'dotenv';
import { activationEmailTemplate, passwordResetEmailTemplate } from '../templates/emailTemplates.js';

dotenv.config();

const sendEmail = async ({ to, subject, html }) => {
  try {
  
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'ApiCenar <hola@appcenar.candelapereyra.site>',
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log(`Email enviado con éxito a: ${to}`);
    return data;
  } catch (error) {
    console.error(' Error enviando email con Resend:', error);
    throw new Error('Could not send email');
  }
};

export const sendActivationEmail = async (email, token) => {
  const activationLink = `${process.env.APP_URL}/api/auth/confirm-email?token=${token}`;
  
  const html = activationEmailTemplate(activationLink);
  return sendEmail({
    to: email,
    subject: 'Activa tu cuenta de ApiCenar',
    html,
  });
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;
  
  const html = passwordResetEmailTemplate(resetLink);
  return sendEmail({
    to: email,
    subject: 'Recupera tu contraseña de ApiCenar',
    html,
  });
};