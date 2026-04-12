import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import Commerce from '../models/Commerce.js';
import Token from '../models/Token.js';
import CommerceType from '../models/CommerceType.js';
import { sendActivationEmail, sendPasswordResetEmail } from './emailService.js';

export const loginService = async ({ userNameOrEmail, password }) => {
  const user = await User.findOne({
    $or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }],
  });

  if (!user) throw { status: 401, message: 'Credenciales inválidas' };
  if (!user.isActive) throw { status: 401, message: 'Cuenta inactiva. Por favor confirma tu correo.' };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw { status: 401, message: 'Credenciales inválidas' };

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return {
    token,
    expiresAt,
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    },
  };
};

const registerUser = async (data, role) => {
  const { firstName, lastName, userName, email, password, phone, profileImage } = data;

  const exists = await User.findOne({ $or: [{ userName }, { email }] });
  if (exists) {
    if (exists.userName === userName) throw { status: 409, message: 'El userName ya existe' };
    throw { status: 409, message: 'El email ya existe' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    firstName,
    lastName,
    userName,
    email,
    password: hashedPassword,
    phone,
    profileImage: profileImage || null,
    role,
    isActive: false,
  });

  const activationToken = uuidv4();
  await Token.create({
    userId: user._id,
    token: activationToken,
    type: 'activation',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  await sendActivationEmail(email, activationToken);
  return user;
};

export const registerClientService = async (data) => registerUser(data, 'Client');

export const registerDeliveryService = async (data) => {
  const user = await registerUser(data, 'Delivery');
  return user;
};

export const registerCommerceService = async (data) => {
  const {
    userName, email, password, phone, name, description,
    openingTime, closingTime, commerceTypeId, logo,
  } = data;

  const exists = await User.findOne({ $or: [{ userName }, { email }] });
  if (exists) {
    if (exists.userName === userName) throw { status: 409, message: 'El userName ya existe' };
    throw { status: 409, message: 'El email ya existe' };
  }

  const commerceType = await CommerceType.findById(commerceTypeId);
  if (!commerceType) throw { status: 400, message: 'Tipo de comercio no encontrado' };

  const hashedPassword = await bcrypt.hash(password, 10);

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
    logo: logo || null,
  });

  const activationToken = uuidv4();
  await Token.create({
    userId: user._id,
    token: activationToken,
    type: 'activation',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  await sendActivationEmail(email, activationToken);
  return user;
};

export const confirmEmailService = async ({ token }) => {
  const record = await Token.findOne({ token, type: 'activation' });
  if (!record) throw { status: 404, message: 'Token no encontrado' };
  if (record.used || record.expiresAt < new Date()) {
    throw { status: 400, message: 'Token inválido o expirado' };
  }

  await User.findByIdAndUpdate(record.userId, { isActive: true });
  record.used = true;
  await record.save();
};

export const forgotPasswordService = async ({ userNameOrEmail }) => {
  const user = await User.findOne({
    $or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }],
  });
  if (!user) return;

  const resetToken = uuidv4();
  await Token.create({
    userId: user._id,
    token: resetToken,
    type: 'reset',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });

  await sendPasswordResetEmail(user.email, resetToken);
};

export const resetPasswordService = async ({ token, password }) => {
  const record = await Token.findOne({ token, type: 'reset' });
  if (!record) throw { status: 400, message: 'Token inválido' };
  if (record.used || record.expiresAt < new Date()) {
    throw { status: 400, message: 'Token inválido o expirado' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(record.userId, { password: hashedPassword });
  record.used = true;
  await record.save();
};