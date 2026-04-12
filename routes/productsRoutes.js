import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import * as productsController from '../controllers/productsController.js';

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener mis productos (Commerce)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/', authenticate, authorize('Commerce'), productsController.getMyProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener producto por ID (Commerce)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 */
router.get('/:id', authenticate, authorize('Commerce'), productsController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear producto (Commerce)
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, description, price, categoryId, image]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Producto creado
 */
router.post(
  '/',
  authenticate,
  authorize('Commerce'),
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('name es requerido'),
    body('description').notEmpty().withMessage('description es requerida'),
    body('price').isFloat({ min: 0 }).withMessage('price debe ser un número positivo'),
    body('categoryId').notEmpty().withMessage('categoryId es requerido'),
  ],
  productsController.createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar producto (Commerce)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto actualizado
 */
router.put(
  '/:id',
  authenticate,
  authorize('Commerce'),
  upload.single('image'),
  [
    body('name').optional().notEmpty(),
    body('description').optional().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('categoryId').optional().notEmpty(),
  ],
  productsController.updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar producto (Commerce)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Producto eliminado
 */
router.delete('/:id', authenticate, authorize('Commerce'), productsController.deleteProduct);

export default router;