import { Router } from 'express';
import { body } from 'express-validator';
import { Authenticate } from '../middlewares/authMiddleware.js';
import { Authorize } from '../middlewares/roleMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { handleValidationErrors } from '../middlewares/handleValidation.js';
import * as adminDashboardController from '../controllers/adminDashboardController.js';
import * as adminUsersController from '../controllers/adminUsersController.js';
import * as commerceTypesController from '../controllers/commerceTypesController.js';

const router = Router();

router.use(Authenticate, Authorize('Admin'));

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Métricas del dashboard (Admin)
 *     tags: [Admin Dashboard]
 *     responses:
 *       200:
 *         description: Métricas del sistema
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/dashboard', adminDashboardController.GetDashboardMetrics);

/**
 * @swagger
 * /api/admin/users/clients:
 *   get:
 *     summary: Listar clientes (Admin)
 *     tags: [Admin Users]
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Lista de clientes
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/users/clients', adminUsersController.GetClients);

/**
 * @swagger
 * /api/admin/users/deliveries:
 *   get:
 *     summary: Listar deliveries (Admin)
 *     tags: [Admin Users]
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Lista de deliveries
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/users/deliveries', adminUsersController.GetDeliveries);

/**
 * @swagger
 * /api/admin/users/commerces:
 *   get:
 *     summary: Listar comercios (Admin)
 *     tags: [Admin Users]
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Lista de comercios
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/users/commerces', adminUsersController.GetCommerces);

/**
 * @swagger
 * /api/admin/users/admins:
 *   get:
 *     summary: Listar administradores (Admin)
 *     tags: [Admin Users]
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Lista de admins
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/users/admins', adminUsersController.GetAdmins);

/**
 * @swagger
 * /api/admin/users/admins:
 *   post:
 *     summary: Crear administrador (Admin)
 *     tags: [Admin Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, userName, email, password, confirmPassword, phone]
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
 *     responses:
 *       201:
 *         description: Admin creado
 *       409:
 *         description: userName o email ya existen
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/users/admins',
  [
    body('firstName').notEmpty().withMessage('firstName es requerido'),
    body('lastName').notEmpty().withMessage('lastName es requerido'),
    body('userName').notEmpty().withMessage('userName es requerido'),
    body('email').isEmail().withMessage('email inválido'),
    body('password').isLength({ min: 6 }).withMessage('password mínimo 6 caracteres'),
    body('confirmPassword').notEmpty().withMessage('confirmPassword es requerido'),
    body('phone').notEmpty().withMessage('phone es requerido'),
  ],
  handleValidationErrors(),
  adminUsersController.CreateAdmin
);

/**
 * @swagger
 * /api/admin/users/admins/{id}:
 *   put:
 *     summary: Actualizar administrador (Admin)
 *     tags: [Admin Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin actualizado
 *       404:
 *         description: Admin no encontrado
 *       403:
 *         description: Admin por defecto no modificable
 *       401:
 *         description: Unauthorized
 */
router.put('/users/admins/:id', adminUsersController.UpdateAdmin);

/**
 * @swagger
 * /api/admin/users/{id}/status:
 *   patch:
 *     summary: Cambiar estado de usuario (Admin)
 *     tags: [Admin Users]
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
 *             required: [isActive]
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       400:
 *         description: No puedes cambiar tu propio estado
 *       403:
 *         description: Admin por defecto no modificable
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/users/:id/status',
  [body('isActive').isBoolean().withMessage('isActive debe ser un booleano')],
  handleValidationErrors(),
  adminUsersController.UpdateUserStatus
);

/**
 * @swagger
 * /api/admin/commerce-types:
 *   get:
 *     summary: Listar tipos de comercio (Admin)
 *     tags: [Commerce Types]
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Lista de tipos de comercio
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/commerce-types', commerceTypesController.GetCommerceTypes);

/**
 * @swagger
 * /api/admin/commerce-types/{id}:
 *   get:
 *     summary: Obtener tipo de comercio por ID (Admin)
 *     tags: [Commerce Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tipo de comercio encontrado
 *       404:
 *         description: No encontrado
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/commerce-types/:id', commerceTypesController.GetCommerceTypeById);

/**
 * @swagger
 * /api/admin/commerce-types:
 *   post:
 *     summary: Crear tipo de comercio (Admin)
 *     tags: [Commerce Types]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, icon]
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tipo de comercio creado
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/commerce-types',
  upload.single('icon'),
  [body('name').notEmpty().withMessage('name es requerido')],
  handleValidationErrors(),
  commerceTypesController.CreateCommerceType
);

/**
 * @swagger
 * /api/admin/commerce-types/{id}:
 *   put:
 *     summary: Actualizar tipo de comercio (Admin)
 *     tags: [Commerce Types]
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
 *               icon:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Tipo de comercio actualizado
 *       404:
 *         description: No encontrado
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/commerce-types/:id', upload.single('icon'), commerceTypesController.UpdateCommerceType);

/**
 * @swagger
 * /api/admin/commerce-types/{id}:
 *   delete:
 *     summary: Eliminar tipo de comercio en cascada (Admin)
 *     tags: [Commerce Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Eliminado en cascada
 *       404:
 *         description: No encontrado
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/commerce-types/:id', commerceTypesController.DeleteCommerceType);

export default router;