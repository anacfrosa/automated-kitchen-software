import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DispensersService } from './dispensers.service';
import { CreateDispenser, UpdateDispenser } from './dispensers.interface';
import { StorageLocation } from '@wac/shared/enums/storage-location';

@Controller()
export class DispensersController {
  constructor(private readonly dispensersService: DispensersService) {}

  @MessagePattern({ cmd: 'createDispenser' })
  create({ locale, data }: { locale: string; data: CreateDispenser }) {
    return this.dispensersService.create(locale, data);
  }

  @MessagePattern({ cmd: 'findDispensersByShop' })
  async findByShopId({ locale, shopId }: { locale: string; shopId: string }) {
    return await this.dispensersService.findByShopId(locale, shopId);
  }

  @MessagePattern({ cmd: 'findDispensersByShopAndIngredient' })
  async findByShopAndIngredient({
    locale,
    shopId,
    ingredientId,
  }: {
    locale: string;
    shopId: string;
    ingredientId: string;
  }) {
    return await this.dispensersService.findByShopAndIngredient(locale, shopId, ingredientId);
  }

  @MessagePattern({ cmd: 'findDispensersByShopAndStorage' })
  async findByShopAndStorage({
    locale,
    shopId,
    storage,
  }: {
    locale: string;
    shopId: string;
    storage: StorageLocation;
  }) {
    return await this.dispensersService.findByShopAndStorage(locale, shopId, storage);
  }

  @MessagePattern({ cmd: 'findOneDispenser' })
  async findOne({ locale, id }: { locale: string; id: string }) {
    return await this.dispensersService.findOne(locale, id);
  }

  @MessagePattern({ cmd: 'findLotsByDispenser' })
  async findLotsByDispenser({ locale, dispenserId }: { locale: string; dispenserId: string }) {
    return await this.dispensersService.findLotsInDispenser(locale, dispenserId);
  }

  @MessagePattern({ cmd: 'updateDispenser' })
  update({ locale, id, data }: { locale: string; id: string; data: UpdateDispenser }) {
    console.log('Updated Data: ', data);

    if (data.isFree != undefined && data.isFree == true) {
      console.log('Clean Dispenser');
      // Clen dispenser
      return this.dispensersService.updateFreeDispenser(locale, id);
    }

    if (data.initQuantity != undefined) {
      console.log('Fill Dispenser');
      // Fill Dispenser with one or more lots
      return this.dispensersService.updateFillDispenser(locale, id, data);
    }

    if (data.quantityIn != undefined) {
      console.log('Refill Dispenser');
      // Refill Dispenser with one or more lots
      return this.dispensersService.updateRefillDispenser(locale, id, data);
    }

    return;
  }

  @MessagePattern({ cmd: 'removeDispenser' })
  remove({ locale, id }: { locale: string; id: string }) {
    return this.dispensersService.remove(locale, id);
  }
}
