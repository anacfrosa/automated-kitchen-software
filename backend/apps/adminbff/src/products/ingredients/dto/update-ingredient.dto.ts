import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { IsDecimal, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Language } from '@wac/shared';
import { CreateIngredientDto } from './create-ingredient.dto';

export class UpdateIngredientDto extends PartialType(
  PickType(CreateIngredientDto, ['image', 'icon', 'language', 'name', 'form', 'shelfLife', 'density'] as const),
) {}
