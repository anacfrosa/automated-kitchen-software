import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateSupplierDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  zipcode: string;

  @ApiProperty()
  @IsInt({ message: 'Phone number must be an integer.' })
  @Min(100000000, { message: 'Phone number must be at least 100000000.' })
  @Max(999999999, { message: 'Phone number must be at most 999999999.' })
  phone: number;

  @ApiProperty()
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  website?: string;
}
