import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateVendorDto {
  @IsString()
  @IsOptional()
  storeName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  logoUrl?: string;
} 