import { validationResult } from 'express-validator';
import * as productsService from '../services/productsService.js';

export const getMyProducts = async (req, res) => {
  try {
    const data = await productsService.getMyProductsService(req.user._id);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const data = await productsService.getProductByIdService(req.user._id, req.params.id);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const data = await productsService.createProductService(req.user._id, req.body, req.file);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const data = await productsService.updateProductService(req.user._id, req.params.id, req.body, req.file);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await productsService.deleteProductService(req.user._id, req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};