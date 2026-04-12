import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
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
 *         description: Lista de categorías
 */
router.get('/', authenticate, authorize('Commerce'), categoriesController.getMyCategories);

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
 */
router.get('/:id', authenticate, authorize('Commerce'), categoriesController.getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Crear categoría (Commerce)
 *     tags: [Categories]
 *     responses:
 *       201:
 *         description: Categoría creada
 */
router.post('/', authenticate, authorize('Commerce'), categoryValidation, categoriesController.createCategory);

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
 *     responses:
 *       200:
 *         description: Categoría actualizada
 */
router.put('/:id', authenticate, authorize('Commerce'), categoryValidation, categoriesController.updateCategory);

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
 */
router.delete('/:id', authenticate, authorize('Commerce'), categoriesController.deleteCategory);

export default router;