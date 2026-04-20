import nodemailer from 'nodemailer';
import { activationEmailTemplate, passwordResetEmailTemplate } from '../templates/emailTemplates.js';

// Convertimos esto en una función para que lea el .env en tiempo de ejecución, no de importación
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true para el puerto 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Función genérica para enviar correos
const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };

  try {
    // Instanciamos el transporter justo aquí
    const transporter = getTransporter(); 
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Could not send email');
  }
};

// Función para enviar correo de activación
export const sendActivationEmail = async (email, token) => {
  const activationLink = `${process.env.APP_URL}/api/auth/confirm-email?token=${token}`;
  const html = activationEmailTemplate(activationLink);
  return sendEmail({
    to: email,
    subject: 'Activate your ApiCenar account',
    html,
  });
};

// Función para enviar correo de recuperación de contraseña
export const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;
  const html = passwordResetEmailTemplate(resetLink);
  return sendEmail({
    to: email,
    subject: 'Reset your ApiCenar password',
    html,
  });
};