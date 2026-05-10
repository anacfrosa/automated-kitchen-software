import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StandardMeasureUnit } from '@wac/shared/enums/measure-unit.enum';
import { WastageLocation } from '@wac/shared/enums/wastage-location.enum';
import { IsEnum, IsInt, isInt, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateWastageDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsUUID()
  shopId: string;

  @ApiProperty()
  @IsUUID()
  ingredientId: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsInt()
  day: number;

  @ApiProperty()
  @IsInt()
  month: number;

  @ApiProperty()
  @IsInt()
  year: number;
}
