import { validationResult } from 'express-validator';
import * as ordersService from '../services/ordersService.js';
import Commerce from '../models/Commerce.js';

export const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const order = await ordersService.createOrderService(req.user._id, req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const result = await ordersService.getMyOrdersService(req.user._id, req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getMyOrderDetail = async (req, res) => {
  try {
    const order = await ordersService.getMyOrderDetailService(req.user._id, req.params.id);
    res.status(200).json(order);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getCommerceOrders = async (req, res) => {
  try {
    const commerce = await Commerce.findOne({ userId: req.user._id });
    if (!commerce) return res.status(404).json({ message: 'Comercio no encontrado' });
    const result = await ordersService.getCommerceOrdersService(commerce._id, req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getCommerceOrderDetail = async (req, res) => {
  try {
    const commerce = await Commerce.findOne({ userId: req.user._id });
    if (!commerce) return res.status(404).json({ message: 'Comercio no encontrado' });
    const order = await ordersService.getCommerceOrderDetailService(commerce._id, req.params.id);
    res.status(200).json(order);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const assignDelivery = async (req, res) => {
  try {
    const commerce = await Commerce.findOne({ userId: req.user._id });
    if (!commerce) return res.status(404).json({ message: 'Comercio no encontrado' });
    const order = await ordersService.assignDeliveryService(commerce._id, req.params.id);
    res.status(200).json(order);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getDeliveryOrders = async (req, res) => {
  try {
    const result = await ordersService.getDeliveryOrdersService(req.user._id, req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getDeliveryOrderDetail = async (req, res) => {
  try {
    const order = await ordersService.getDeliveryOrderDetailService(req.user._id, req.params.id);
    res.status(200).json(order);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const completeOrder = async (req, res) => {
  try {
    const order = await ordersService.completeOrderService(req.user._id, req.params.id);
    res.status(200).json(order);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};