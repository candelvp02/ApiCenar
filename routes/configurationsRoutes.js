import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import * as configurationsController from '../controllers/configurationsController.js';

const router = Router();

/**
 * @swagger
 * /api/configurations:
 *   get:
 *     summary: Obtener configuraciones (Admin)
 *     tags: [Configurations]
 *     responses:
 *       200:
 *         description: Lista de configuraciones
 */
router.get('/', authenticate, authorize('Admin'), configurationsController.getConfigurations);

/**
 * @swagger
 * /api/configurations/{key}:
 *   get:
 *     summary: Obtener configuración por clave (Admin)
 *     tags: [Configurations]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuración encontrada
 */
router.get('/:key', authenticate, authorize('Admin'), configurationsController.getConfigurationByKey);

/**
 * @swagger
 * /api/configurations/{key}:
 *   put:
 *     summary: Actualizar configuración (Admin)
 *     tags: [Configurations]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [value]
 *             properties:
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Configuración actualizada
 */
router.put(
  '/:key',
  authenticate,
  authorize('Admin'),
  [body('value').notEmpty().withMessage('value es requerido')],
  configurationsController.updateConfiguration
);

export default router;