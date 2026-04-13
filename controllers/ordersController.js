import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Commerce from '../models/Commerce.js';
import Address from '../models/Address.js';
import User from '../models/User.js';
import Configuration from '../models/Configuration.js';

export async function CreateOrder(req, res, next) {
  const { addressId, items } = req.body;

  try {
    if (!items || items.length === 0) {
      const error = new Error('Debe incluir al menos un producto.');
      error.statusCode = 400;
      throw error;
    }

    const address = await Address.findById(addressId);
    if (!address || address.clientId.toString() !== req.user._id.toString()) {
      const error = new Error('Dirección inválida o no pertenece al cliente.');
      error.statusCode = 400;
      throw error;
    }

    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds }, isActive: true });

    if (products.length !== items.length) {
      const error = new Error('Uno o más productos no encontrados o inactivos.');
      error.statusCode = 404;
      throw error;
    }

    const commerceIds = [...new Set(products.map((p) => p.commerceId.toString()))];
    if (commerceIds.length > 1) {
      const error = new Error('Todos los productos deben pertenecer al mismo comercio.');
      error.statusCode = 400;
      throw error;
    }

    const commerce = await Commerce.findById(commerceIds[0]);
    if (!commerce) {
      const error = new Error('Comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    for (const item of items) {
      if (!item.quantity || item.quantity <= 0) {
        const error = new Error('La cantidad debe ser mayor que 0.');
        error.statusCode = 400;
        throw error;
      }
    }

    const itbisConfig = await Configuration.findOne({ key: 'ITBIS' });
    const itbisPercentage = parseFloat(itbisConfig?.value || '18');

    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      };
    });

    const subtotal = orderItems.reduce((acc, i) => acc + i.subtotal, 0);
    const itbisAmount = parseFloat(((subtotal * itbisPercentage) / 100).toFixed(2));
    const total = parseFloat((subtotal + itbisAmount).toFixed(2));

    const order = await Order.create({
      clientId: req.user._id,
      commerceId: commerce._id,
      addressId,
      status: 'Pending',
      items: orderItems,
      subtotal,
      itbisPercentage,
      itbisAmount,
      total,
    });

    res.status(201).json(order);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function GetMyOrders(req, res, next) {
  try {
    const { status, page = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = 'desc' } = req.query;

    const query = { clientId: req.user._id };
    if (status) query.status = status;

    const sort = { [sortBy]: sortDirection === 'desc' ? -1 : 1 };
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      Order.find(query).sort(sort).skip(skip).limit(Number(pageSize)).populate('commerceId', 'name logo'),
      Order.countDocuments(query),
    ]);

    res.status(200).json({ data, total, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function GetMyOrderDetail(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, clientId: req.user._id })
      .populate('commerceId', 'name logo')
      .populate('addressId');

    if (!order) {
      const error = new Error('Pedido no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(order);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function GetCommerceOrders(req, res, next) {
  try {
    const commerce = await Commerce.findOne({ userId: req.user._id });
    if (!commerce) {
      const error = new Error('Comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const { status, page = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = 'desc' } = req.query;
    const query = { commerceId: commerce._id };
    if (status) query.status = status;

    const sort = { [sortBy]: sortDirection === 'desc' ? -1 : 1 };
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      Order.find(query).sort(sort).skip(skip).limit(Number(pageSize)).populate('clientId', 'firstName lastName'),
      Order.countDocuments(query),
    ]);

    res.status(200).json({ data, total, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function GetCommerceOrderDetail(req, res, next) {
  try {
    const commerce = await Commerce.findOne({ userId: req.user._id });
    if (!commerce) {
      const error = new Error('Comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const order = await Order.findOne({ _id: req.params.id, commerceId: commerce._id })
      .populate('clientId', 'firstName lastName email phone')
      .populate('addressId')
      .populate('deliveryId', 'firstName lastName phone');

    if (!order) {
      const error = new Error('Pedido no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(order);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function AssignDelivery(req, res, next) {
  try {
    const commerce = await Commerce.findOne({ userId: req.user._id });
    if (!commerce) {
      const error = new Error('Comercio no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const order = await Order.findOne({ _id: req.params.id, commerceId: commerce._id });
    if (!order) {
      const error = new Error('Pedido no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    if (order.status !== 'Pending') {
      const error = new Error('El pedido no está en estado Pending.');
      error.statusCode = 400;
      throw error;
    }

    const delivery = await User.findOne({ role: 'Delivery', isActive: true, isAvailable: true });
    if (!delivery) {
      const error = new Error('No hay delivery disponible en este momento.');
      error.statusCode = 409;
      throw error;
    }

    order.deliveryId = delivery._id;
    order.status = 'InProgress';
    await order.save();

    delivery.isAvailable = false;
    await delivery.save();

    res.status(200).json(order);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function GetDeliveryOrders(req, res, next) {
  try {
    const { status, page = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = 'desc' } = req.query;

    const query = { deliveryId: req.user._id };
    if (status) query.status = status;

    const sort = { [sortBy]: sortDirection === 'desc' ? -1 : 1 };
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      Order.find(query).sort(sort).skip(skip).limit(Number(pageSize)).populate('commerceId', 'name logo'),
      Order.countDocuments(query),
    ]);

    res.status(200).json({ data, total, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function GetDeliveryOrderDetail(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, deliveryId: req.user._id })
      .populate('commerceId', 'name logo phone')
      .populate('clientId', 'firstName lastName phone');

    if (!order) {
      const error = new Error('Pedido no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const result = order.toObject();
    if (order.status === 'Completed') {
      delete result.addressId;
    } else {
      await order.populate('addressId');
      result.address = order.addressId;
    }

    res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function CompleteOrder(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, deliveryId: req.user._id });

    if (!order) {
      const error = new Error('Pedido no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    if (order.status !== 'InProgress') {
      const error = new Error('El pedido no está en estado InProgress.');
      error.statusCode = 400;
      throw error;
    }

    order.status = 'Completed';
    await order.save();

    await User.findByIdAndUpdate(req.user._id, { isAvailable: true });

    res.status(200).json(order);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}