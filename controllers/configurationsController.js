import Configuration from '../models/Configuration.js';

export async function GetConfigurations(req, res, next) {
  try {
    const data = await Configuration.find();
    res.status(200).json(data);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function GetConfigurationByKey(req, res, next) {
  try {
    const config = await Configuration.findOne({ key: req.params.key });

    if (!config) {
      const error = new Error('Configuración no encontrada.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(config);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function UpdateConfiguration(req, res, next) {
  const { value } = req.body;

  try {
    const config = await Configuration.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { new: true }
    );

    if (!config) {
      const error = new Error('Configuración no encontrada.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(config);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}