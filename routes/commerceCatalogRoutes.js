import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import * as commerceCatalogController from '../controllers/commerceCatalogController.js';

const router = Router();

/**
 * @swagger
 * /api/commerce-types:
 *   get:
 *     summary: Obtener tipos de comercio (Client)
 *     tags: [Commerce Catalog]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de tipos de comercio
 */
router.get('/', authenticate, authorize('Client'), commerceCatalogController.getCommerceTypes);

/**
 * @swagger
 * /api/commerce:
 *   get:
 *     summary: Obtener comercios activos (Client)
 *     tags: [Commerce Catalog]
 *     parameters:
 *       - in: query
 *         name: commerceTypeId
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de comercios
 */
router.get('/', authenticate, authorize('Client'), commerceCatalogController.getCommercesByType);

/**
 * @swagger
 * /api/commerce/{commerceId}/catalog:
 *   get:
 *     summary: Obtener catálogo de un comercio
 *     tags: [Commerce Catalog]
 *     parameters:
 *       - in: path
 *         name: commerceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Catálogo del comercio
 */
router.get('/:commerceId/catalog', authenticate, authorize('Client'), commerceCatalogController.getCommerceCatalog);

export default router;