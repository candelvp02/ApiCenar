import CommerceType from '../models/CommerceType.js';
import Commerce from '../models/Commerce.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Favorite from '../models/Favorite.js';
import User from '../models/User.js';

export const getCommerceTypesService = async ({ page = 1, pageSize = 10, search, sortBy = 'name', sortDirection = 'asc' }) => {
  const query = {};
  if (search) query.name = { $regex: search, $options: 'i' };

  const sort = { [sortBy]: sortDirection === 'desc' ? -1 : 1 };
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    CommerceType.find(query).sort(sort).skip(skip).limit(Number(pageSize)),
    CommerceType.countDocuments(query),
  ]);

  return { data, total, page: Number(page), pageSize: Number(pageSize) };
};

export const getCommercesByTypeService = async (clientId, { commerceTypeId, search, page = 1, pageSize = 10, sortBy = 'name', sortDirection = 'asc' }) => {
  const userQuery = { role: 'Commerce', isActive: true };
  const activeUserIds = (await User.find(userQuery).select('_id')).map((u) => u._id);

  const query = { userId: { $in: activeUserIds } };
  if (commerceTypeId) query.commerceTypeId = commerceTypeId;
  if (search) query.name = { $regex: search, $options: 'i' };

  const sort = { [sortBy]: sortDirection === 'desc' ? -1 : 1 };
  const skip = (page - 1) * pageSize;

  const [commerces, total] = await Promise.all([
    Commerce.find(query).sort(sort).skip(skip).limit(Number(pageSize)).populate('commerceTypeId', 'name icon'),
    Commerce.countDocuments(query),
  ]);

  const favorites = await Favorite.find({ clientId }).select('commerceId');
  const favoriteIds = favorites.map((f) => f.commerceId.toString());

  const data = commerces.map((c) => ({
    ...c.toObject(),
    isFavorite: favoriteIds.includes(c._id.toString()),
  }));

  return { data, total, page: Number(page), pageSize: Number(pageSize) };
};

export const getCommerceCatalogService = async (commerceId) => {
  const commerce = await Commerce.findById(commerceId);
  if (!commerce) throw { status: 404, message: 'Comercio no encontrado' };

  const user = await User.findById(commerce.userId);
  if (!user || !user.isActive) throw { status: 404, message: 'Comercio no disponible' };

  const categories = await Category.find({ commerceId });

  const catalog = await Promise.all(
    categories.map(async (cat) => {
      const products = await Product.find({ categoryId: cat._id, commerceId, isActive: true });
      return { ...cat.toObject(), products };
    })
  );

  return { commerce, catalog };
};