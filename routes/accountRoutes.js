import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
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
 */
router.get('/me', authenticate, accountController.getProfile);

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
 *     responses:
 *       200:
 *         description: Perfil actualizado
 */
router.patch('/me', authenticate, upload.single('profileImage'), accountController.updateProfile);

export default router;