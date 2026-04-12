import Favorite from '../models/Favorite.js';
import Commerce from '../models/Commerce.js';
import User from '../models/User.js';

export const getMyFavoritesService = async (clientId, { page = 1, pageSize = 10 }) => {
  const skip = (page - 1) * pageSize;
  const [data, total] = await Promise.all([
    Favorite.find({ clientId }).skip(skip).limit(Number(pageSize)).populate({
      path: 'commerceId',
      populate: { path: 'commerceTypeId', select: 'name icon' },
    }),
    Favorite.countDocuments({ clientId }),
  ]);
  return { data, total, page: Number(page), pageSize: Number(pageSize) };
};

export const addFavoriteService = async (clientId, commerceId) => {
  const commerce = await Commerce.findById(commerceId);
  if (!commerce) throw { status: 404, message: 'Comercio no encontrado' };

  const user = await User.findById(commerce.userId);
  if (!user || !user.isActive) throw { status: 400, message: 'El comercio no está activo' };

  const exists = await Favorite.findOne({ clientId, commerceId });
  if (exists) throw { status: 409, message: 'El comercio ya está en favoritos' };

  return Favorite.create({ clientId, commerceId });
};

export const removeFavoriteService = async (clientId, commerceId) => {
  const favorite = await Favorite.findOneAndDelete({ clientId, commerceId });
  if (!favorite) throw { status: 404, message: 'Favorito no encontrado' };
};