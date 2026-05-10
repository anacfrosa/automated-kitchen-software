import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  CreatePurchase,
  ReadPurchase,
  ReadPurchaseItem,
  UpdatePurchase,
  UpdatePurchaseItem,
} from './purchases.interface';
import { I18nService } from 'nestjs-i18n';
import { Purchase } from './entities/purchase.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SuppliersService } from '../suppliers/suppliers.service';
import { ClientProxy } from '@nestjs/microservices';
import { PurchaseItem } from './entities/purchase-item.entity';

@Injectable()
export class PurchasesService {
  constructor(
    private readonly i18n: I18nService,
    private readonly suppliersService: SuppliersService,
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    @InjectRepository(PurchaseItem)
    private readonly purchaseItemRepository: Repository<PurchaseItem>,
    @Inject('PRODUCTS_SERVICE') private readonly productClient: ClientProxy,
  ) {}

  async create(locale: string, data: CreatePurchase): Promise<any> {
    const language = { lang: locale };
    const { id, supplierId, purchaseItems, ...purchaseData } = data;
    const purchaseId: string = id;

    try {
      // Get supplier info
      const supplier = await this.suppliersService.findOne(locale, supplierId);

      if (!purchaseId) {
        // if purchase id does not exist
        const purchase = await this.purchaseRepository.save(
          this.purchaseRepository.create({ supplier: supplier, ...purchaseData }),
        );

        await Promise.all(
          purchaseItems.map(async (item) => {
            const purchaseItem = this.purchaseItemRepository.create({ purchase, ...item });
            await this.purchaseItemRepository.save(purchaseItem);
          }),
        );

        return {
          statusCode: HttpStatus.CREATED,
          message: this.i18n.t('messages.purchases.itemCreate', language),
        };
      } else {
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
    const purchasesList: ReadPurchase[] = [];

    try {
      const purchases = await this.purchaseRepository.find({
        where: { shopId: shopId },
        relations: ['supplier', 'purchaseItems'],
      });

      await Promise.all(
        purchases.map(async (purchase) => {
          let purchaseItemsList: ReadPurchaseItem[] = [];

          await Promise.all(
            purchase.purchaseItems.map(async (item) => {
              const ingredientId: string = item.ingredientId;
              const ingredientInfo = await this.getIngredientInfo(locale, ingredientId);

              purchaseItemsList.push({
                id: item.id,
                ingredient: ingredientInfo,
                quantity: item.quantity,
                measureUnit: item.measureUnit,
                unitPrice: item.unitPrice,
                cost: item.cost,
                isAccepted: item.isAccepted,
              });
            }),
          );

          purchasesList.push({
            ...purchase,
            purchaseItems: purchaseItemsList,
          });
        }),
      );

      return purchasesList;
    } catch (error) {
      console.error('Error find all receptions:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async findOne(locale: string, purchaseId: string): Promise<any> {
    const language = { lang: locale };
    const purchaseItemsList: ReadPurchaseItem[] = [];

    try {
      // Check if purchase exists
      const isPurchaseExists = await this.purchaseRepository.findOneBy({ id: purchaseId });
      if (!isPurchaseExists) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: this.i18n.t('messages.purchases.itemNotFound', { ...language, args: { id: purchaseId } }),
        };
      }

      const purchase = await this.purchaseRepository.findOne({
        where: { id: purchaseId },
        relations: ['supplier', 'purchaseItems'],
      });

      await Promise.all(
        purchase.purchaseItems.map(async (item: PurchaseItem) => {
          const ingredientId: string = item.ingredientId;
          const ingredientInfo = await this.getIngredientInfo(locale, ingredientId);

          purchaseItemsList.push({
            id: item.id,
            ingredient: ingredientInfo,
            quantity: item.quantity,
            measureUnit: item.measureUnit,
            unitPrice: item.unitPrice,
            cost: item.cost,
            isAccepted: item.isAccepted,
          });
        }),
      );

      return {
        ...purchase,
        purchaseItems: purchaseItemsList,
      };
    } catch (error) {
      console.error('Error find one reception:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async findPurchaseItem(locale: string, itemId: string): Promise<any> {
    const language = { lang: locale };
    try {
      // Check if purchase item exists
      const isPurchaseItemExists = await this.purchaseItemRepository.findOneBy({ id: itemId });
      if (!isPurchaseItemExists) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: this.i18n.t('messages.purchases.itemNotFound', { ...language, args: { id: isPurchaseItemExists } }),
        };
      }

      // Get purchase item info from purchase item table
      const purchaseItem = await this.purchaseItemRepository.findOne({
        where: { id: itemId },
        relations: ['purchase'],
      });

      // Get supplier name from purchase table
      const purchase = await this.purchaseRepository.findOne({
        where: { id: purchaseItem.purchase.id },
        relations: ['supplier'],
      });

      const ingredientId: string = purchaseItem.ingredientId;
      const ingredientInfo = await this.getIngredientInfo(locale, ingredientId);

      return {
        id: purchaseItem.id,
        supplier: purchase.supplier.name,
        receptionDate: purchaseItem.purchase.receptionDate,
        ingredient: ingredientInfo,
        quantity: purchaseItem.quantity,
        measureUnit: purchaseItem.measureUnit,
        unitPrice: purchaseItem.unitPrice,
        cost: purchaseItem.cost,
        isAccepted: purchaseItem.isAccepted,
      };
    } catch (error) {
      console.error('Error find purchase item:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async updatePurchase(locale: string, purchaseId: string, data: UpdatePurchase) {
    const language = { lang: locale };

    // Update purchase values
    try {
      // Check if purchase exists
      const isPurchaseExists = await this.purchaseRepository.findOneBy({ id: purchaseId });
      if (!isPurchaseExists) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: this.i18n.t('messages.purchases.itemNotFound', { ...language, args: { id: purchaseId } }),
        };
      }
      await this.purchaseRepository.update(purchaseId, data);
      return { statusCode: HttpStatus.OK, message: this.i18n.t('messages.purchases.itemUpdate', language) };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async updatePurchaseItem(locale: string, purchaseId: string, itemId: string, data: UpdatePurchaseItem) {
    const language = { lang: locale };

    // Update purchase item values
    try {
      // Check if purchase and purchase Item exists
      const isPurchaseItemExists = await this.purchaseItemRepository.findOneBy({
        id: itemId,
        purchase: { id: purchaseId },
      });
      if (!isPurchaseItemExists) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: this.i18n.t('messages.purchases.itemNotFound', { ...language, args: { id: itemId } }),
        };
      }

      await this.purchaseItemRepository.update(itemId, data);
      return { statusCode: HttpStatus.OK, message: this.i18n.t('messages.purchases.itemUpdate', language) };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  // remove(id: number) {
  //   return `This action removes a #${id} purchase`;
  // }

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
