import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Commerce from '../models/Commerce.js';

const getCommerceId = async (userId) => {
  const commerce = await Commerce.findOne({ userId });
  if (!commerce) throw { status: 404, message: 'Comercio no encontrado' };
  return commerce._id;
};

export const getMyProductsService = async (userId) => {
  const commerceId = await getCommerceId(userId);
  return Product.find({ commerceId }).populate('categoryId', 'name');
};

export const getProductByIdService = async (userId, id) => {
  const commerceId = await getCommerceId(userId);
  const product = await Product.findOne({ _id: id, commerceId }).populate('categoryId', 'name');
  if (!product) throw { status: 404, message: 'Producto no encontrado' };
  return product;
};

export const createProductService = async (userId, data, file) => {
  const commerceId = await getCommerceId(userId);

  const category = await Category.findOne({ _id: data.categoryId, commerceId });
  if (!category) throw { status: 400, message: 'Categoría inválida o no pertenece al comercio' };

  return Product.create({
    commerceId,
    ...data,
    image: file ? `/public/assets/${file.filename}` : null,
  });
};

export const updateProductService = async (userId, id, data, file) => {
  const commerceId = await getCommerceId(userId);

  if (data.categoryId) {
    const category = await Category.findOne({ _id: data.categoryId, commerceId });
    if (!category) throw { status: 400, message: 'Categoría inválida o no pertenece al comercio' };
  }

  const updateData = { ...data };
  if (file) updateData.image = `/public/assets/${file.filename}`;

  const product = await Product.findOneAndUpdate({ _id: id, commerceId }, updateData, { new: true });
  if (!product) throw { status: 404, message: 'Producto no encontrado' };
  return product;
};

export const deleteProductService = async (userId, id) => {
  const commerceId = await getCommerceId(userId);
  const product = await Product.findOneAndDelete({ _id: id, commerceId });
  if (!product) throw { status: 404, message: 'Producto no encontrado' };
};