import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, Min, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

class SpecificationDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

class TagDto {
  @IsString()
  name: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecificationDto)
  @IsOptional()
  specifications?: SpecificationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  @IsOptional()
  tags?: TagDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagIds?: string[];
} 