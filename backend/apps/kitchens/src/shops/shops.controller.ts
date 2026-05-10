import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

@Controller()
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @MessagePattern({ cmd: 'createShop' })
  create({ locale, data }: { locale: string; data: CreateShopDto }) {
    return this.shopsService.create(locale, data);
  }

  @MessagePattern({ cmd: 'findAllShops' })
  async findAll(locale: string) {
    return await this.shopsService.findAll(locale);
  }

  @MessagePattern({ cmd: 'findOneShop' })
  async findOne({ locale, id }: { locale: string; id: string }) {
    return await this.shopsService.findOne(locale, id);
  }

  @MessagePattern({ cmd: 'updateShop' })
  update({ locale, id, data }: { locale: string; id: string; data: UpdateShopDto }) {
    return this.shopsService.update(locale, id, data);
  }

  @MessagePattern({ cmd: 'removeShop' })
  remove({ locale, id }: { locale: string; id: string }) {
    return this.shopsService.remove(locale, id);
  }
}
