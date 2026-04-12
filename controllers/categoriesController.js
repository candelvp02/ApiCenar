import { validationResult } from 'express-validator';
import * as categoriesService from '../services/categoriesService.js';

export const getMyCategories = async (req, res) => {
  try {
    const data = await categoriesService.getMyCategoriesService(req.user._id);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const data = await categoriesService.getCategoryByIdService(req.user._id, req.params.id);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const data = await categoriesService.createCategoryService(req.user._id, req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const data = await categoriesService.updateCategoryService(req.user._id, req.params.id, req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await categoriesService.deleteCategoryService(req.user._id, req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};