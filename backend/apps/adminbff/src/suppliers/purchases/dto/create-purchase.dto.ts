import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PurchaseStatus } from '@wac/shared/enums/purchase-status.enum';
import { IsBoolean, IsDecimal, IsEnum, IsInt, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { CreatePurchaseItemDto } from './create-purchase-item.dto';

export class CreatePurchaseDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  number: number;

  @ApiProperty()
  @IsUUID()
  shopId: string;

  @ApiProperty()
  @IsUUID()
  supplierId: string;

  @ApiPropertyOptional({ type: 'string', format: 'date-time' })
  @IsOptional()
  purchaseDate: Date;

  @ApiPropertyOptional({ type: 'string', format: 'date-time', nullable: true })
  @IsOptional()
  deliveryDate: Date;

  @ApiPropertyOptional({ type: 'string', format: 'date-time', nullable: true })
  @IsOptional()
  receptionDate: Date;

  @ApiProperty({ enum: PurchaseStatus, default: PurchaseStatus.PENDING })
  @IsEnum(PurchaseStatus)
  status: PurchaseStatus;

  @ApiProperty()
  @IsNumber()
  totalCost: number;

  @ApiProperty({ type: [CreatePurchaseItemDto] })
  purchaseItems: CreatePurchaseItemDto[];
}
