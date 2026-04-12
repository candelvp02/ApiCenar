import * as commerceCatalogService from '../services/commerceCatalogService.js';

export const getCommerceTypes = async (req, res) => {
  try {
    const result = await commerceCatalogService.getCommerceTypesService(req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getCommercesByType = async (req, res) => {
  try {
    const result = await commerceCatalogService.getCommercesByTypeService(req.user._id, req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getCommerceCatalog = async (req, res) => {
  try {
    const result = await commerceCatalogService.getCommerceCatalogService(req.params.commerceId);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};