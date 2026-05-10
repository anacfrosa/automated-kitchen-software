import { PartialType, PickType } from '@nestjs/swagger';
import { CreateDispenserDto } from './create-dispenser.dto';

export class UpdateDispenserDto extends PartialType(
  PickType(CreateDispenserDto, [
    'fillDate',
    'initQuantity',
    'initMeasureUnit',
    'quantityIn',
    'quantityOut',
    'measureUnit',
    'expiryDate',
    'volume',
    'storage',
    'isFree',
    'ingredientId',
    'inventories',
  ] as const),
) {}
