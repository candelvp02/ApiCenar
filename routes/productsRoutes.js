import { Router } from 'express';
import { body } from 'express-validator';
import { Authenticate } from '../middlewares/authMiddleware.js';
import { Authorize } from '../middlewares/roleMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { handleValidationErrors } from '../middlewares/handleValidation.js';
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', Authenticate, Authorize('Commerce'), productsController.GetMyProducts);

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
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/:id', Authenticate, Authorize('Commerce'), productsController.GetProductById);

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
  Authorize('Commerce'),
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('name es requerido'),
    body('description').notEmpty().withMessage('description es requerida'),
    body('price').isFloat({ min: 0 }).withMessage('price debe ser un número positivo'),
    body('categoryId').notEmpty().withMessage('categoryId es requerido'),
  ],
  handleValidationErrors(),
  productsController.CreateProduct
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
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
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
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put(
  '/:id',
  Authenticate,
  Authorize('Commerce'),
  upload.single('image'),
  [
    body('name').optional().notEmpty().withMessage('name no puede estar vacío'),
    body('description').optional().notEmpty().withMessage('description no puede estar vacía'),
    body('price').optional().isFloat({ min: 0 }).withMessage('price debe ser un número positivo'),
    body('categoryId').optional().notEmpty().withMessage('categoryId no puede estar vacío'),
  ],
  handleValidationErrors(),
  productsController.UpdateProduct
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
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', Authenticate, Authorize('Commerce'), productsController.DeleteProduct);

export default router;