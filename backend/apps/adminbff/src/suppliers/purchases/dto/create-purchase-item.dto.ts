import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InitMeasureUnit } from '@wac/shared/enums/measure-unit.enum';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreatePurchaseItemDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsUUID()
  ingredientId: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ enum: InitMeasureUnit })
  @IsEnum(InitMeasureUnit)
  measureUnit: InitMeasureUnit;

  @ApiProperty()
  @IsNumber()
  unitPrice: number;

  @ApiProperty()
  @IsNumber()
  cost: number;

  @ApiPropertyOptional({ type: 'boolean', default: true })
  @IsBoolean()
  @IsOptional()
  isAccepted: boolean;
}
