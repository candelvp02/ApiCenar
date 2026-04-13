import { Router } from 'express';
import { Authenticate } from '../middlewares/authMiddleware.js';
import { Authorize } from '../middlewares/roleMiddleware.js';
import * as commerceCatalogController from '../controllers/commerceCatalogController.js';

const router = Router();

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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortDirection
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de comercios
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', Authenticate, Authorize('Client'), commerceCatalogController.GetCommercesByType);

/**
 * @swagger
 * /api/commerce/{commerceId}/catalog:
 *   get:
 *     summary: Obtener catálogo de un comercio (Client)
 *     tags: [Commerce Catalog]
 *     parameters:
 *       - in: path
 *         name: commerceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Catálogo del comercio agrupado por categorías
 *       404:
 *         description: Comercio no encontrado
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/:commerceId/catalog', Authenticate, Authorize('Client'), commerceCatalogController.GetCommerceCatalog);

export default router;