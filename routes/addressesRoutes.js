import { Router } from 'express';
import { body } from 'express-validator';
import { Authenticate } from '../middlewares/authMiddleware.js';
import { Authorize } from '../middlewares/roleMiddleware.js';
import { handleValidationErrors } from '../middlewares/handleValidation.js';
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', Authenticate, Authorize('Client'), addressesController.GetMyAddresses);

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
 *       404:
 *         description: Dirección no encontrada
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/:id', Authenticate, Authorize('Client'), addressesController.GetAddressById);

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
 *             required: [label, street, sector, city, reference]
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
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', Authenticate, Authorize('Client'), addressValidation, handleValidationErrors(), addressesController.CreateAddress);

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
 *       200:
 *         description: Dirección actualizada
 *       404:
 *         description: Dirección no encontrada
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/:id', Authenticate, Authorize('Client'), addressValidation, handleValidationErrors(), addressesController.UpdateAddress);

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
 *       404:
 *         description: Dirección no encontrada
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', Authenticate, Authorize('Client'), addressesController.DeleteAddress);

export default router;