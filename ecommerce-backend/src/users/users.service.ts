import { Injectable, NotFoundException, Logger, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../auth/decorators/roles.decorator';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.debug(`Creating user: ${createUserDto.email}`);
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      this.logger.debug(`User already exists: ${createUserDto.email}`);
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    this.logger.debug(`Password hashed successfully for: ${createUserDto.email}`);
    
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || UserRole.CUSTOMER, // Default to CUSTOMER if not provided
    });
    
    const savedUser = await this.usersRepository.save(user);
    this.logger.debug(`User created successfully: ${savedUser.email} with role: ${savedUser.role}`);
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.debug(`Looking up user by email: ${email}`);
    const user = await this.usersRepository.findOne({ where: { email } });
    this.logger.debug(`User lookup result for ${email}: ${user ? 'found' : 'not found'}`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async createSeller(createUserDto: CreateUserDto): Promise<User> {
    this.logger.debug(`Creating seller: ${createUserDto.email}`);
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      this.logger.debug(`User already exists: ${createUserDto.email}`);
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    this.logger.debug(`Password hashed successfully for seller: ${createUserDto.email}`);
    
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: UserRole.SELLER,
    });
    
    const savedUser = await this.usersRepository.save(user);
    this.logger.debug(`Seller created successfully: ${savedUser.email}`);
    return savedUser;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    this.logger.debug(`Validating password for user: ${user.email}`);
    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      this.logger.debug(`Password validation result for ${user.email}: ${isPasswordValid}`);
      return isPasswordValid;
    } catch (error) {
      this.logger.error(`Error validating password for ${user.email}: ${error.message}`);
      return false;
    }
  }

  async findById(id: string): Promise<User> {
    this.logger.debug(`Looking up user by ID: ${id}`);
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.debug(`User not found with ID: ${id}`);
      throw new NotFoundException('User not found');
    }
    this.logger.debug(`User found with ID: ${id}`);
    return user;
  }
}