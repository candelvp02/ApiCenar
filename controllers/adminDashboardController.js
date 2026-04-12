import * as adminDashboardService from '../services/adminDashboardService.js';

export const getDashboardMetrics = async (req, res) => {
  try {
    const metrics = await adminDashboardService.getDashboardMetricsService();
    res.status(200).json(metrics);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};