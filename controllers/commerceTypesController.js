import { validationResult } from 'express-validator';
import * as commerceTypesService from '../services/commerceTypesService.js';

export const getCommerceTypes = async (req, res) => {
  try {
    const result = await commerceTypesService.getCommerceTypesAdminService(req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getCommerceTypeById = async (req, res) => {
  try {
    const data = await commerceTypesService.getCommerceTypeByIdService(req.params.id);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const createCommerceType = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const data = await commerceTypesService.createCommerceTypeService(req.body, req.file);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const updateCommerceType = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const data = await commerceTypesService.updateCommerceTypeService(req.params.id, req.body, req.file);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const deleteCommerceType = async (req, res) => {
  try {
    await commerceTypesService.deleteCommerceTypeService(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};