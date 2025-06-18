import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  storeName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  logoUrl?: string;
} 