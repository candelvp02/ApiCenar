import Address from '../models/Address.js';

export async function GetMyAddresses(req, res, next) {
  try {
    const data = await Address.find({ clientId: req.user._id });
    res.status(200).json(data);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function GetAddressById(req, res, next) {
  try {
    const address = await Address.findOne({ _id: req.params.id, clientId: req.user._id });

    if (!address) {
      const error = new Error('Dirección no encontrada.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(address);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function CreateAddress(req, res, next) {
  const { label, street, sector, city, reference } = req.body;

  try {
    const address = await Address.create({
      clientId: req.user._id,
      label,
      street,
      sector,
      city,
      reference,
    });

    res.status(201).json(address);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function UpdateAddress(req, res, next) {
  try {
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, clientId: req.user._id },
      req.body,
      { new: true }
    );

    if (!address) {
      const error = new Error('Dirección no encontrada.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(address);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function DeleteAddress(req, res, next) {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, clientId: req.user._id });

    if (!address) {
      const error = new Error('Dirección no encontrada.');
      error.statusCode = 404;
      throw error;
    }

    res.status(204).send();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}