export const activationEmailTemplate = (activationLink) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Welcome to ApiCenar!</h2>
    <p>Please click the button below to activate your account:</p>
    <a href="${activationLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
      Activate Account
    </a>
    <p>Or copy and paste this link into your browser:</p>
    <p>${activationLink}</p>
    <p>This link will expire in 24 hours.</p>
    <hr />
    <p style="color: #666; font-size: 12px;">If you didn't create an account with ApiCenar, please ignore this email.</p>
  </div>
`;

export const passwordResetEmailTemplate = (resetLink) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Reset Your Password</h2>
    <p>You requested to reset your password. Click the button below to proceed:</p>
    <a href="${resetLink}" style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
      Reset Password
    </a>
    <p>Or copy and paste this link into your browser:</p>
    <p>${resetLink}</p>
    <p>This link will expire in 1 hour.</p>
    <hr />
    <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
  </div>
`;