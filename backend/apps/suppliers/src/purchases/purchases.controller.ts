import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PurchasesService } from './purchases.service';
import { CreatePurchase, UpdatePurchase, UpdatePurchaseItem } from './purchases.interface';

@Controller()
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @MessagePattern({ cmd: 'createPurchase' })
  create({ locale, data }: { locale: string; data: CreatePurchase }) {
    return this.purchasesService.create(locale, data);
  }

  @MessagePattern({ cmd: 'findPurchasesByShopId' })
  async findByShop({ locale, shopId }: { locale: string; shopId: string }) {
    return await this.purchasesService.findByShop(locale, shopId);
  }

  @MessagePattern({ cmd: 'findOnePurchase' })
  async findOne({ locale, id }: { locale: string; id: string }) {
    return await this.purchasesService.findOne(locale, id);
  }

  @MessagePattern({ cmd: 'findPurchaseItem' })
  async findPurchaseItem({ locale, id }: { locale: string; id: string }) {
    return await this.purchasesService.findPurchaseItem(locale, id);
  }

  @MessagePattern({ cmd: 'updatePurchase' })
  updatePurchase({ locale, id, data }: { locale: string; id: string; data: UpdatePurchase }) {
    return this.purchasesService.updatePurchase(locale, id, data);
  }

  @MessagePattern({ cmd: 'updatePurchaseItem' })
  updatePurchaseItem({
    locale,
    purchaseId,
    itemId,
    data,
  }: {
    locale: string;
    purchaseId: string;
    itemId: string;
    data: UpdatePurchaseItem;
  }) {
    return this.purchasesService.updatePurchaseItem(locale, purchaseId, itemId, data);
  }
}
