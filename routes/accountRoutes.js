import { Router } from 'express';
import { upload } from '../middlewares/uploadMiddleware.js';
import { Authenticate } from '../middlewares/authMiddleware.js';
import * as accountController from '../controllers/accountController.js';

const router = Router();

/**
 * @swagger
 * /api/account/me:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *       401:
 *         description: Unauthorized
 */
router.get('/me', Authenticate, accountController.GetProfile);

/**
 * @swagger
 * /api/account/me:
 *   patch:
 *     summary: Actualizar perfil del usuario autenticado
 *     tags: [Account]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *               email:
 *                 type: string
 *               openingTime:
 *                 type: string
 *               closingTime:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       401:
 *         description: Unauthorized
 */
router.patch('/me', Authenticate, upload.single('profileImage'), accountController.UpdateProfile);

export default router;