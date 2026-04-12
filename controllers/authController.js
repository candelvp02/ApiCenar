import { validationResult } from 'express-validator';
import * as authService from '../services/authService.js';

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const result = await authService.loginService(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const registerClient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const data = { ...req.body };
    if (req.file) data.profileImage = `/public/assets/${req.file.filename}`;
    await authService.registerClientService(data);
    res.status(201).json({ message: 'Cliente registrado. Revisa tu correo para activar tu cuenta.' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const registerDelivery = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const data = { ...req.body };
    if (req.file) data.profileImage = `/public/assets/${req.file.filename}`;
    await authService.registerDeliveryService(data);
    res.status(201).json({ message: 'Delivery registrado. Revisa tu correo para activar tu cuenta.' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const registerCommerce = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const data = { ...req.body };
    if (req.file) data.logo = `/public/assets/${req.file.filename}`;
    await authService.registerCommerceService(data);
    res.status(201).json({ message: 'Comercio registrado. Revisa tu correo para activar tu cuenta.' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const confirmEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    await authService.confirmEmailService(req.body);
    res.status(200).json({ message: 'Cuenta activada exitosamente.' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    await authService.forgotPasswordService(req.body);
    res.status(200).json({ message: 'Si el usuario existe, se ha enviado un correo de recuperación.' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    await authService.resetPasswordService(req.body);
    res.status(200).json({ message: 'Contraseña restablecida exitosamente.' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};