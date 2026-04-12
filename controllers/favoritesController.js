import { validationResult } from 'express-validator';
import * as favoritesService from '../services/favoritesService.js';

export const getMyFavorites = async (req, res) => {
  try {
    const result = await favoritesService.getMyFavoritesService(req.user._id, req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const addFavorite = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const data = await favoritesService.addFavoriteService(req.user._id, req.body.commerceId);
    res.status(201).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    await favoritesService.removeFavoriteService(req.user._id, req.params.commerceId);
    res.status(204).send();
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};