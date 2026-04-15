import { Router } from 'express';
import { body } from 'express-validator';
import { Authenticate } from '../middlewares/authMiddleware.js';
import { Authorize } from '../middlewares/roleMiddleware.js';
import { handleValidationErrors } from '../middlewares/handleValidation.js';
import * as categoriesController from '../controllers/categoriesController.js';

const router = Router();

const categoryValidation = [
  body('name').notEmpty().withMessage('name es requerido'),
  body('description').notEmpty().withMessage('description es requerida'),
];

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Obtener mis categorías (Commerce)
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorías con cantidad de productos
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', Authenticate, Authorize('Commerce'), categoriesController.GetMyCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Obtener categoría por ID (Commerce)
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/:id', Authenticate, Authorize('Commerce'), categoriesController.GetCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Crear categoría (Commerce)
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoría creada
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', Authenticate, Authorize('Commerce'), categoryValidation, handleValidationErrors(), categoriesController.CreateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Actualizar categoría (Commerce)
 *     tags: [Categories]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       404:
 *         description: Categoría no encontrada
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/:id', Authenticate, Authorize('Commerce'), categoryValidation, handleValidationErrors(), categoriesController.UpdateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Eliminar categoría (Commerce)
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Categoría eliminada
 *       404:
 *         description: Categoría no encontrada
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', Authenticate, Authorize('Commerce'), categoriesController.DeleteCategory);

export default router;