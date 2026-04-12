import { validationResult } from 'express-validator';
import * as adminUsersService from '../services/adminUsersService.js';

export const getClients = async (req, res) => {
  try {
    const result = await adminUsersService.getClientsService(req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getDeliveries = async (req, res) => {
  try {
    const result = await adminUsersService.getDeliveriesService(req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getCommerces = async (req, res) => {
  try {
    const result = await adminUsersService.getCommercesService(req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const result = await adminUsersService.getAdminsService(req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const createAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const result = await adminUsersService.createAdminService(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const updateAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const result = await adminUsersService.updateAdminService(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const updateUserStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const result = await adminUsersService.updateUserStatusService(req.user._id, req.params.id, req.body.isActive);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};