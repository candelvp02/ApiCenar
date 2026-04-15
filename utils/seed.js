import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Configuration from '../models/Configuration.js';
import CommerceType from '../models/CommerceType.js';
import Commerce from '../models/Commerce.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

export const seedDatabase = async () => {
  await seedDefaultAdmin();
  await seedDefaultConfigurations();
  await seedCommerceTypes();
  await seedSupportUsers();
  await seedCommercesCategoriesAndProducts();
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

  console.log('Default configuration ITBIS created');
};

const seedCommerceTypes = async () => {
  const types = [
    { name: 'Pizzería', icon: '/public/assets/pizzeria.png' },
    { name: 'Hamburguesas', icon: '/public/assets/burgers.png' },
    { name: 'Cafetería', icon: '/public/assets/cafe.png' },
    { name: 'Postres', icon: '/public/assets/desserts.png' },
  ];

  for (const type of types) {
    const exists = await CommerceType.findOne({ name: type.name });
    if (!exists) {
      await CommerceType.create(type);
    }
  }

  console.log('Commerce types seeded');
};

const seedSupportUsers = async () => {
  const hashedPassword = await bcrypt.hash('Admin@1234!', 10);

  const users = [
    {
      firstName: 'Juan',
      lastName: 'Admin',
      userName: 'juan.admin',
      email: 'juan.admin@apicenar.com',
      phone: '8091111111',
      role: 'Admin',
      isActive: true,
      isDefault: false,
    },
    {
      firstName: 'María',
      lastName: 'Cliente',
      userName: 'maria.client',
      email: 'maria.client@apicenar.com',
      phone: '8092222222',
      role: 'Client',
      isActive: true,
    },
    {
      firstName: 'Pedro',
      lastName: 'Delivery',
      userName: 'pedro.delivery',
      email: 'pedro.delivery@apicenar.com',
      phone: '8093333333',
      role: 'Delivery',
      isActive: true,
      isAvailable: true,
    },
    {
      firstName: 'Luis',
      lastName: 'Delivery',
      userName: 'luis.delivery',
      email: 'luis.delivery@apicenar.com',
      phone: '8094444444',
      role: 'Delivery',
      isActive: true,
      isAvailable: true,
    },
  ];

  for (const userData of users) {
    const exists = await User.findOne({
      $or: [{ userName: userData.userName }, { email: userData.email }],
    });

    if (!exists) {
      await User.create({
        ...userData,
        password: hashedPassword,
      });
    }
  }

  console.log('Support users seeded');
};

const seedCommercesCategoriesAndProducts = async () => {
  const hashedPassword = await bcrypt.hash('Admin@1234!', 10);

  const commerceTypes = await CommerceType.find();

  const pizzeriaType = commerceTypes.find((x) => x.name === 'Pizzería');
  const burgersType = commerceTypes.find((x) => x.name === 'Hamburguesas');
  const cafeType = commerceTypes.find((x) => x.name === 'Cafetería');

  const commercesData = [
    {
      user: {
        firstName: 'Pizza Bella',
        lastName: 'Commerce',
        userName: 'pizza.bella',
        email: 'pizza.bella@apicenar.com',
        phone: '8095550001',
        password: hashedPassword,
        role: 'Commerce',
        isActive: true,
      },
      commerce: {
        name: 'Pizza Bella',
        description: 'Pizzería italiana y bebidas',
        phone: '8095550001',
        openingTime: '08:00',
        closingTime: '22:00',
        commerceTypeId: pizzeriaType?._id,
        logo: '/public/assets/pizza-bella.png',
      },
      categories: [
        {
          name: 'Pizzas clásicas',
          description: 'Las pizzas tradicionales',
          products: [
            { name: 'Pizza Margarita', description: 'Queso y salsa', price: 350, image: '/public/assets/margarita.png' },
            { name: 'Pizza Jamón', description: 'Jamón y queso', price: 395, image: '/public/assets/jamon.png' },
            { name: 'Pizza Pepperoni', description: 'Pepperoni y queso', price: 425, image: '/public/assets/pepperoni.png' },
          ],
        },
        {
          name: 'Pizzas especiales',
          description: 'Pizzas premium',
          products: [
            { name: 'Pizza Suprema', description: 'Carnes y vegetales', price: 525, image: '/public/assets/suprema.png' },
            { name: 'Pizza BBQ', description: 'Pollo BBQ y queso', price: 540, image: '/public/assets/bbq.png' },
            { name: 'Pizza 4 Quesos', description: 'Mezcla de quesos', price: 560, image: '/public/assets/4quesos.png' },
          ],
        },
        {
          name: 'Bebidas',
          description: 'Bebidas frías',
          products: [
            { name: 'Refresco Cola', description: 'Botella 500ml', price: 80, image: '/public/assets/cola.png' },
            { name: 'Jugo Natural', description: 'Jugo del día', price: 95, image: '/public/assets/jugo.png' },
            { name: 'Agua', description: 'Agua purificada', price: 50, image: '/public/assets/agua.png' },
          ],
        },
      ],
    },
    {
      user: {
        firstName: 'Burger Town',
        lastName: 'Commerce',
        userName: 'burger.town',
        email: 'burger.town@apicenar.com',
        phone: '8095550002',
        password: hashedPassword,
        role: 'Commerce',
        isActive: true,
      },
      commerce: {
        name: 'Burger Town',
        description: 'Hamburguesas y acompañantes',
        phone: '8095550002',
        openingTime: '09:00',
        closingTime: '23:00',
        commerceTypeId: burgersType?._id,
        logo: '/public/assets/burger-town.png',
      },
      categories: [
        {
          name: 'Hamburguesas',
          description: 'Hamburguesas artesanales',
          products: [
            { name: 'Classic Burger', description: 'Carne, queso y vegetales', price: 280, image: '/public/assets/classic-burger.png' },
            { name: 'Cheese Burger', description: 'Doble queso', price: 310, image: '/public/assets/cheese-burger.png' },
            { name: 'Bacon Burger', description: 'Tocineta y queso', price: 345, image: '/public/assets/bacon-burger.png' },
          ],
        },
        {
          name: 'Acompañantes',
          description: 'Papas y extras',
          products: [
            { name: 'Papas fritas', description: 'Porción regular', price: 120, image: '/public/assets/papas.png' },
            { name: 'Aros de cebolla', description: 'Porción mediana', price: 135, image: '/public/assets/aros.png' },
            { name: 'Nuggets', description: '6 unidades', price: 180, image: '/public/assets/nuggets.png' },
          ],
        },
        {
          name: 'Bebidas',
          description: 'Refrescos y batidas',
          products: [
            { name: 'Refresco limón', description: '500ml', price: 85, image: '/public/assets/limon.png' },
            { name: 'Malteada vainilla', description: '16oz', price: 160, image: '/public/assets/vainilla.png' },
            { name: 'Agua', description: 'Botella', price: 50, image: '/public/assets/agua2.png' },
          ],
        },
      ],
    },
    {
      user: {
        firstName: 'Café Aroma',
        lastName: 'Commerce',
        userName: 'cafe.aroma',
        email: 'cafe.aroma@apicenar.com',
        phone: '8095550003',
        password: hashedPassword,
        role: 'Commerce',
        isActive: true,
      },
      commerce: {
        name: 'Café Aroma',
        description: 'Café, postres y sandwiches',
        phone: '8095550003',
        openingTime: '07:00',
        closingTime: '21:00',
        commerceTypeId: cafeType?._id,
        logo: '/public/assets/cafe-aroma.png',
      },
      categories: [
        {
          name: 'Cafés',
          description: 'Bebidas calientes',
          products: [
            { name: 'Espresso', description: 'Café concentrado', price: 110, image: '/public/assets/espresso.png' },
            { name: 'Cappuccino', description: 'Café con leche espumada', price: 145, image: '/public/assets/cappuccino.png' },
            { name: 'Latte', description: 'Café con leche', price: 150, image: '/public/assets/latte.png' },
          ],
        },
        {
          name: 'Postres',
          description: 'Postres caseros',
          products: [
            { name: 'Cheesecake', description: 'Porción individual', price: 180, image: '/public/assets/cheesecake.png' },
            { name: 'Brownie', description: 'Brownie de chocolate', price: 130, image: '/public/assets/brownie.png' },
            { name: 'Croissant dulce', description: 'Relleno de crema', price: 125, image: '/public/assets/croissant.png' },
          ],
        },
        {
          name: 'Sandwiches',
          description: 'Opciones ligeras',
          products: [
            { name: 'Sandwich mixto', description: 'Jamón y queso', price: 190, image: '/public/assets/mixto.png' },
            { name: 'Sandwich de pollo', description: 'Pollo desmenuzado', price: 220, image: '/public/assets/pollo.png' },
            { name: 'Panini caprese', description: 'Tomate y mozzarella', price: 240, image: '/public/assets/caprese.png' },
          ],
        },
      ],
    },
  ];

  for (const item of commercesData) {
    let user = await User.findOne({ email: item.user.email });

    if (!user) {
      user = await User.create(item.user);
    }

    let commerce = await Commerce.findOne({ userId: user._id });

    if (!commerce) {
      commerce = await Commerce.create({
        ...item.commerce,
        userId: user._id,
      });
    }

    for (const categoryData of item.categories) {
      let category = await Category.findOne({
        commerceId: commerce._id,
        name: categoryData.name,
      });

      if (!category) {
        category = await Category.create({
          commerceId: commerce._id,
          name: categoryData.name,
          description: categoryData.description,
        });
      }

      for (const productData of categoryData.products) {
        const existingProduct = await Product.findOne({
          commerceId: commerce._id,
          categoryId: category._id,
          name: productData.name,
        });

        if (!existingProduct) {
          await Product.create({
            commerceId: commerce._id,
            categoryId: category._id,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            image: productData.image,
            isActive: true,
          });
        }
      }
    }
  }

  console.log('Commerces, categories and products seeded');
};