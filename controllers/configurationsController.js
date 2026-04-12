import { validationResult } from 'express-validator';
import * as configurationsService from '../services/configurationsService.js';

export const getConfigurations = async (req, res) => {
  try {
    const data = await configurationsService.getConfigurationsService();
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getConfigurationByKey = async (req, res) => {
  try {
    const data = await configurationsService.getConfigurationByKeyService(req.params.key);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const updateConfiguration = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const data = await configurationsService.updateConfigurationService(req.params.key, req.body.value);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};