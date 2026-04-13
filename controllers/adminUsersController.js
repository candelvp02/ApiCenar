import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Commerce from '../models/Commerce.js';
import Order from '../models/Order.js';

export async function GetClients(req, res, next) {
  try {
    const { search, page = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = 'desc' } = req.query;

    const query = { role: 'Client' };
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sort = { [sortBy]: sortDirection === 'desc' ? -1 : 1 };
    const skip = (page - 1) * pageSize;

    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort(sort).skip(skip).limit(Number(pageSize)),
      User.countDocuments(query),
    ]);

    const data = await Promise.all(
      users.map(async (u) => {
        const orderCount = await Order.countDocuments({ clientId: u._id });
        return { ...u.toObject(), orderCount };
      })
    );

    res.status(200).json({ data, total, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function GetDeliveries(req, res, next) {
  try {
    const { search, page = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = 'desc' } = req.query;

    const query = { role: 'Delivery' };
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sort = { [sortBy]: sortDirection === 'desc' ? -1 : 1 };
    const skip = (page - 1) * pageSize;

    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort(sort).skip(skip).limit(Number(pageSize)),
      User.countDocuments(query),
    ]);

    const data = await Promise.all(
      users.map(async (u) => {
        const orderCount = await Order.countDocuments({ deliveryId: u._id, status: 'Completed' });
        return { ...u.toObject(), orderCount };
      })
    );

    res.status(200).json({ data, total, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function GetCommerces(req, res, next) {
  try {
    const { search, page = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = 'desc' } = req.query;

    const query = { role: 'Commerce' };
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sort = { [sortBy]: sortDirection === 'desc' ? -1 : 1 };
    const skip = (page - 1) * pageSize;

    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort(sort).skip(skip).limit(Number(pageSize)),
      User.countDocuments(query),
    ]);

    const data = await Promise.all(
      users.map(async (u) => {
        const commerce = await Commerce.findOne({ userId: u._id });
        const orderCount = await Order.countDocuments({ commerceId: commerce?._id });
        return { ...u.toObject(), commerce, orderCount };
      })
    );

    res.status(200).json({ data, total, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function GetAdmins(req, res, next) {
  try {
    const { search, page = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = 'desc' } = req.query;

    const query = { role: 'Admin' };
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sort = { [sortBy]: sortDirection === 'desc' ? -1 : 1 };
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      User.find(query).select('-password').sort(sort).skip(skip).limit(Number(pageSize)),
      User.countDocuments(query),
    ]);

    res.status(200).json({ data, total, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function CreateAdmin(req, res, next) {
  const { firstName, lastName, userName, email, password, confirmPassword, phone } = req.body;

  try {
    if (password !== confirmPassword) {
      const error = new Error('Las contraseñas no coinciden.');
      error.statusCode = 400;
      throw error;
    }

    const existing = await User.findOne({ $or: [{ userName }, { email }] });
    if (existing) {
      const error = new Error(existing.userName === userName ? 'El userName ya existe.' : 'El email ya existe.');
      error.statusCode = 409;
      throw error;
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
    res.status(201).json(result);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function UpdateAdmin(req, res, next) {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin) {
      const error = new Error('Administrador no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    if (admin.isDefault) {
      const error = new Error('El admin por defecto no puede ser modificado.');
      error.statusCode = 403;
      throw error;
    }

    if (admin.role !== 'Admin') {
      const error = new Error('El usuario no es administrador.');
      error.statusCode = 400;
      throw error;
    }

    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.status(200).json(updated);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function UpdateUserStatus(req, res, next) {
  const { isActive } = req.body;

  try {
    if (req.user._id.toString() === req.params.id) {
      const error = new Error('No puedes cambiar tu propio estado.');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error('Usuario no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    if (user.isDefault) {
      const error = new Error('El admin por defecto no puede ser modificado.');
      error.statusCode = 403;
      throw error;
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}