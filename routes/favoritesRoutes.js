import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import * as favoritesController from '../controllers/favoritesController.js';

const router = Router();

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Obtener mis favoritos (Client)
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: Lista de favoritos
 */
router.get('/', authenticate, authorize('Client'), favoritesController.getMyFavorites);

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
 */
router.post(
  '/',
  authenticate,
  authorize('Client'),
  [body('commerceId').notEmpty().withMessage('commerceId es requerido')],
  favoritesController.addFavorite
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
 */
router.delete('/:commerceId', authenticate, authorize('Client'), favoritesController.removeFavorite);

export default router;