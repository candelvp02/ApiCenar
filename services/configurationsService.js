import Configuration from '../models/Configuration.js';

export const getConfigurationsService = async () => {
  return Configuration.find();
};

export const getConfigurationByKeyService = async (key) => {
  const config = await Configuration.findOne({ key });
  if (!config) throw { status: 404, message: 'Configuración no encontrada' };
  return config;
};

export const updateConfigurationService = async (key, value) => {
  const config = await Configuration.findOneAndUpdate({ key }, { value }, { new: true });
  if (!config) throw { status: 404, message: 'Configuración no encontrada' };
  return config;
};