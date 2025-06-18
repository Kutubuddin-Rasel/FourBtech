import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../auth/decorators/roles.decorator';
import { Product } from '../products/entities/product.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Wishlist } from '../wishlist/entities/wishlist.entity';
import { Review } from '../reviews/entities/review.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

export async function seedCustomer(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const productRepository = dataSource.getRepository(Product);
  const orderRepository = dataSource.getRepository(Order);
  const orderItemRepository = dataSource.getRepository(OrderItem);
  const wishlistRepository = dataSource.getRepository(Wishlist);
  const reviewRepository = dataSource.getRepository(Review);
  const vendorRepository = dataSource.getRepository(Vendor);

  // Create a customer user
  const customerEmail = 'customer@example.com';
  let customer = await userRepository.findOne({ where: { email: customerEmail } });

  if (!customer) {
    const hashedPassword = await bcrypt.hash('customerpassword', 10);
    customer = userRepository.create({
      email: customerEmail,
      password: hashedPassword,
      role: UserRole.CUSTOMER,
      name: 'Customer User',
    });
    await userRepository.save(customer);
    console.log('Customer user seeded!');
  } else {
    console.log('Customer user already exists.');
  }

  // Create some products if none exist
  let products = await productRepository.find();
  if (products.length === 0) {
    console.log('Seeding sample products...');
    const sellerUser = await userRepository.findOne({ where: { role: UserRole.ADMIN } }) || await userRepository.findOne({ where: { role: UserRole.SELLER } });
    if (!sellerUser) {
      console.error('No admin or seller user found to assign as product seller. Please seed admin/seller first.');
      return; 
    }

    // Create a vendor for the seller
    let vendor = await vendorRepository.findOne({ where: { user: { id: sellerUser.id } } });
    if (!vendor) {
      vendor = vendorRepository.create({
        storeName: faker.company.name(),
        description: faker.company.catchPhrase(),
        logoUrl: faker.image.urlLoremFlickr({ category: 'business' }),
        isActive: true,
        user: sellerUser,
      });
      await vendorRepository.save(vendor);
      console.log('Vendor created for seller!');
    }

    for (let i = 0; i < 5; i++) {
      const product = productRepository.create({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        stock: faker.number.int({ min: 10, max: 100 }),
        imageUrl: faker.image.urlLoremFlickr({ category: 'technics' }),
        isActive: true,
        vendor: vendor,
        seller: sellerUser,
      });
      await productRepository.save(product);
    }
    products = await productRepository.find(); // Refresh products after seeding
  } else {
    console.log('Products already exist, skipping product seeding.');
  }

  if (products.length === 0) {
    console.warn('No products available to create orders, wishlists, or reviews.');
    return; // Exit if no products exist
  }

  // Create some orders for the customer
  const existingOrders = await orderRepository.count({ where: { customer: { id: customer.id } } });
  if (existingOrders === 0) {
    console.log('Seeding sample orders...');
    for (let i = 0; i < 3; i++) {
      const order = orderRepository.create({
        customer: customer,
        status: faker.helpers.arrayElement([OrderStatus.PENDING, OrderStatus.SHIPPED, OrderStatus.DELIVERED]),
        total: 0,
      });
      await orderRepository.save(order);

      let totalOrderAmount = 0;
      const numberOfItems = faker.number.int({ min: 1, max: 3 });
      for (let j = 0; j < numberOfItems; j++) {
        const randomProduct = faker.helpers.arrayElement(products);
        const quantity = faker.number.int({ min: 1, max: 5 });
        const orderItem = orderItemRepository.create({
          order,
          product: randomProduct,
          quantity,
          price: randomProduct.price,
        });
        await orderItemRepository.save(orderItem);
        totalOrderAmount += randomProduct.price * quantity;
      }
      order.total = totalOrderAmount;
      await orderRepository.save(order);
    }
    console.log('Orders seeded!');
  } else {
    console.log('Orders already exist, skipping order seeding.');
  }

  // Add some products to the customer's wishlist
  const existingWishlistItems = await wishlistRepository.count({ where: { customer: { id: customer.id } } });
  if (existingWishlistItems === 0) {
    console.log('Seeding sample wishlist items...');
    const productsForWishlist = faker.helpers.arrayElements(products, { min: 1, max: 3 });
    for (const product of productsForWishlist) {
      const wishlistItem = wishlistRepository.create({ customer, product });
      await wishlistRepository.save(wishlistItem);
    }
    console.log('Wishlist items seeded!');
  } else {
    console.log('Wishlist items already exist, skipping wishlist seeding.');
  }

  // Add some reviews for the customer
  const existingReviews = await reviewRepository.count({ where: { customer: { id: customer.id } } });
  if (existingReviews === 0) {
    console.log('Seeding sample reviews...');
    const productsToReview = faker.helpers.arrayElements(products, { min: 1, max: 3 });
    for (const product of productsToReview) {
      const review = reviewRepository.create({
        customer,
        product,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.paragraph(),
        status: OrderStatus.PENDING, // Reviews might initially be pending approval
      });
      await reviewRepository.save(review);
    }
    console.log('Reviews seeded!');
  } else {
    console.log('Reviews already exist, skipping review seeding.');
  }
} 