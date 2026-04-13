import Favorite from '../models/Favorite.js';
import Commerce from '../models/Commerce.js';
import User from '../models/User.js';

export async function GetMyFavorites(req, res, next) {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      Favorite.find({ clientId: req.user._id })
        .skip(skip)
        .limit(Number(pageSize))
        .populate({ path: 'commerceId', populate: { path: 'commerceTypeId', select: 'name icon' } }),
      Favorite.countDocuments({ clientId: req.user._id }),
    ]);

    res.status(200).json({ data, total, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function AddFavorite(req, res, next) {
  const { commerceId } = req.body;

  try {
    const commerce = await Commerce.findById(commerceId);
    if (!commerce) {
      const error = new Error('Comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const commerceUser = await User.findById(commerce.userId);
    if (!commerceUser || !commerceUser.isActive) {
      const error = new Error('El comercio no está activo.');
      error.statusCode = 400;
      throw error;
    }

    const exists = await Favorite.findOne({ clientId: req.user._id, commerceId });
    if (exists) {
      const error = new Error('El comercio ya está en favoritos.');
      error.statusCode = 409;
      throw error;
    }

    const favorite = await Favorite.create({ clientId: req.user._id, commerceId });
    res.status(201).json(favorite);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function RemoveFavorite(req, res, next) {
  try {
    const favorite = await Favorite.findOneAndDelete({
      clientId: req.user._id,
      commerceId: req.params.commerceId,
    });

    if (!favorite) {
      const error = new Error('Favorito no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    res.status(204).send();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}