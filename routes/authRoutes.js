import { Router } from 'express';
import { body } from 'express-validator';
import { upload } from '../middlewares/uploadMiddleware.js';
import * as authController from '../controllers/authController.js';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userNameOrEmail, password]
 *             properties:
 *               userNameOrEmail:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *       401:
 *         description: Credenciales inválidas
 */
router.post(
  '/login',
  [
    body('userNameOrEmail').notEmpty().withMessage('userNameOrEmail es requerido'),
    body('password').notEmpty().withMessage('password es requerido'),
  ],
  authController.Login
);

/**
 * @swagger
 * /api/auth/register-client:
 *   post:
 *     summary: Registro de cliente
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, userName, email, password, confirmPassword, phone, profileImage]
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               phone:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Cliente registrado
 *       409:
 *         description: userName o email ya existen
 */
router.post(
  '/register-client',
  upload.single('profileImage'),
  [
    body('firstName').notEmpty().withMessage('firstName es requerido'),
    body('lastName').notEmpty().withMessage('lastName es requerido'),
    body('userName').notEmpty().withMessage('userName es requerido'),
    body('email').isEmail().withMessage('email inválido'),
    body('password').isLength({ min: 6 }).withMessage('password mínimo 6 caracteres'),
    body('confirmPassword').notEmpty().withMessage('confirmPassword es requerido'),
    body('phone').notEmpty().withMessage('phone es requerido'),
  ],
  authController.RegisterClient
);

/**
 * @swagger
 * /api/auth/register-delivery:
 *   post:
 *     summary: Registro de delivery
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, userName, email, password, confirmPassword, phone, profileImage]
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               phone:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Delivery registrado
 *       409:
 *         description: userName o email ya existen
 */
router.post(
  '/register-delivery',
  upload.single('profileImage'),
  [
    body('firstName').notEmpty().withMessage('firstName es requerido'),
    body('lastName').notEmpty().withMessage('lastName es requerido'),
    body('userName').notEmpty().withMessage('userName es requerido'),
    body('email').isEmail().withMessage('email inválido'),
    body('password').isLength({ min: 6 }).withMessage('password mínimo 6 caracteres'),
    body('confirmPassword').notEmpty().withMessage('confirmPassword es requerido'),
    body('phone').notEmpty().withMessage('phone es requerido'),
  ],
  authController.RegisterDelivery
);

/**
 * @swagger
 * /api/auth/register-commerce:
 *   post:
 *     summary: Registro de comercio
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [userName, email, password, confirmPassword, name, phone, openingTime, closingTime, commerceTypeId, logo]
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               phone:
 *                 type: string
 *               openingTime:
 *                 type: string
 *               closingTime:
 *                 type: string
 *               commerceTypeId:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Comercio registrado
 *       409:
 *         description: userName o email ya existen
 */
router.post(
  '/register-commerce',
  upload.single('logo'),
  [
    body('userName').notEmpty().withMessage('userName es requerido'),
    body('email').isEmail().withMessage('email inválido'),
    body('password').isLength({ min: 6 }).withMessage('password mínimo 6 caracteres'),
    body('confirmPassword').notEmpty().withMessage('confirmPassword es requerido'),
    body('name').notEmpty().withMessage('name es requerido'),
    body('phone').notEmpty().withMessage('phone es requerido'),
    body('openingTime').notEmpty().withMessage('openingTime es requerido'),
    body('closingTime').notEmpty().withMessage('closingTime es requerido'),
    body('commerceTypeId').notEmpty().withMessage('commerceTypeId es requerido'),
  ],
  authController.RegisterCommerce
);

/**
 * @swagger
 * /api/auth/confirm-email:
 *   post:
 *     summary: Confirmar email
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cuenta activada
 *       400:
 *         description: Token inválido o expirado
 *       404:
 *         description: Token no encontrado
 */
router.post(
  '/confirm-email',
  [
    body('token').notEmpty().withMessage('token es requerido'),
  ],
  authController.ConfirmEmail
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userNameOrEmail]
 *             properties:
 *               userNameOrEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Correo enviado si el usuario existe
 */
router.post(
  '/forgot-password',
  [
    body('userNameOrEmail').notEmpty().withMessage('userNameOrEmail es requerido'),
  ],
  authController.ForgotPassword
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Restablecer contraseña
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password, confirmPassword]
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña restablecida
 *       400:
 *         description: Token inválido o expirado
 */
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('token es requerido'),
    body('password').isLength({ min: 6 }).withMessage('password mínimo 6 caracteres'),
    body('confirmPassword').notEmpty().withMessage('confirmPassword es requerido'),
  ],
  authController.ResetPassword
);

export default router;