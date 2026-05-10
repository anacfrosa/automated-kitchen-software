import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InitMeasureUnit, StandardMeasureUnit } from '@wac/shared/enums/measure-unit.enum';
import { StorageLocation } from '@wac/shared/enums/storage-location';
import { IsArray, IsDecimal, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { string } from 'joi';

export class CreateInventoryDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiPropertyOptional()
  @IsNumber()
  initQuantity: number;

  @ApiPropertyOptional({ enum: InitMeasureUnit })
  @IsEnum(InitMeasureUnit)
  initMeasureUnit: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  quantityIn: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  quantityOut: number;

  @ApiPropertyOptional({ enum: StandardMeasureUnit })
  @IsEnum(StandardMeasureUnit)
  @IsOptional()
  measureUnit: string;

  @ApiProperty()
  @IsInt()
  @Min(1) // Ensure that the lotNumber is greater than 0
  lotNumber: number;

  @ApiProperty({ type: 'string', format: 'date-time' })
  expiryDate: Date;

  @ApiPropertyOptional({ enum: StorageLocation, default: StorageLocation.FRIDGE })
  @IsEnum(StorageLocation)
  @IsOptional()
  storage: StorageLocation;

  @ApiProperty()
  @IsUUID()
  shopId: string; // uuid, not null

  @ApiProperty()
  @IsUUID()
  purchaseItemId: string;

  // @ApiProperty({
  //   type: [String], // Specifies that this is an array of strings
  //   description: 'List of purchase item IDs',
  // })
  // @IsArray() // Validates that the value is an array
  // @IsString({ each: true }) // Validates that each element in the array is a string
  // purchaseItemsId: string[];
}
