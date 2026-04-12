import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Commerce from '../models/Commerce.js';

const getCommerceId = async (userId) => {
  const commerce = await Commerce.findOne({ userId });
  if (!commerce) throw { status: 404, message: 'Comercio no encontrado' };
  return commerce._id;
};

export const getMyCategoriesService = async (userId) => {
  const commerceId = await getCommerceId(userId);
  const categories = await Category.find({ commerceId });

  return Promise.all(
    categories.map(async (cat) => {
      const productCount = await Product.countDocuments({ categoryId: cat._id });
      return { ...cat.toObject(), productCount };
    })
  );
};

export const getCategoryByIdService = async (userId, id) => {
  const commerceId = await getCommerceId(userId);
  const category = await Category.findOne({ _id: id, commerceId });
  if (!category) throw { status: 404, message: 'Categoría no encontrada' };
  const productCount = await Product.countDocuments({ categoryId: category._id });
  return { ...category.toObject(), productCount };
};

export const createCategoryService = async (userId, data) => {
  const commerceId = await getCommerceId(userId);
  return Category.create({ commerceId, ...data });
};

export const updateCategoryService = async (userId, id, data) => {
  const commerceId = await getCommerceId(userId);
  const category = await Category.findOneAndUpdate({ _id: id, commerceId }, data, { new: true });
  if (!category) throw { status: 404, message: 'Categoría no encontrada' };
  return category;
};

export const deleteCategoryService = async (userId, id) => {
  const commerceId = await getCommerceId(userId);
  const category = await Category.findOneAndDelete({ _id: id, commerceId });
  if (!category) throw { status: 404, message: 'Categoría no encontrada' };
};