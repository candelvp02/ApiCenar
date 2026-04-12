import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Commerce from '../models/Commerce.js';
import Order from '../models/Order.js';

const buildPaginatedQuery = async (roleQuery, { search, page = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = 'desc' }) => {
  const query = { ...roleQuery };
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { userName: { $regex: search, $options: 'i' } },
    ];
  }
  const sort = { [sortBy]: sortDirection === 'desc' ? -1 : 1 };
  const skip = (page - 1) * pageSize;
  return { query, sort, skip };
};

export const getClientsService = async (params) => {
  const { query, sort, skip } = await buildPaginatedQuery({ role: 'Client' }, params);
  const [users, total] = await Promise.all([
    User.find(query).select('-password').sort(sort).skip(skip).limit(Number(params.pageSize || 10)),
    User.countDocuments(query),
  ]);

  const data = await Promise.all(
    users.map(async (u) => {
      const orderCount = await Order.countDocuments({ clientId: u._id });
      return { ...u.toObject(), orderCount };
    })
  );

  return { data, total, page: Number(params.page || 1), pageSize: Number(params.pageSize || 10) };
};

export const getDeliveriesService = async (params) => {
  const { query, sort, skip } = await buildPaginatedQuery({ role: 'Delivery' }, params);
  const [users, total] = await Promise.all([
    User.find(query).select('-password').sort(sort).skip(skip).limit(Number(params.pageSize || 10)),
    User.countDocuments(query),
  ]);

  const data = await Promise.all(
    users.map(async (u) => {
      const orderCount = await Order.countDocuments({ deliveryId: u._id, status: 'Completed' });
      return { ...u.toObject(), orderCount };
    })
  );

  return { data, total, page: Number(params.page || 1), pageSize: Number(params.pageSize || 10) };
};

export const getCommercesService = async (params) => {
  const { query, sort, skip } = await buildPaginatedQuery({ role: 'Commerce' }, params);
  const [users, total] = await Promise.all([
    User.find(query).select('-password').sort(sort).skip(skip).limit(Number(params.pageSize || 10)),
    User.countDocuments(query),
  ]);

  const data = await Promise.all(
    users.map(async (u) => {
      const commerce = await Commerce.findOne({ userId: u._id });
      const orderCount = await Order.countDocuments({ commerceId: commerce?._id });
      return { ...u.toObject(), commerce, orderCount };
    })
  );

  return { data, total, page: Number(params.page || 1), pageSize: Number(params.pageSize || 10) };
};

export const getAdminsService = async (params) => {
  const { query, sort, skip } = await buildPaginatedQuery({ role: 'Admin' }, params);
  const [data, total] = await Promise.all([
    User.find(query).select('-password').sort(sort).skip(skip).limit(Number(params.pageSize || 10)),
    User.countDocuments(query),
  ]);
  return { data, total, page: Number(params.page || 1), pageSize: Number(params.pageSize || 10) };
};

export const createAdminService = async (data) => {
  const { userName, email, password, firstName, lastName, phone } = data;

  const exists = await User.findOne({ $or: [{ userName }, { email }] });
  if (exists) {
    if (exists.userName === userName) throw { status: 409, message: 'El userName ya existe' };
    throw { status: 409, message: 'El email ya existe' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await User.create({
    firstName,
    lastName,
    userName,
    email,
    password: hashedPassword,
    phone,
    role: 'Admin',
    isActive: true,
  });

  const { password: _, ...result } = admin.toObject();
  return result;
};

export const updateAdminService = async (id, data) => {
  const admin = await User.findById(id);
  if (!admin) throw { status: 404, message: 'Administrador no encontrado' };
  if (admin.isDefault) throw { status: 403, message: 'El admin por defecto no puede ser modificado' };
  if (admin.role !== 'Admin') throw { status: 400, message: 'El usuario no es administrador' };

  const updated = await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
  return updated;
};

export const updateUserStatusService = async (requestingUserId, id, isActive) => {
  if (requestingUserId.toString() === id) {
    throw { status: 400, message: 'No puedes cambiar tu propio estado' };
  }

  const user = await User.findById(id);
  if (!user) throw { status: 404, message: 'Usuario no encontrado' };
  if (user.isDefault) throw { status: 403, message: 'El admin por defecto no puede ser modificado' };

  user.isActive = isActive;
  await user.save();
  return user;
};