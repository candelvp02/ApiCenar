import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

export async function GetDashboardMetrics(req, res, next) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalOrders, todayOrders,
      activeCommerces, inactiveCommerces,
      activeClients, inactiveClients,
      activeDeliveries, inactiveDeliveries,
      totalProducts,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
      User.countDocuments({ role: 'Commerce', isActive: true }),
      User.countDocuments({ role: 'Commerce', isActive: false }),
      User.countDocuments({ role: 'Client', isActive: true }),
      User.countDocuments({ role: 'Client', isActive: false }),
      User.countDocuments({ role: 'Delivery', isActive: true }),
      User.countDocuments({ role: 'Delivery', isActive: false }),
      Product.countDocuments(),
    ]);

    res.status(200).json({
      orders: { total: totalOrders, today: todayOrders },
      commerces: { active: activeCommerces, inactive: inactiveCommerces },
      clients: { active: activeClients, inactive: inactiveClients },
      deliveries: { active: activeDeliveries, inactive: inactiveDeliveries },
      products: { total: totalProducts },
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}