import { InventoryService } from './inventory.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateInventory, UpdateInventory } from './inventory.interface';
import { Controller } from '@nestjs/common';

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @MessagePattern({ cmd: 'createInventory' })
  create({ locale, data }: { locale: string; data: CreateInventory }) {
    return this.inventoryService.create(locale, data);
  }

  @MessagePattern({ cmd: 'findAllInventory' })
  async findAll({ locale }: { locale: string }) {
    return await this.inventoryService.findAll(locale);
  }

  @MessagePattern({ cmd: 'findInventoryByShopId' })
  async findByShop({ locale, shopId }: { locale: string; shopId: string }) {
    return await this.inventoryService.findByShop(locale, shopId);
  }

  @MessagePattern({ cmd: 'findInventoryByShopIdAndIngredientId' })
  async findByShopAndIngredient({
    locale,
    shopId,
    ingredientId,
  }: {
    locale: string;
    shopId: string;
    ingredientId: string;
  }) {
    return await this.inventoryService.findByShopAndIngredient(locale, shopId, ingredientId);
  }

  @MessagePattern({ cmd: 'findOneInventory' })
  async findOne({ locale, id }: { locale: string; id: string }) {
    return await this.inventoryService.findOne(locale, id);
  }

  @MessagePattern({ cmd: 'findByPurchaseItem' })
  async findByPurchaseItem({ locale, id }: { locale: string; id: string }) {
    return await this.inventoryService.findInventoryByPurchaseItem(locale, id);
  }

  @MessagePattern({ cmd: 'updateInventory' })
  update({ locale, id, data }: { locale: string; id: string; data: UpdateInventory }) {
    return this.inventoryService.update(locale, id, data);
  }

  @MessagePattern({ cmd: 'removeInventory' })
  remove({ locale, id }: { locale: string; id: string }) {
    return this.inventoryService.remove(locale, id);
  }
}
