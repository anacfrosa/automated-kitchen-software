import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateShopDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  shopId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  status: boolean;

  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // locationId: string;
}
