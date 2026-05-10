import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SupplyService } from './supply.service';
import { CreateSupplyNotif } from './supply.interface';

@Controller()
export class SupplyController {
  constructor(private readonly supplyService: SupplyService) {}

  @MessagePattern({ cmd: 'generateNotifByShop' })
  create({ locale, id }: { locale: string; id: string }) {
    console.log('\nGenerating new notifications...');
    console.log('Create Endpoint Supply - Shop id: ', id, '\n');
    return this.supplyService.create(locale, id);
  }

  @MessagePattern({ cmd: 'findSupplyNotifByShop' })
  async findByShop({ locale, id }: { locale: string; id: string }) {
    return await this.supplyService.findByShop(locale, id);
  }
}
