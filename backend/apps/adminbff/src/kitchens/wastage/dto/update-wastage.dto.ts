import { PartialType } from '@nestjs/swagger';
import { CreateWastageDto } from './create-wastage.dto';

export class UpdateWastageDto extends PartialType(CreateWastageDto) {}
