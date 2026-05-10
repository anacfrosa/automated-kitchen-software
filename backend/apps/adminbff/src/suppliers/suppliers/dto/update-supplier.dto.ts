import { PartialType, PickType } from '@nestjs/swagger';
import { CreateSupplierDto } from './create-supplier.dto';

export class UpdateSupplierDto extends PartialType(
  PickType(CreateSupplierDto, ['name', 'address', 'country', 'city', 'zipcode', 'phone', 'email', 'website'] as const),
) {}
