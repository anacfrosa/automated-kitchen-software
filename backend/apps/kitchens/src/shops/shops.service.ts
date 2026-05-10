import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './entities/shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class ShopsService {
  constructor(
    private readonly i18n: I18nService,
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
  ) {}

  async create(locale: string, { shopId, name, status }: CreateShopDto): Promise<any> {
    // Check if the name already exists
    const isNameExists = await this.shopRepository.findOne({ where: { name } });
    if (isNameExists) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: this.i18n.t('messages.shops.nameFound', { lang: locale, args: { name: isNameExists.name } }),
      };
    }

    if (!shopId) {
      const shop = this.shopRepository.create({ name, status });
      await this.shopRepository.save(shop);

      return { statusCode: HttpStatus.CREATED, message: this.i18n.t('messages.shops.itemCreate', { lang: locale }) };
    } else {
      const isShopExists = await this.shopRepository.findOneBy({ id: shopId });
      if (isShopExists) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: this.i18n.t('messages.shops.itemFound', { lang: locale, args: { id: shopId } }),
        };
      }

      const shop = this.shopRepository.create({ id: shopId, name, status });
      await this.shopRepository.save(shop);
      return { statusCode: HttpStatus.CREATED, message: this.i18n.t('messages.shops.itemCreate', { lang: locale }) };
    }
  }

  async findAll(locale: string): Promise<any> {
    // Get all shops
    try {
      const shops = await this.shopRepository.find();
      return shops;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', { lang: locale }),
      };
    }
  }

  async findOne(locale: string, shopId: string): Promise<any> {
    const language = { lang: locale };

    // Check if shop exists
    const isShopExists = await this.shopRepository.findOneBy({ id: shopId });

    if (!isShopExists) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: this.i18n.t('messages.shops.itemNotFound', { ...language, args: { id: shopId } }),
      };
    }

    // Find shop
    try {
      const shop = await this.shopRepository.findOneBy({ id: shopId });
      return shop;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async update(locale: string, shopId: string, { name, status }: UpdateShopDto): Promise<any> {
    const language = { lang: locale };
    // Check if shop exists
    const isShopExists = await this.shopRepository.findOneBy({ id: shopId });
    if (!isShopExists) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: this.i18n.t('messages.shops.itemNotFound', { ...language, args: { id: shopId } }),
      };
    }
    // Update shop values
    try {
      await this.shopRepository.update(shopId, { name, status });
      return { statusCode: HttpStatus.OK, message: this.i18n.t('messages.shops.itemUpdate', language) };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async remove(locale: string, shopId: string): Promise<any> {
    const language = { lang: locale };

    // Check if shop exists
    const isShopExists = await this.shopRepository.findOneBy({ id: shopId });
    if (!isShopExists) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: this.i18n.t('messages.shops.itemNotFound', { ...language, args: { id: shopId } }),
      };
    }

    // Delete shop
    try {
      await this.shopRepository.delete(shopId); // delete a shop from the database
      return { statusCode: HttpStatus.OK, message: this.i18n.t('messages.shops.itemDelete', language) };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }
}
