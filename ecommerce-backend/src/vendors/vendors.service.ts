import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  async create(createVendorDto: CreateVendorDto, user: User): Promise<Vendor> {
    // Check if user already has a vendor profile
    const existingProfile = await this.vendorRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (existingProfile) {
      throw new BadRequestException('User already has a vendor profile');
    }

    // Create vendor profile
    const vendorProfile = this.vendorRepository.create({
      ...createVendorDto,
      user,
    });

    return this.vendorRepository.save(vendorProfile);
  }

  async findOne(user: User): Promise<Vendor> {
    const vendorProfile = await this.vendorRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!vendorProfile) {
      throw new NotFoundException('Vendor profile not found');
    }

    return vendorProfile;
  }

  async update(user: User, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const vendorProfile = await this.findOne(user);

    // Update vendor profile
    Object.assign(vendorProfile, updateVendorDto);
    return this.vendorRepository.save(vendorProfile);
  }

  async findAll(): Promise<Vendor[]> {
    return this.vendorRepository.find({
      relations: ['user'],
    });
  }

  async findById(id: string): Promise<Vendor> {
    const vendorProfile = await this.vendorRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!vendorProfile) {
      throw new NotFoundException(`Vendor profile with ID ${id} not found`);
    }

    return vendorProfile;
  }
} 