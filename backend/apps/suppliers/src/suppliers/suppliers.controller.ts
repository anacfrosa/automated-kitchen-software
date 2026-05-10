import { MessagePattern } from '@nestjs/microservices';
import { SuppliersService } from './suppliers.service';
import { CreateSupplier, UpdateSupplier } from './suppliers.interface';
import { Controller } from '@nestjs/common';

@Controller()
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @MessagePattern({ cmd: 'createSupplier' })
  create({ locale, data }: { locale: string; data: CreateSupplier }) {
    return this.suppliersService.create(locale, data);
  }

  @MessagePattern({ cmd: 'findAllSuppliers' })
  async findAll({ locale }: { locale: string }) {
    return await this.suppliersService.findAll(locale);
  }

  @MessagePattern({ cmd: 'findOneSupplier' })
  async findOne({ locale, id }: { locale: string; id: string }) {
    return await this.suppliersService.findOne(locale, id);
  }

  @MessagePattern({ cmd: 'updateSupplier' })
  update({ locale, id, data }: { locale: string; id: string; data: UpdateSupplier }) {
    return this.suppliersService.update(locale, id, data);
  }

  @MessagePattern({ cmd: 'removeSupplier' })
  remove({ locale, id }: { locale: string; id: string }) {
    return this.suppliersService.remove(locale, id);
  }
}
