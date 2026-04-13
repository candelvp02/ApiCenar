import { Router } from 'express';
import { Authenticate } from '../middlewares/authMiddleware.js';
import { Authorize } from '../middlewares/roleMiddleware.js';
import * as commerceCatalogController from '../controllers/commerceCatalogController.js';

const router = Router();

/**
 * @swagger
 * /api/commerce-types:
 *   get:
 *     summary: Obtener tipos de comercio activos (Client)
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
 *         description: Lista de tipos de comercio
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', Authenticate, Authorize('Client'), commerceCatalogController.GetCommerceTypes);

export default router;