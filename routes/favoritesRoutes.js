import { Router } from 'express';
import { body } from 'express-validator';
import { Authenticate } from '../middlewares/authMiddleware.js';
import { Authorize } from '../middlewares/roleMiddleware.js';
import { handleValidationErrors } from '../middlewares/handleValidation.js';
import * as favoritesController from '../controllers/favoritesController.js';

const router = Router();

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Obtener mis favoritos (Client)
 *     tags: [Favorites]
 *     parameters:
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
 *         description: Lista de comercios favoritos
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', Authenticate, Authorize('Client'), favoritesController.GetMyFavorites);

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Agregar favorito (Client)
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [commerceId]
 *             properties:
 *               commerceId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Favorito agregado
 *       409:
 *         description: Ya está en favoritos
 *       404:
 *         description: Comercio no encontrado
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  Authenticate,
  Authorize('Client'),
  [body('commerceId').notEmpty().withMessage('commerceId es requerido')],
  handleValidationErrors(),
  favoritesController.AddFavorite
);

/**
 * @swagger
 * /api/favorites/{commerceId}:
 *   delete:
 *     summary: Eliminar favorito (Client)
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: commerceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Favorito eliminado
 *       404:
 *         description: Favorito no encontrado
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/:commerceId', Authenticate, Authorize('Client'), favoritesController.RemoveFavorite);

export default router;