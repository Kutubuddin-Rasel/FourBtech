import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, Min, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

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

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

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