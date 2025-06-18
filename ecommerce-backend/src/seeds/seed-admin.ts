import { User } from '../users/entities/user.entity';
import { UserRole } from '../auth/decorators/roles.decorator';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import * as bcrypt from 'bcrypt';

config({ path: join(__dirname, '../../.env') });

export async function seedAdmin(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const adminUser = await userRepository.findOne({ where: { role: UserRole.ADMIN } });

  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('adminstrongpass@123', 10);
    const newAdmin = userRepository.create({
      email: 'adminemai@gmail.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      name: 'Admin User',
    });
    await userRepository.save(newAdmin);
    console.log('Admin user seeded!');
  } else {
    console.log('Admin user already exists.');
  }
} 