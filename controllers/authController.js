import { promisify } from 'util';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Token from '../models/Token.js';
import Commerce from '../models/Commerce.js';
import CommerceType from '../models/CommerceType.js';
import { sendActivationEmail, sendPasswordResetEmail } from '../utils/emailService.js';

const signJwt = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};

const generateToken = async () => {
  const randomBytesAsync = promisify(randomBytes);
  const buffer = await randomBytesAsync(32);
  return buffer.toString('hex');
};

export async function Login(req, res, next) {
  const { userNameOrEmail, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }],
    });

    if (!user) {
      const error = new Error('Credenciales inválidas.');
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error('Cuenta inactiva. Por favor confirma tu correo.');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error('Credenciales inválidas.');
      error.statusCode = 401;
      throw error;
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const token = signJwt({ id: user._id, role: user.role });

    res.status(200).json({
      token,
      expiresAt,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function RegisterClient(req, res, next) {
  const { firstName, lastName, userName, email, password, confirmPassword, phone } = req.body;

  try {
    if (password !== confirmPassword) {
      const error = new Error('Las contraseñas no coinciden.');
      error.statusCode = 400;
      throw error;
    }

    const existing = await User.findOne({ $or: [{ userName }, { email }] });
    if (existing) {
      const error = new Error(existing.userName === userName ? 'El userName ya existe.' : 'El email ya existe.');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = await generateToken();

    await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      phone,
      profileImage: req.file ? `/public/assets/${req.file.filename}` : null,
      role: 'Client',
      isActive: false,
    });

    await Token.create({
      userId: (await User.findOne({ email }))._id,
      token: activationToken,
      type: 'activation',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await sendActivationEmail(email, activationToken);

    res.status(201).json({
      message: 'Cliente registrado. Revisa tu correo para activar tu cuenta.',
      data: { email },
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function RegisterDelivery(req, res, next) {
  const { firstName, lastName, userName, email, password, confirmPassword, phone } = req.body;

  try {
    if (password !== confirmPassword) {
      const error = new Error('Las contraseñas no coinciden.');
      error.statusCode = 400;
      throw error;
    }

    const existing = await User.findOne({ $or: [{ userName }, { email }] });
    if (existing) {
      const error = new Error(existing.userName === userName ? 'El userName ya existe.' : 'El email ya existe.');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = await generateToken();

    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      phone,
      profileImage: req.file ? `/public/assets/${req.file.filename}` : null,
      role: 'Delivery',
      isActive: false,
      isAvailable: true,
    });

    await Token.create({
      userId: user._id,
      token: activationToken,
      type: 'activation',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await sendActivationEmail(email, activationToken);

    res.status(201).json({
      message: 'Delivery registrado. Revisa tu correo para activar tu cuenta.',
      data: { email },
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function RegisterCommerce(req, res, next) {
  const { userName, email, password, confirmPassword, name, description, phone, openingTime, closingTime, commerceTypeId } = req.body;

  try {
    if (password !== confirmPassword) {
      const error = new Error('Las contraseñas no coinciden.');
      error.statusCode = 400;
      throw error;
    }

    const existing = await User.findOne({ $or: [{ userName }, { email }] });
    if (existing) {
      const error = new Error(existing.userName === userName ? 'El userName ya existe.' : 'El email ya existe.');
      error.statusCode = 409;
      throw error;
    }

    const commerceType = await CommerceType.findById(commerceTypeId);
    if (!commerceType) {
      const error = new Error('Tipo de comercio no encontrado.');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = await generateToken();

    const user = await User.create({
      firstName: name,
      lastName: '',
      userName,
      email,
      password: hashedPassword,
      phone,
      role: 'Commerce',
      isActive: false,
    });

    await Commerce.create({
      userId: user._id,
      name,
      description: description || null,
      phone,
      openingTime,
      closingTime,
      commerceTypeId,
      logo: req.file ? `/public/assets/${req.file.filename}` : null,
    });

    await Token.create({
      userId: user._id,
      token: activationToken,
      type: 'activation',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await sendActivationEmail(email, activationToken);

    res.status(201).json({
      message: 'Comercio registrado. Revisa tu correo para activar tu cuenta.',
      data: { email },
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function ConfirmEmail(req, res, next) {
  const { token } = req.body;

  try {
    if (!token) {
      const error = new Error('Token es requerido.');
      error.statusCode = 400;
      throw error;
    }

    const record = await Token.findOne({ token, type: 'activation' });

    if (!record) {
      const error = new Error('Token no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    if (record.used || record.expiresAt < new Date()) {
      const error = new Error('Token inválido o expirado.');
      error.statusCode = 400;
      throw error;
    }

    await User.findByIdAndUpdate(record.userId, { isActive: true });
    record.used = true;
    await record.save();

    res.status(200).json({ message: 'Cuenta activada exitosamente.' });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function ForgotPassword(req, res, next) {
  const { userNameOrEmail } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }],
    });

    if (!user) {
      return res.status(200).json({ message: 'Si el usuario existe, se ha enviado un correo de recuperación.' });
    }

    const resetToken = await generateToken();

    await Token.create({
      userId: user._id,
      token: resetToken,
      type: 'reset',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({ message: 'Si el usuario existe, se ha enviado un correo de recuperación.' });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function ResetPassword(req, res, next) {
  const { token, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      const error = new Error('Las contraseñas no coinciden.');
      error.statusCode = 400;
      throw error;
    }

    const record = await Token.findOne({ token, type: 'reset' });

    if (!record || record.used || record.expiresAt < new Date()) {
      const error = new Error('Token inválido o expirado.');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(record.userId, { password: hashedPassword });

    record.used = true;
    await record.save();

    res.status(200).json({ message: 'Contraseña restablecida exitosamente.' });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function ForgotPassword(req, res, next) {
  const { userNameOrEmail } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }],
    });
    if (!user) {
      return res.status(200).json({ message: 'If an account exists, a reset link has been sent.' });
    }

    const resetToken = await generateToken();
    await Token.create({
      userId: user._id,
      token: resetToken,
      type: 'passwordReset',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
    });

    await sendPasswordResetEmail(user.email, resetToken);
    res.status(200).json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function ResetPassword(req, res, next) {
  const { token, password, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword) {
      const error = new Error('Passwords do not match.');
      error.statusCode = 400;
      throw error;
    }

    const resetToken = await Token.findOne({ token, type: 'passwordReset' });
    if (!resetToken || resetToken.expiresAt < new Date()) {
      const error = new Error('Invalid or expired token.');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(resetToken.userId, { password: hashedPassword });
    await Token.deleteOne({ _id: resetToken._id });

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}