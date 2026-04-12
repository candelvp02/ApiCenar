import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import * as addressesController from '../controllers/addressesController.js';

const router = Router();

const addressValidation = [
  body('label').notEmpty().withMessage('label es requerido'),
  body('street').notEmpty().withMessage('street es requerido'),
  body('sector').notEmpty().withMessage('sector es requerido'),
  body('city').notEmpty().withMessage('city es requerido'),
  body('reference').notEmpty().withMessage('reference es requerido'),
];

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Obtener mis direcciones (Client)
 *     tags: [Addresses]
 *     responses:
 *       200:
 *         description: Lista de direcciones
 */
router.get('/', authenticate, authorize('Client'), addressesController.getMyAddresses);

/**
 * @swagger
 * /api/addresses/{id}:
 *   get:
 *     summary: Obtener dirección por ID (Client)
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dirección encontrada
 */
router.get('/:id', authenticate, authorize('Client'), addressesController.getAddressById);

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Crear dirección (Client)
 *     tags: [Addresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *               street:
 *                 type: string
 *               sector:
 *                 type: string
 *               city:
 *                 type: string
 *               reference:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dirección creada
 */
router.post('/', authenticate, authorize('Client'), addressValidation, addressesController.createAddress);

/**
 * @swagger
 * /api/addresses/{id}:
 *   put:
 *     summary: Actualizar dirección (Client)
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dirección actualizada
 */
router.put('/:id', authenticate, authorize('Client'), addressValidation, addressesController.updateAddress);

/**
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     summary: Eliminar dirección (Client)
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Dirección eliminada
 */
router.delete('/:id', authenticate, authorize('Client'), addressesController.deleteAddress);

export default router;