import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InitMeasureUnit, StandardMeasureUnit } from '@wac/shared/enums/measure-unit.enum';
import { StorageLocation } from '@wac/shared/enums/storage-location';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateDispenserDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  number: number;

  @ApiPropertyOptional({ type: 'string', format: 'date-time', default: null })
  @IsOptional()
  fillDate: Date;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  initQuantity: number;

  @ApiPropertyOptional({ enum: InitMeasureUnit, default: InitMeasureUnit.Kg })
  @IsEnum(InitMeasureUnit)
  @IsOptional()
  initMeasureUnit: string;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  quantityIn: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  quantityOut: number;

  @ApiPropertyOptional({ enum: StandardMeasureUnit, default: StandardMeasureUnit.Kg })
  @IsEnum(StandardMeasureUnit)
  @IsOptional()
  measureUnit: string;

  @ApiPropertyOptional({ type: 'string', format: 'date-time' })
  @IsOptional()
  expiryDate: Date;

  @ApiProperty()
  @IsInt()
  volume: number;

  @ApiPropertyOptional({ enum: StorageLocation })
  @IsEnum(StorageLocation)
  @IsOptional()
  storage: StorageLocation;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isFree: boolean;

  @ApiProperty()
  @IsUUID()
  shopId: string; // uuid, not null

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  ingredientId: string; // uuid, but can be null

  @ApiPropertyOptional()
  @IsOptional()
  inventories: string[];
}
