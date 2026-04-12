import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Commerce from '../models/Commerce.js';

export const getProfileService = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw { status: 404, message: 'Usuario no encontrado' };

  if (user.role === 'Commerce') {
    const commerce = await Commerce.findOne({ userId }).populate('commerceTypeId', 'name icon');
    return { ...user.toObject(), commerce };
  }

  return user;
};

export const updateProfileService = async (userId, data, file) => {
  const user = await User.findById(userId);
  if (!user) throw { status: 404, message: 'Usuario no encontrado' };

  if (user.role === 'Client' || user.role === 'Delivery') {
    const { firstName, lastName, phone } = data;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (file) user.profileImage = `/public/assets/${file.filename}`;
    await user.save();
    return user;
  }

  if (user.role === 'Commerce') {
    const { email, phone, openingTime, closingTime } = data;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    await user.save();

    const commerce = await Commerce.findOne({ userId });
    if (openingTime) commerce.openingTime = openingTime;
    if (closingTime) commerce.closingTime = closingTime;
    if (file) commerce.logo = `/public/assets/${file.filename}`;
    await commerce.save();

    return { user, commerce };
  }
};