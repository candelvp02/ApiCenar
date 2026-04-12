import { Router } from 'express';
import authRoutes from './authRoutes.js';
import accountRoutes from './accountRoutes.js';
import commerceCatalogRoutes from './commerceCatalogRoutes.js';
import ordersRoutes from './ordersRoutes.js';
import addressesRoutes from './addressesRoutes.js';
import favoritesRoutes from './favoritesRoutes.js';
import categoriesRoutes from './categoriesRoutes.js';
import productsRoutes from './productsRoutes.js';
import adminRoutes from './adminRoutes.js';
import configurationsRoutes from './configurationsRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/account', accountRoutes);
router.use('/commerce-types', commerceCatalogRoutes);
router.use('/commerce', commerceCatalogRoutes);
router.use('/orders', ordersRoutes);
router.use('/addresses', addressesRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/categories', categoriesRoutes);
router.use('/products', productsRoutes);
router.use('/admin', adminRoutes);
router.use('/configurations', configurationsRoutes);

export default router;