import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDecimal, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Language } from '@wac/shared';
import { isFloat32Array } from 'util/types';

export class CreateIngredientDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ enum: Language, isArray: false })
  @IsNotEmpty()
  @IsEnum(Language)
  language: Language;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  form: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  shelfLife?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  density?: number;
}
