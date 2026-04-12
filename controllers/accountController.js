import { validationResult } from 'express-validator';
import * as accountService from '../services/accountService.js';

export const getProfile = async (req, res) => {
  try {
    const profile = await accountService.getProfileService(req.user._id);
    res.status(200).json(profile);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const updated = await accountService.updateProfileService(req.user._id, req.body, req.file);
    res.status(200).json(updated);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};