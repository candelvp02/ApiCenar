import { Router } from 'express';
import { body } from 'express-validator';
import { Authenticate } from '../middlewares/authMiddleware.js';
import { Authorize } from '../middlewares/roleMiddleware.js';
import { handleValidationErrors } from '../middlewares/handleValidation.js';
import * as ordersController from '../controllers/ordersController.js';

const router = Router();

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
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  Authenticate,
  Authorize('Client'),
  [
    body('addressId').notEmpty().withMessage('addressId es requerido'),
    body('items').isArray({ min: 1 }).withMessage('items debe tener al menos un elemento'),
    body('items.*.productId').notEmpty().withMessage('productId es requerido'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('quantity debe ser mayor que 0'),
  ],
  handleValidationErrors(),
  ordersController.CreateOrder
);

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Mis pedidos (Client)
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, InProgress, Completed]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortDirection
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pedidos del cliente
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/my-orders', Authenticate, Authorize('Client'), ordersController.GetMyOrders);

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
 *       404:
 *         description: Pedido no encontrado
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/my-orders/:id', Authenticate, Authorize('Client'), ordersController.GetMyOrderDetail);

/**
 * @swagger
 * /api/orders/commerce:
 *   get:
 *     summary: Pedidos del comercio (Commerce)
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, InProgress, Completed]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de pedidos del comercio
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/commerce', Authenticate, Authorize('Commerce'), ordersController.GetCommerceOrders);

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
 *       404:
 *         description: Pedido no encontrado
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/commerce/:id', Authenticate, Authorize('Commerce'), ordersController.GetCommerceOrderDetail);

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
 *       400:
 *         description: Pedido no está en Pending
 *       409:
 *         description: No hay delivery disponible
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.patch('/:id/assign-delivery', Authenticate, Authorize('Commerce'), ordersController.AssignDelivery);

/**
 * @swagger
 * /api/orders/delivery:
 *   get:
 *     summary: Pedidos del delivery (Delivery)
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, InProgress, Completed]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de pedidos del delivery
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/delivery', Authenticate, Authorize('Delivery'), ordersController.GetDeliveryOrders);

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
 *       404:
 *         description: Pedido no encontrado
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/delivery/:id', Authenticate, Authorize('Delivery'), ordersController.GetDeliveryOrderDetail);

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
 *       400:
 *         description: Pedido no está en InProgress
 *       404:
 *         description: Pedido no encontrado
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.patch('/:id/complete', Authenticate, Authorize('Delivery'), ordersController.CompleteOrder);

export default router;