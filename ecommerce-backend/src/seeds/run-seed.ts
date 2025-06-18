import { DataSource } from 'typeorm';
import { seedAdmin } from './seed-admin';
import { seedCustomer } from './seed-customer';
import { config } from 'dotenv';
import { join } from 'path';

// Import all entities used in seeding to ensure they are discovered
import { User } from '../users/entities/user.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Wishlist } from '../wishlist/entities/wishlist.entity';
import { Review } from '../reviews/entities/review.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { Specification } from '../products/entities/specification.entity';
import { Tag } from '../products/entities/tag.entity';

config({ path: join(__dirname, '../../.env') });

async function runSeed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'ecommerce',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Use glob pattern for entity discovery
    synchronize: true,
  });

  await dataSource.initialize();

  await seedAdmin(dataSource);
  await seedCustomer(dataSource);

  await dataSource.destroy();
}

runSeed().catch(console.error); 