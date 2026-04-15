import { Router } from 'express';
import { body } from 'express-validator';
import { Authenticate } from '../middlewares/authMiddleware.js';
import { Authorize } from '../middlewares/roleMiddleware.js';
import { handleValidationErrors } from '../middlewares/handleValidation.js';
import * as configurationsController from '../controllers/configurationsController.js';

const router = Router();

/**
 * @swagger
 * /api/configurations:
 *   get:
 *     summary: Obtener todas las configuraciones (Admin)
 *     tags: [Configurations]
 *     responses:
 *       200:
 *         description: Lista de configuraciones
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', Authenticate, Authorize('Admin'), configurationsController.GetConfigurations);

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
 *       404:
 *         description: Configuración no encontrada
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/:key', Authenticate, Authorize('Admin'), configurationsController.GetConfigurationByKey);

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
 *       404:
 *         description: Configuración no encontrada
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put(
  '/:key',
  Authenticate,
  Authorize('Admin'),
  [body('value').notEmpty().withMessage('value es requerido')],
  handleValidationErrors(),
  configurationsController.UpdateConfiguration
);

export default router;