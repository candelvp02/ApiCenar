import CommerceType from '../models/CommerceType.js';
import Commerce from '../models/Commerce.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Favorite from '../models/Favorite.js';

export const getCommerceTypesAdminService = async ({ search, page = 1, pageSize = 10, sortBy = 'name', sortDirection = 'asc' }) => {
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

export const getCommerceTypeByIdService = async (id) => {
  const type = await CommerceType.findById(id);
  if (!type) throw { status: 404, message: 'Tipo de comercio no encontrado' };
  return type;
};

export const createCommerceTypeService = async (data, file) => {
  const { name } = data;
  return CommerceType.create({
    name,
    icon: file ? `/public/assets/${file.filename}` : null,
  });
};

export const updateCommerceTypeService = async (id, data, file) => {
  const type = await CommerceType.findById(id);
  if (!type) throw { status: 404, message: 'Tipo de comercio no encontrado' };

  const updateData = { ...data };
  if (file) updateData.icon = `/public/assets/${file.filename}`;

  return CommerceType.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteCommerceTypeService = async (id) => {
  const type = await CommerceType.findById(id);
  if (!type) throw { status: 404, message: 'Tipo de comercio no encontrado' };

  const commerces = await Commerce.find({ commerceTypeId: id });
  for (const commerce of commerces) {
    const user = await User.findById(commerce.userId);

    const categories = await Category.find({ commerceId: commerce._id });
    for (const cat of categories) {
      await Product.deleteMany({ categoryId: cat._id });
    }
    await Category.deleteMany({ commerceId: commerce._id });
    await Product.deleteMany({ commerceId: commerce._id });

    await Order.deleteMany({ commerceId: commerce._id });
    await Favorite.deleteMany({ commerceId: commerce._id });

    await Commerce.findByIdAndDelete(commerce._id);
    if (user) await User.findByIdAndDelete(user._id);
  }

  await CommerceType.findByIdAndDelete(id);
};