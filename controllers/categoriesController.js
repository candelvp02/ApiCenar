import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Commerce from '../models/Commerce.js';

export async function GetMyCategories(req, res, next) {
  try {
    const commerce = await Commerce.findOne({ userId: req.user._id });
    if (!commerce) {
      const error = new Error('Comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const categories = await Category.find({ commerceId: commerce._id });

    const data = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({ categoryId: cat._id });
        return { ...cat.toObject(), productCount };
      })
    );

    res.status(200).json(data);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function GetCategoryById(req, res, next) {
  try {
    const commerce = await Commerce.findOne({ userId: req.user._id });
    if (!commerce) {
      const error = new Error('Comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const category = await Category.findOne({ _id: req.params.id, commerceId: commerce._id });
    if (!category) {
      const error = new Error('Categoría no encontrada.');
      error.statusCode = 404;
      throw error;
    }

    const productCount = await Product.countDocuments({ categoryId: category._id });
    res.status(200).json({ ...category.toObject(), productCount });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function CreateCategory(req, res, next) {
  const { name, description } = req.body;

  try {
    const commerce = await Commerce.findOne({ userId: req.user._id });
    if (!commerce) {
      const error = new Error('Comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const category = await Category.create({ commerceId: commerce._id, name, description });
    res.status(201).json(category);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function UpdateCategory(req, res, next) {
  try {
    const commerce = await Commerce.findOne({ userId: req.user._id });
    if (!commerce) {
      const error = new Error('Comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, commerceId: commerce._id },
      req.body,
      { new: true }
    );

    if (!category) {
      const error = new Error('Categoría no encontrada.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(category);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function DeleteCategory(req, res, next) {
  try {
    const commerce = await Commerce.findOne({ userId: req.user._id });
    if (!commerce) {
      const error = new Error('Comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const category = await Category.findOneAndDelete({ _id: req.params.id, commerceId: commerce._id });
    if (!category) {
      const error = new Error('Categoría no encontrada.');
      error.statusCode = 404;
      throw error;
    }

    res.status(204).send();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}