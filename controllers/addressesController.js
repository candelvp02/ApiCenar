import { validationResult } from 'express-validator';
import * as addressesService from '../services/addressesService.js';

export const getMyAddresses = async (req, res) => {
  try {
    const data = await addressesService.getMyAddressesService(req.user._id);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const data = await addressesService.getAddressByIdService(req.user._id, req.params.id);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const createAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const data = await addressesService.createAddressService(req.user._id, req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const updateAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const data = await addressesService.updateAddressService(req.user._id, req.params.id, req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    await addressesService.deleteAddressService(req.user._id, req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};