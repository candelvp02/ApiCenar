import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Commerce from '../models/Commerce.js';
import Address from '../models/Address.js';
import User from '../models/User.js';
import Configuration from '../models/Configuration.js';

export const createOrderService = async (clientId, { addressId, items }) => {
  if (!items || items.length === 0) throw { status: 400, message: 'Debe incluir al menos un producto' };

  const address = await Address.findById(addressId);
  if (!address || address.clientId.toString() !== clientId.toString()) {
    throw { status: 400, message: 'Dirección inválida o no pertenece al cliente' };
  }

  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });

  if (products.length !== items.length) throw { status: 404, message: 'Uno o más productos no encontrados' };

  const commerceIds = [...new Set(products.map((p) => p.commerceId.toString()))];
  if (commerceIds.length > 1) throw { status: 400, message: 'Todos los productos deben pertenecer al mismo comercio' };

  const commerce = await Commerce.findById(commerceIds[0]);
  if (!commerce) throw { status: 404, message: 'Comercio no encontrado' };

  for (const item of items) {
    if (!item.quantity || item.quantity <= 0) throw { status: 400, message: 'La cantidad debe ser mayor que 0' };
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
    clientId,
    commerceId: commerce._id,
    addressId,
    status: 'Pending',
    items: orderItems,
    subtotal,
    itbisPercentage,
    itbisAmount,
    total,
  });

  return order;
};

export const getMyOrdersService = async (clientId, { status, page = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = 'desc' }) => {
  const query = { clientId };
  if (status) query.status = status;

  const sort = { [sortBy]: sortDirection === 'desc' ? -1 : 1 };
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    Order.find(query).sort(sort).skip(skip).limit(Number(pageSize)).populate('commerceId', 'name logo'),
    Order.countDocuments(query),
  ]);

  return { data, total, page: Number(page), pageSize: Number(pageSize) };
};

export const getMyOrderDetailService = async (clientId, orderId) => {
  const order = await Order.findOne({ _id: orderId, clientId })
    .populate('commerceId', 'name logo')
    .populate('addressId');
  if (!order) throw { status: 404, message: 'Pedido no encontrado' };
  return order;
};

export const getCommerceOrdersService = async (commerceId, { status, page = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = 'desc' }) => {
  const query = { commerceId };
  if (status) query.status = status;

  const sort = { [sortBy]: sortDirection === 'desc' ? -1 : 1 };
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    Order.find(query).sort(sort).skip(skip).limit(Number(pageSize)).populate('clientId', 'firstName lastName'),
    Order.countDocuments(query),
  ]);

  return { data, total, page: Number(page), pageSize: Number(pageSize) };
};

export const getCommerceOrderDetailService = async (commerceId, orderId) => {
  const order = await Order.findOne({ _id: orderId, commerceId })
    .populate('clientId', 'firstName lastName email phone')
    .populate('addressId')
    .populate('deliveryId', 'firstName lastName phone');
  if (!order) throw { status: 404, message: 'Pedido no encontrado' };
  return order;
};

export const assignDeliveryService = async (commerceId, orderId) => {
  const order = await Order.findOne({ _id: orderId, commerceId });
  if (!order) throw { status: 404, message: 'Pedido no encontrado' };
  if (order.status !== 'Pending') throw { status: 400, message: 'El pedido no está en estado Pending' };

  const delivery = await User.findOne({ role: 'Delivery', isActive: true, isAvailable: true });
  if (!delivery) throw { status: 409, message: 'No hay delivery disponible en este momento' };

  order.deliveryId = delivery._id;
  order.status = 'InProgress';
  await order.save();

  delivery.isAvailable = false;
  await delivery.save();

  return order;
};

export const getDeliveryOrdersService = async (deliveryId, { status, page = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = 'desc' }) => {
  const query = { deliveryId };
  if (status) query.status = status;

  const sort = { [sortBy]: sortDirection === 'desc' ? -1 : 1 };
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    Order.find(query).sort(sort).skip(skip).limit(Number(pageSize)).populate('commerceId', 'name logo'),
    Order.countDocuments(query),
  ]);

  return { data, total, page: Number(page), pageSize: Number(pageSize) };
};

export const getDeliveryOrderDetailService = async (deliveryId, orderId) => {
  const order = await Order.findOne({ _id: orderId, deliveryId })
    .populate('commerceId', 'name logo phone')
    .populate('clientId', 'firstName lastName phone');
  if (!order) throw { status: 404, message: 'Pedido no encontrado' };

  const result = order.toObject();
  if (order.status === 'Completed') {
    delete result.addressId;
  } else {
    await order.populate('addressId');
    result.address = order.addressId;
  }

  return result;
};

export const completeOrderService = async (deliveryId, orderId) => {
  const order = await Order.findOne({ _id: orderId, deliveryId });
  if (!order) throw { status: 404, message: 'Pedido no encontrado' };
  if (order.status !== 'InProgress') throw { status: 400, message: 'El pedido no está en estado InProgress' };

  order.status = 'Completed';
  await order.save();

  await User.findByIdAndUpdate(deliveryId, { isAvailable: true });

  return order;
};