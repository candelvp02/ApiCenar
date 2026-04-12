import Address from '../models/Address.js';

export const getMyAddressesService = async (clientId) => {
  return Address.find({ clientId });
};

export const getAddressByIdService = async (clientId, id) => {
  const address = await Address.findOne({ _id: id, clientId });
  if (!address) throw { status: 404, message: 'Dirección no encontrada' };
  return address;
};

export const createAddressService = async (clientId, data) => {
  return Address.create({ clientId, ...data });
};

export const updateAddressService = async (clientId, id, data) => {
  const address = await Address.findOneAndUpdate({ _id: id, clientId }, data, { new: true });
  if (!address) throw { status: 404, message: 'Dirección no encontrada' };
  return address;
};

export const deleteAddressService = async (clientId, id) => {
  const address = await Address.findOneAndDelete({ _id: id, clientId });
  if (!address) throw { status: 404, message: 'Dirección no encontrada' };
};