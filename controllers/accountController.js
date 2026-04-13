import User from '../models/User.js';
import Commerce from '../models/Commerce.js';

export async function GetProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      const error = new Error('Usuario no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === 'Commerce') {
      const commerce = await Commerce.findOne({ userId: user._id }).populate('commerceTypeId', 'name icon');
      return res.status(200).json({ ...user.toObject(), commerce });
    }

    res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}

export async function UpdateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      const error = new Error('Usuario no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === 'Client' || user.role === 'Delivery') {
      const { firstName, lastName, phone } = req.body;
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (phone) user.phone = phone;
      if (req.file) user.profileImage = `/public/assets/${req.file.filename}`;
      await user.save();
      return res.status(200).json(user);
    }

    if (user.role === 'Commerce') {
      const { email, phone, openingTime, closingTime } = req.body;
      if (email) user.email = email;
      if (phone) user.phone = phone;
      await user.save();

      const commerce = await Commerce.findOne({ userId: user._id });
      if (openingTime) commerce.openingTime = openingTime;
      if (closingTime) commerce.closingTime = closingTime;
      if (req.file) commerce.logo = `/public/assets/${req.file.filename}`;
      await commerce.save();

      return res.status(200).json({ user, commerce });
    }

    res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
}