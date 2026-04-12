import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Configuration from '../models/Configuration.js';

export const seedDatabase = async () => {
  await seedDefaultAdmin();
  await seedDefaultConfigurations();
};

const seedDefaultAdmin = async () => {
  const existing = await User.findOne({ isDefault: true });
  if (existing) return;

  const hashedPassword = await bcrypt.hash(
    process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@1234!',
    10
  );

  await User.create({
    firstName: 'Admin',
    lastName: 'Default',
    userName: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
    email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@apicenar.com',
    password: hashedPassword,
    phone: '8090000000',
    role: 'Admin',
    isActive: true,
    isDefault: true,
  });

  console.log('Default admin created');
};

const seedDefaultConfigurations = async () => {
  const existing = await Configuration.findOne({ key: 'ITBIS' });
  if (existing) return;

  await Configuration.create({
    key: 'ITBIS',
    value: '18',
    description: 'Impuesto ITBIS en porcentaje',
  });

  console.log('Default configurations created');
};