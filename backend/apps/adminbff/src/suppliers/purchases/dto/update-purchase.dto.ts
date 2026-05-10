import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreatePurchaseDto } from './create-purchase.dto';
import { CreatePurchaseItemDto } from './create-purchase-item.dto';

// export class UpdatePurchaseDto extends PartialType(PickType(CreatePurchaseDto, ['receptionDate', 'status'] as const)) {}

// export class UpdatePurchaseItemDto extends PartialType(PickType(CreatePurchaseItemDto, ['isAccepted'] as const)) {}

export class UpdatePurchaseDto extends PartialType(PickType(CreatePurchaseDto, ['receptionDate', 'status'] as const)) {
  @ApiProperty({
    description: 'Indicates whether the purchase item is accepted',
    required: false,
    type: Boolean,
  })
  isAccepted?: boolean;
}
