import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Commerce from '../models/Commerce.js';

export async function GetMyProducts(req, res, next) {
  try {
    const commerce = await Commerce.findOne({ userId: req.user._id });
    if (!commerce) {
      const error = new Error('Comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const data = await Product.find({ commerceId: commerce._id }).populate('categoryId', 'name');
    res.status(200).json(data);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function GetProductById(req, res, next) {
  try {
    const commerce = await Commerce.findOne({ userId: req.user._id });
    if (!commerce) {
      const error = new Error('Comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const product = await Product.findOne({ _id: req.params.id, commerceId: commerce._id }).populate('categoryId', 'name');
    if (!product) {
      const error = new Error('Producto no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(product);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function CreateProduct(req, res, next) {
  const { name, description, price, categoryId } = req.body;

  try {
    const commerce = await Commerce.findOne({ userId: req.user._id });
    if (!commerce) {
      const error = new Error('Comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const category = await Category.findOne({ _id: categoryId, commerceId: commerce._id });
    if (!category) {
      const error = new Error('Categoría inválida o no pertenece al comercio.');
      error.statusCode = 400;
      throw error;
    }

    const product = await Product.create({
      commerceId: commerce._id,
      categoryId,
      name,
      description,
      price,
      image: req.file ? `/public/assets/${req.file.filename}` : null,
    });

    res.status(201).json(product);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function UpdateProduct(req, res, next) {
  try {
    const commerce = await Commerce.findOne({ userId: req.user._id });
    if (!commerce) {
      const error = new Error('Comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    if (req.body.categoryId) {
      const category = await Category.findOne({ _id: req.body.categoryId, commerceId: commerce._id });
      if (!category) {
        const error = new Error('Categoría inválida o no pertenece al comercio.');
        error.statusCode = 400;
        throw error;
      }
    }

    const updateData = { ...req.body };
    if (req.file) updateData.image = `/public/assets/${req.file.filename}`;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, commerceId: commerce._id },
      updateData,
      { new: true }
    );

    if (!product) {
      const error = new Error('Producto no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(product);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function DeleteProduct(req, res, next) {
  try {
    const commerce = await Commerce.findOne({ userId: req.user._id });
    if (!commerce) {
      const error = new Error('Comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const product = await Product.findOneAndDelete({ _id: req.params.id, commerceId: commerce._id });
    if (!product) {
      const error = new Error('Producto no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    res.status(204).send();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}