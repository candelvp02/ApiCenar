import nodemailer from 'nodemailer';

const createTransporter = () =>
  nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

export const sendActivationEmail = async (email, token) => {
  const transporter = createTransporter();
  const activationUrl = `${process.env.APP_URL}/api/auth/confirm-email?token=${token}`;

  await transporter.sendMail({
    from: `"ApiCenar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Activa tu cuenta en ApiCenar',
    html: `
      <h2>Bienvenido a ApiCenar</h2>
      <p>Por favor confirma tu cuenta haciendo clic en el siguiente enlace:</p>
      <a href="${activationUrl}">Activar cuenta</a>
      <p>Este enlace expira en 24 horas.</p>
    `,
  });
};

export const sendPasswordResetEmail = async (email, token) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"ApiCenar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Recuperación de contraseña - ApiCenar',
    html: `
      <h2>Recuperación de contraseña</h2>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetUrl}">Restablecer contraseña</a>
      <p>Este enlace expira en 1 hora.</p>
    `,
  });
};