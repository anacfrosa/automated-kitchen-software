import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WastageService } from './wastage.service';
import { CreateWastage } from './wastage.interface';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class WastageController {
  constructor(private readonly wastageService: WastageService) {}

  @MessagePattern({ cmd: 'createWastage' })
  create({ locale, data }: { locale: string; data: CreateWastage }) {
    return this.wastageService.create(locale, data);
  }

  @MessagePattern({ cmd: 'findWastageByShop' })
  async findByShop({ locale, shopId }: { locale: string; shopId: string }) {
    return await this.wastageService.findByShop(locale, shopId);
  }
}
