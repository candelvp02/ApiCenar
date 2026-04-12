import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import * as adminDashboardController from '../controllers/adminDashboardController.js';
import * as adminUsersController from '../controllers/adminUsersController.js';
import * as commerceTypesController from '../controllers/commerceTypesController.js';

const router = Router();

// Todas las rutas de admin requieren el Admin Role
router.use(authenticate, authorize('Admin'));

// Dashboard
/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Métricas del dashboard (Admin)
 *     tags: [Admin Dashboard]
 *     responses:
 *       200:
 *         description: Métricas del sistema
 */
router.get('/dashboard', adminDashboardController.getDashboardMetrics);

// Usuarios
/**
 * @swagger
 * /api/admin/users/clients:
 *   get:
 *     summary: Listar clientes (Admin)
 *     tags: [Admin Users]
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get('/users/clients', adminUsersController.getClients);

/**
 * @swagger
 * /api/admin/users/deliveries:
 *   get:
 *     summary: Listar deliveries (Admin)
 *     tags: [Admin Users]
 *     responses:
 *       200:
 *         description: Lista de deliveries
 */
router.get('/users/deliveries', adminUsersController.getDeliveries);

/**
 * @swagger
 * /api/admin/users/commerces:
 *   get:
 *     summary: Listar comercios (Admin)
 *     tags: [Admin Users]
 *     responses:
 *       200:
 *         description: Lista de comercios
 */
router.get('/users/commerces', adminUsersController.getCommerces);

/**
 * @swagger
 * /api/admin/users/admins:
 *   get:
 *     summary: Listar administradores (Admin)
 *     tags: [Admin Users]
 *     responses:
 *       200:
 *         description: Lista de admins
 */
router.get('/users/admins', adminUsersController.getAdmins);

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
 */
router.post(
  '/users/admins',
  [
    body('firstName').notEmpty().withMessage('firstName es requerido'),
    body('lastName').notEmpty().withMessage('lastName es requerido'),
    body('userName').notEmpty().withMessage('userName es requerido'),
    body('email').isEmail().withMessage('email inválido'),
    body('password').isLength({ min: 6 }).withMessage('password mínimo 6 caracteres'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('Las contraseñas no coinciden');
      return true;
    }),
    body('phone').notEmpty().withMessage('phone es requerido'),
  ],
  adminUsersController.createAdmin
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
 *     responses:
 *       200:
 *         description: Admin actualizado
 */
router.put('/users/admins/:id', adminUsersController.updateAdmin);

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
 */
router.patch(
  '/users/:id/status',
  [body('isActive').isBoolean().withMessage('isActive debe ser un booleano')],
  adminUsersController.updateUserStatus
);

// Tipos de Comercio (Admin)
/**
 * @swagger
 * /api/admin/commerce-types:
 *   get:
 *     summary: Listar tipos de comercio (Admin)
 *     tags: [Commerce Types]
 *     responses:
 *       200:
 *         description: Lista de tipos
 */
router.get('/commerce-types', commerceTypesController.getCommerceTypes);

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
 *         description: Tipo de comercio
 */
router.get('/commerce-types/:id', commerceTypesController.getCommerceTypeById);

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
 *         description: Tipo creado
 */
router.post(
  '/commerce-types',
  upload.single('icon'),
  [body('name').notEmpty().withMessage('name es requerido')],
  commerceTypesController.createCommerceType
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
 *     responses:
 *       200:
 *         description: Tipo actualizado
 */
router.put('/commerce-types/:id', upload.single('icon'), commerceTypesController.updateCommerceType);

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
 */
router.delete('/commerce-types/:id', commerceTypesController.deleteCommerceType);

export default router;