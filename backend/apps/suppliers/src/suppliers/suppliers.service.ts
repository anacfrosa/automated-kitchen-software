import { HttpStatus, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSupplier, UpdateSupplier } from './suppliers.interface';

@Injectable()
export class SuppliersService {
  constructor(
    private readonly i18n: I18nService,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async create(locale: string, data: CreateSupplier): Promise<any> {
    const language = { lang: locale };
    const supplierId = data.id;

    if (!supplierId) {
      console.log('Supplier id doesnt exist');
      // if supplier id doesnt exist
      const supplier = this.supplierRepository.create(data);
      console.log(supplier);
      await this.supplierRepository.save(supplier);

      return {
        statusCode: HttpStatus.CREATED,
        message: this.i18n.t('messages.suppliers.itemCreate', language),
      };
    } else {
      console.log('Supplier id exist');
      const isSupplierExists = await this.supplierRepository.findOneBy({ id: supplierId });
      if (isSupplierExists) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: this.i18n.t('messages.suppliers.itemFound', { ...language, args: { id: supplierId } }),
        };
      }

      const supplier = this.supplierRepository.create({ id: supplierId, ...data });
      await this.supplierRepository.save(supplier);
      return {
        statusCode: HttpStatus.CREATED,
        message: this.i18n.t('messages.suppliers.itemCreate', language),
      };
    }
  }

  async findAll(locale: string): Promise<any> {
    const language = { lang: locale };
    try {
      const suppliers = await this.supplierRepository.find();
      return suppliers;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async findOne(locale: string, supplierId: string): Promise<any> {
    const language = { lang: locale };

    // Find supplier
    try {
      // Check if supplier exists
      const isSupplierExists = await this.supplierRepository.findOneBy({ id: supplierId });

      if (!isSupplierExists) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: this.i18n.t('messages.suppliers.itemNotFound', { ...language, args: { id: supplierId } }),
        };
      }
      const supplier = await this.supplierRepository.findOneBy({ id: supplierId });
      return supplier;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async update(locale: string, supplierId: string, data: UpdateSupplier) {
    const language = { lang: locale };

    // Update supplier values
    try {
      // Check if supplier exists
      const isSupplierExists = await this.supplierRepository.findOneBy({ id: supplierId });
      if (!isSupplierExists) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: this.i18n.t('messages.supplier.itemNotFound', { ...language, args: { id: supplierId } }),
        };
      }
      await this.supplierRepository.update(supplierId, data);
      return { statusCode: HttpStatus.OK, message: this.i18n.t('messages.suppliers.itemUpdate', language) };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async remove(locale: string, supplierId: string) {
    const language = { lang: locale };

    // Delete supplier
    try {
      // Check if supplier exists
      const isSupplierExists = await this.supplierRepository.findOneBy({ id: supplierId });
      if (!isSupplierExists) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: this.i18n.t('messages.dispensers.itemNotFound', { ...language, args: { id: supplierId } }),
        };
      }
      await this.supplierRepository.delete(supplierId); // delete a supplier from the database
      return { statusCode: HttpStatus.OK, message: this.i18n.t('messages.suppliers.itemDelete', language) };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }
}
