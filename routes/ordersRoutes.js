import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import * as ordersController from '../controllers/ordersController.js';

const router = Router();

// Cliente
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crear pedido (Client)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [addressId, items]
 *             properties:
 *               addressId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Pedido creado
 */
router.post(
  '/',
  authenticate,
  authorize('Client'),
  [
    body('addressId').notEmpty().withMessage('addressId es requerido'),
    body('items').isArray({ min: 1 }).withMessage('items debe ser un array con al menos un elemento'),
    body('items.*.productId').notEmpty().withMessage('productId es requerido'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('quantity debe ser mayor que 0'),
  ],
  ordersController.createOrder
);

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Mis pedidos (Client)
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get('/my-orders', authenticate, authorize('Client'), ordersController.getMyOrders);

/**
 * @swagger
 * /api/orders/my-orders/{id}:
 *   get:
 *     summary: Detalle de mi pedido (Client)
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle del pedido
 */
router.get('/my-orders/:id', authenticate, authorize('Client'), ordersController.getMyOrderDetail);

// Comercio
/**
 * @swagger
 * /api/orders/commerce:
 *   get:
 *     summary: Pedidos del comercio (Commerce)
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de pedidos del comercio
 */
router.get('/commerce', authenticate, authorize('Commerce'), ordersController.getCommerceOrders);

/**
 * @swagger
 * /api/orders/commerce/{id}:
 *   get:
 *     summary: Detalle de pedido del comercio (Commerce)
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle del pedido
 */
router.get('/commerce/:id', authenticate, authorize('Commerce'), ordersController.getCommerceOrderDetail);

/**
 * @swagger
 * /api/orders/{id}/assign-delivery:
 *   patch:
 *     summary: Asignar delivery automáticamente (Commerce)
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delivery asignado
 */
router.patch('/:id/assign-delivery', authenticate, authorize('Commerce'), ordersController.assignDelivery);

// Delivery
/**
 * @swagger
 * /api/orders/delivery:
 *   get:
 *     summary: Pedidos del delivery (Delivery)
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get('/delivery', authenticate, authorize('Delivery'), ordersController.getDeliveryOrders);

/**
 * @swagger
 * /api/orders/delivery/{id}:
 *   get:
 *     summary: Detalle de pedido del delivery (Delivery)
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle del pedido
 */
router.get('/delivery/:id', authenticate, authorize('Delivery'), ordersController.getDeliveryOrderDetail);

/**
 * @swagger
 * /api/orders/{id}/complete:
 *   patch:
 *     summary: Completar pedido (Delivery)
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido completado
 */
router.patch('/:id/complete', authenticate, authorize('Delivery'), ordersController.completeOrder);

export default router;