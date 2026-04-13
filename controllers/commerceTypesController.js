import CommerceType from '../models/CommerceType.js';
import Commerce from '../models/Commerce.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Favorite from '../models/Favorite.js';

export async function GetCommerceTypes(req, res, next) {
  try {
    const { search, page = 1, pageSize = 10, sortBy = 'name', sortDirection = 'asc' } = req.query;

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

export async function GetCommerceTypeById(req, res, next) {
  try {
    const type = await CommerceType.findById(req.params.id);

    if (!type) {
      const error = new Error('Tipo de comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(type);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function CreateCommerceType(req, res, next) {
  const { name } = req.body;

  try {
    const type = await CommerceType.create({
      name,
      icon: req.file ? `/public/assets/${req.file.filename}` : null,
    });

    res.status(201).json(type);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function UpdateCommerceType(req, res, next) {
  try {
    const type = await CommerceType.findById(req.params.id);
    if (!type) {
      const error = new Error('Tipo de comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const updateData = { ...req.body };
    if (req.file) updateData.icon = `/public/assets/${req.file.filename}`;

    const updated = await CommerceType.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function DeleteCommerceType(req, res, next) {
  try {
    const type = await CommerceType.findById(req.params.id);
    if (!type) {
      const error = new Error('Tipo de comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const commerces = await Commerce.find({ commerceTypeId: req.params.id });

    for (const commerce of commerces) {
      const categories = await Category.find({ commerceId: commerce._id });
      for (const cat of categories) {
        await Product.deleteMany({ categoryId: cat._id });
      }
      await Category.deleteMany({ commerceId: commerce._id });
      await Product.deleteMany({ commerceId: commerce._id });
      await Order.deleteMany({ commerceId: commerce._id });
      await Favorite.deleteMany({ commerceId: commerce._id });
      await Commerce.findByIdAndDelete(commerce._id);
      await User.findByIdAndDelete(commerce.userId);
    }

    await CommerceType.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}