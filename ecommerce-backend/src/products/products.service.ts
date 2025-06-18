import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Specification } from './entities/specification.entity';
import { Tag } from './entities/tag.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Vendor } from '../vendors/entities/vendor.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Specification)
    private readonly specificationRepository: Repository<Specification>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createProductDto: CreateProductDto, vendor: Vendor): Promise<Product> {
    const { specifications, tagIds, ...productData } = createProductDto;

    // Create product
    const product = this.productRepository.create({
      ...productData,
      vendor,
    });

    // Add specifications if provided
    if (specifications) {
      product.specifications = specifications.map(spec =>
        this.specificationRepository.create({
          ...spec,
          product,
        }),
      );
    }

    // Add tags if provided
    if (tagIds) {
      const tags = await this.tagRepository.findByIds(tagIds);
      if (tags.length !== tagIds.length) {
        throw new BadRequestException('One or more tags not found');
      }
      product.tags = tags;
    }

    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['vendor', 'specifications', 'tags'],
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['vendor', 'specifications', 'tags'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, vendor?: Vendor): Promise<Product> {
    const product = await this.findOne(id);
    if (vendor && product.vendor.id !== vendor.id) {
      throw new BadRequestException('You can only update your own products');
    }
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string, vendor: Vendor): Promise<void> {
    const product = await this.findOne(id);

    // Check if product belongs to vendor
    if (product.vendor.id !== vendor.id) {
      throw new BadRequestException('You can only delete your own products');
    }

    await this.productRepository.remove(product);
  }

  async findByVendor(vendorId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { vendor: { id: vendorId } },
      relations: ['specifications', 'tags'],
    });
  }
} 