import { PartialType, PickType } from '@nestjs/swagger';
import { CreateInventoryDto } from './create-inventory.dto';

export class UpdateInventoryDto extends PartialType(
  PickType(CreateInventoryDto, ['quantityIn', 'quantityOut', 'measureUnit', 'storage'] as const),
) {}
