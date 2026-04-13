import CommerceType from '../models/CommerceType.js';
import Commerce from '../models/Commerce.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Favorite from '../models/Favorite.js';
import User from '../models/User.js';

export async function GetCommerceTypes(req, res, next) {
  try {
    const { page = 1, pageSize = 10, search, sortBy = 'name', sortDirection = 'asc' } = req.query;

    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };

    const sort = { [sortBy]: sortDirection === 'desc' ? -1 : 1 };
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      CommerceType.find(query).sort(sort).skip(skip).limit(Number(pageSize)),
      CommerceType.countDocuments(query),
    ]);

    res.status(200).json({ data, total, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function GetCommercesByType(req, res, next) {
  try {
    const { commerceTypeId, search, page = 1, pageSize = 10, sortBy = 'name', sortDirection = 'asc' } = req.query;

    const activeUserIds = (await User.find({ role: 'Commerce', isActive: true }).select('_id')).map((u) => u._id);

    const query = { userId: { $in: activeUserIds } };
    if (commerceTypeId) query.commerceTypeId = commerceTypeId;
    if (search) query.name = { $regex: search, $options: 'i' };

    const sort = { [sortBy]: sortDirection === 'desc' ? -1 : 1 };
    const skip = (page - 1) * pageSize;

    const [commerces, total] = await Promise.all([
      Commerce.find(query).sort(sort).skip(skip).limit(Number(pageSize)).populate('commerceTypeId', 'name icon'),
      Commerce.countDocuments(query),
    ]);

    const favorites = await Favorite.find({ clientId: req.user._id }).select('commerceId');
    const favoriteIds = favorites.map((f) => f.commerceId.toString());

    const data = commerces.map((c) => ({
      ...c.toObject(),
      isFavorite: favoriteIds.includes(c._id.toString()),
    }));

    res.status(200).json({ data, total, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function GetCommerceCatalog(req, res, next) {
  try {
    const commerce = await Commerce.findById(req.params.commerceId);
    if (!commerce) {
      const error = new Error('Comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const commerceUser = await User.findById(commerce.userId);
    if (!commerceUser || !commerceUser.isActive) {
      const error = new Error('Comercio no disponible.');
      error.statusCode = 404;
      throw error;
    }

    const categories = await Category.find({ commerceId: commerce._id });

    const catalog = await Promise.all(
      categories.map(async (cat) => {
        const products = await Product.find({ categoryId: cat._id, commerceId: commerce._id, isActive: true });
        return { ...cat.toObject(), products };
      })
    );

    res.status(200).json({ commerce, catalog });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}