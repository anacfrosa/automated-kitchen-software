import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Wastage } from './entities/wastage.entity';
import { Repository } from 'typeorm';
import { CreateWastage, ReadWastage } from './wastage.interface';
import { ShopsService } from '../shops/shops.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class WastageService {
  constructor(
    private readonly i18n: I18nService,
    private readonly shopsService: ShopsService,
    @InjectRepository(Wastage)
    private readonly wastageRepository: Repository<Wastage>,
    @Inject('PRODUCTS_SERVICE') private readonly productClient: ClientProxy,
  ) {}

  async create(locale: string, data: CreateWastage): Promise<any> {
    const language = { lang: locale };
    const wastageId = data.id;
    const shopId = data.shopId;

    try {
      // Get shop where is the ingredient inventory
      const shop = await this.shopsService.findOne(locale, shopId);

      if (!wastageId) {
        const wastage = this.wastageRepository.create({ id: wastageId, shop: shop, ...data });
        await this.wastageRepository.save(wastage);

        return { statusCode: HttpStatus.CREATED, message: this.i18n.t('messages.wastage.itemCreate', language) };
      } else {
        const wastageExists = await this.wastageRepository.findOneBy({ id: wastageId });
        if (wastageExists) {
          return {
            statusCode: HttpStatus.CONFLICT,
            message: this.i18n.t('messages.wastage.itemFound', { ...language, args: { id: wastageId } }),
          };
        }
        const wastage = this.wastageRepository.create({
          id: wastageId,
          shop: shop,
          ...data,
        });
        await this.wastageRepository.save(wastage);
        return { statusCode: HttpStatus.CREATED, message: this.i18n.t('messages.wastage.itemCreate', language) };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async findByShop(locale: string, shopId: string): Promise<any> {
    const language = { lang: locale };
    const wastageList: ReadWastage[] = [];

    try {
      // Get the wastages by shop id
      const wastages = await this.wastageRepository.find({
        where: { shop: { id: shopId } },
        relations: ['shop'],
      });

      //console.log(wastages);

      await Promise.all(
        wastages.map(async (item) => {
          const ingredientId: string = item.ingredientId;
          const ingredientInfo = await this.getIngredientInfo(locale, ingredientId);

          wastageList.push({
            id: item.id,
            shopId: shopId,
            ingredient: ingredientInfo,
            quantity: item.quantity,

            day: item.day,
            month: item.month,
            year: item.year,
          });
        }),
      );

      return wastageList;
    } catch (error) {
      console.error('Error find all wastages:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  /** Get ingredient information from PRODUCTS service */
  async getIngredientInfo(locale: string, ingredientId: string): Promise<any> {
    try {
      const ingredientInfo = await new Promise<any>((resolve, reject) => {
        this.productClient.send({ cmd: 'findOneIngredient' }, { id: ingredientId, locale: locale }).subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (err) => {
            reject(err);
          },
        });
      });
      return ingredientInfo;
    } catch (error) {
      console.error('Error getting ingredient information:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', { lang: locale }),
      };
    }
  }
}
