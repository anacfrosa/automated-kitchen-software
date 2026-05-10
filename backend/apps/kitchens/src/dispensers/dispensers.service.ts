import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dispenser } from './entities/dispenser.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { ShopsService } from '../shops/shops.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreateDispenser, ReadDispenser, UpdateDispenser } from './dispensers.interface';
import { convertToKG, convertToStandardUnit, getCurrentQty, getStandardUnit } from '../utils/common';
import { InitMeasureUnit, StandardMeasureUnit } from '@wac/shared/enums/measure-unit.enum';
import { StorageLocation } from '@wac/shared/enums/storage-location';
import { Inventory } from '../inventory/entities/inventory.entity';
import { InventoryService } from '../inventory/inventory.service';
import { ReadIngredient } from 'apps/products/src/ingredients/ingredients.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class DispensersService {
  constructor(
    private readonly i18n: I18nService,
    private readonly shopsService: ShopsService,
    private readonly inventoryService: InventoryService,
    @InjectRepository(Dispenser)
    private readonly dispenserRepository: Repository<Dispenser>,
    @Inject('PRODUCTS_SERVICE') private readonly productClient: ClientProxy,
    @Inject('NOTIFICATIONS_SERVICE') private readonly notifClient: ClientProxy,
  ) {}

  async create(locale: string, data: CreateDispenser): Promise<any> {
    const language = { lang: locale };
    const dispenserId = data.id;
    const shopId = data.shopId;

    try {
      // Get shop where is the dispenser
      const shop = await this.shopsService.findOne(locale, shopId);

      if (!dispenserId) {
        const dispenser = this.dispenserRepository.create({ id: dispenserId, shop: shop, ...data });
        await this.dispenserRepository.save(dispenser);

        return { statusCode: HttpStatus.CREATED, message: this.i18n.t('messages.dispensers.itemCreate', language) };
      } else {
        const isDispenserExists = await this.dispenserRepository.findOneBy({ id: dispenserId });
        if (isDispenserExists) {
          return {
            statusCode: HttpStatus.CONFLICT,
            message: this.i18n.t('messages.dispensers.itemFound', { ...language, args: { id: dispenserId } }),
          };
        }
        const dispenser = this.dispenserRepository.create({
          id: dispenserId,
          shop: shop,
          ...data,
        });
        await this.dispenserRepository.save(dispenser);
        return { statusCode: HttpStatus.CREATED, message: this.i18n.t('messages.dispensers.itemCreate', language) };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async findByShopId(locale: string, shopId: string): Promise<any> {
    const language = { lang: locale };
    const dispenserList: ReadDispenser[] = [];
    let currentQuantity: number = 0;

    try {
      // Get all dispensers that belong to shopId
      const dispensers = await this.dispenserRepository.find({
        where: { shop: { id: shopId } },
        relations: ['shop', 'inventories'],
      });

      await Promise.all(
        dispensers.map(async (dispenser) => {
          const ingredientId: string = dispenser.ingredientId;
          let ingredientInfo = ingredientId;
          if (ingredientId != null) {
            ingredientInfo = await this.getIngredientInfo(locale, ingredientId);
          }

          currentQuantity =
            Number(convertToStandardUnit(dispenser.initQuantity, dispenser.initMeasureUnit)) + // convert to standard unit
            Number(dispenser.quantityIn) -
            Number(dispenser.quantityOut);

          dispenserList.push({
            id: dispenser.id,
            number: dispenser.number,
            initQuantity: {
              quantity: dispenser.initQuantity,
              measureUnit: dispenser.initMeasureUnit,
            },
            quantity: {
              in: dispenser.quantityIn,
              out: dispenser.quantityOut,
              current: parseFloat(currentQuantity.toFixed(3)),
              measureUnit: dispenser.measureUnit, // Keep Standard Unit
            },
            fillDate: dispenser.fillDate,
            expiryDate: dispenser.expiryDate,
            volume: dispenser.volume,
            storage: dispenser.storage,
            isFree: dispenser.isFree,
            ingredientId: ingredientInfo,
            inventories: dispenser.inventories,
          });
        }),
      );

      // Sort dispenserList by number
      dispenserList.sort((a, b) => a.number - b.number);

      return dispenserList;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async findByShopAndIngredient(locale: string, shopId: string, ingredientId: string): Promise<any> {
    const language = { lang: locale };
    const dispenserList: ReadDispenser[] = [];
    let currentQuantity: number = 0;

    try {
      // Get all dispensers that belong to shopId and by ingredient
      const dispensers = await this.dispenserRepository.find({
        where: { shop: { id: shopId }, ingredientId: ingredientId },
        relations: ['shop', 'inventories'],
      });
      await Promise.all(
        dispensers.map(async (dispenser) => {
          const ingredientId: string = dispenser.ingredientId;
          let ingredientInfo = ingredientId;
          if (ingredientId != null) {
            ingredientInfo = await this.getIngredientInfo(locale, ingredientId);
          }

          currentQuantity =
            Number(convertToStandardUnit(dispenser.initQuantity, dispenser.initMeasureUnit)) + // convert to standard unit
            Number(dispenser.quantityIn) -
            Number(dispenser.quantityOut);

          dispenserList.push({
            id: dispenser.id,
            number: dispenser.number,
            initQuantity: {
              quantity: dispenser.initQuantity,
              measureUnit: dispenser.initMeasureUnit,
            },
            quantity: {
              in: dispenser.quantityIn,
              out: dispenser.quantityOut,
              current: parseFloat(currentQuantity.toFixed(3)),
              measureUnit: dispenser.measureUnit, // Keep Standard Unit
            },
            fillDate: dispenser.fillDate,
            expiryDate: dispenser.expiryDate,
            volume: dispenser.volume,
            storage: dispenser.storage,
            isFree: dispenser.isFree,
            ingredientId: ingredientInfo,
            inventories: dispenser.inventories,
          });
        }),
      );

      // Sort dispenserList by number
      dispenserList.sort((a, b) => a.number - b.number);

      return dispenserList;
    } catch (error) {
      console.error('Error find dispensers by shop and ingredient :', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async findByShopAndStorage(locale: string, shopId: string, storage: StorageLocation): Promise<any> {
    const language = { lang: locale };
    const storageLocation = storage;
    const dispenserList: ReadDispenser[] = [];
    let currentQuantity: number = 0;

    try {
      // Get all dispensers that belong to shopId and that are stored in the
      // room temperature (dry storage)
      const dispensers = await this.dispenserRepository.find({
        where: { shop: { id: shopId }, storage: storageLocation },
        relations: ['shop', 'inventories'],
      });

      await Promise.all(
        dispensers.map(async (dispenser) => {
          const ingredientId: string = dispenser.ingredientId;
          let ingredientInfo = ingredientId;
          if (ingredientId != null) {
            ingredientInfo = await this.getIngredientInfo(locale, ingredientId);
          }

          currentQuantity =
            Number(convertToStandardUnit(dispenser.initQuantity, dispenser.initMeasureUnit)) + // convert to standard unit
            Number(dispenser.quantityIn) -
            Number(dispenser.quantityOut);

          dispenserList.push({
            id: dispenser.id,
            number: dispenser.number,
            initQuantity: {
              quantity: dispenser.initQuantity,
              measureUnit: dispenser.initMeasureUnit,
            },
            quantity: {
              in: dispenser.quantityIn,
              out: dispenser.quantityOut,
              current: parseFloat(currentQuantity.toFixed(3)),
              measureUnit: dispenser.measureUnit, // Keep Standard Unit
            },
            fillDate: dispenser.fillDate,
            expiryDate: dispenser.expiryDate,
            volume: dispenser.volume,
            storage: dispenser.storage,
            isFree: dispenser.isFree,
            ingredientId: ingredientInfo,
            inventories: dispenser.inventories,
          });
        }),
      );

      // Sort dispenserList by number
      dispenserList.sort((a, b) => a.number - b.number);

      return dispenserList;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async findOne(locale: string, dispenserId: string): Promise<any> {
    const language = { lang: locale };
    let currentQuantity: number = 0;
    console.log('\n Find Dispenser by id: ', dispenserId);
    try {
      // Check if dispenser exists
      const isDispenserExists = await this.dispenserRepository.findOneBy({ id: dispenserId });
      if (!isDispenserExists) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: this.i18n.t('messages.dispensers.itemNotFound', { ...language, args: { id: dispenserId } }),
        };
      }

      console.log(isDispenserExists);

      const dispenser = await this.dispenserRepository.findOne({
        where: { id: dispenserId },
        relations: ['shop', 'inventories'],
      });

      console.log(dispenser);

      currentQuantity =
        Number(convertToStandardUnit(dispenser.initQuantity, dispenser.initMeasureUnit)) + // convert to standard unit
        Number(dispenser.quantityIn) -
        Number(dispenser.quantityOut);

      const ingredientId = dispenser.ingredientId;
      const ingredientInfo: ReadIngredient | null = dispenser.isFree
        ? null
        : await this.getIngredientInfo(locale, ingredientId);

      return {
        id: dispenser.id,
        number: dispenser.number,
        initQuantity: {
          quantity: dispenser.initQuantity,
          measureUnit: dispenser.initMeasureUnit,
        },
        quantity: {
          in: dispenser.quantityIn,
          out: dispenser.quantityOut,
          current: parseFloat(currentQuantity.toFixed(3)),
          measureUnit: dispenser.measureUnit, // Keep Standard Unit
        },
        fillDate: dispenser.fillDate,
        expiryDate: dispenser.expiryDate,
        volume: dispenser.volume,
        storage: dispenser.storage,
        isFree: dispenser.isFree,
        shopId: dispenser.shop.id,
        ingredientId: ingredientInfo,
        inventories: dispenser.inventories,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async findLotsInDispenser(locale: string, dispenserId: string): Promise<any> {
    const language = { lang: locale };
    const foundedLots = [];

    try {
      // Check if dispenser exists
      const dispenser = await this.dispenserRepository.findOne({
        where: { id: dispenserId },
        relations: ['inventories'],
      });
      if (!dispenser) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: this.i18n.t('messages.dispensers.itemNotFound', { ...language, args: { id: dispenserId } }),
        };
      }

      for (const inventory of dispenser.inventories) {
        const currentQuantity =
          Number(convertToStandardUnit(inventory.initQuantity, inventory.initMeasureUnit)) + // convert to standard unit
          Number(inventory.quantityIn) -
          Number(inventory.quantityOut);
        foundedLots.push({
          inventoryId: inventory.id,
          lotNumber: inventory.lotNumber,
          currentQty: currentQuantity, // kg
        });
      }

      return foundedLots;
    } catch (error) {
      console.error('Error finding lots in dispenser', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async updateFreeDispenser(locale: string, dispenserId: string) {
    const language = { lang: locale };

    // Clen Dispenser
    try {
      // Check if dispenser exists
      const dispenser = await this.dispenserRepository.findOne({
        where: { id: dispenserId },
        relations: ['inventories', 'shop'],
      });
      if (!dispenser) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: this.i18n.t('messages.dispensers.itemNotFound', { ...language, args: { id: dispenserId } }),
        };
      }

      // Remove inventory from DB if has 0 quantity and isnt in a dispenser
      // if (dispenser.inventories.length !== 0) {
      //   for (const inv of dispenser.inventories) {
      //     const currentQty: Number = getCurrentQty(inv);
      //     if (currentQty === 0) {
      //       this.inventoryService.remove(locale, inv.id);
      //     }
      //   }
      // }

      // Reset dispenser properties
      Object.assign(dispenser, {
        initQuantity: 0,
        initMeasureUnit: InitMeasureUnit.Kg,
        quantityIn: 0,
        quantityOut: 0,
        measureUnit: StandardMeasureUnit.Kg,
        fillDate: null,
        expiryDate: null,
        isFree: true,
        ingredientId: null,
        inventories: [], // Clear inventories relationship
      });

      // Save the updated dispenser entity
      await this.dispenserRepository.save(dispenser);

      await this.sendNoticeToSupplyNotf(locale, dispenser.shop.id);

      return { statusCode: HttpStatus.OK, message: this.i18n.t('messages.dispensers.itemUpdate', language) };
    } catch (error) {
      console.error('Error updating dispenser', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async updateFillDispenser(locale: string, dispenserId: string, data: UpdateDispenser) {
    const language = { lang: locale };
    let inventoryList: Inventory[] = [];
    let shelfLife: number = 0;
    let expiryDate: Date;
    const fillDate = new Date();
    const currentHour = fillDate.getHours();
    fillDate.setHours(currentHour + 1);

    console.log('\n ----------- Update Fill Dispenser ----------- \n');

    // Fill Dispenser with one or more lots
    try {
      // Check if dispenser exists
      const dispenser = await this.dispenserRepository.findOne({
        where: { id: dispenserId },
        relations: ['inventories', 'shop'],
      });
      if (!dispenser) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: this.i18n.t('messages.dispensers.itemNotFound', { ...language, args: { id: dispenserId } }),
        };
      }

      // Get ingredient shelf life
      const ingredientInfo = await this.getIngredientInfo(locale, data.ingredientId);
      if (ingredientInfo != undefined) shelfLife = ingredientInfo.shelfLife;
      //console.log('\n shelfLife: ', shelfLife, '\n');

      // Get inventory entities and update relationship
      for (const id of data.inventories) {
        const inventoryId: string = id;
        if (inventoryId) {
          const inventoryInfo = await this.inventoryService.findOne(locale, inventoryId);
          if (inventoryInfo) {
            inventoryList.push(inventoryInfo);
          }
        }
      }

      // Sorting the list by expiryDate in ascending order (- to +)
      inventoryList.sort((a, b) => {
        const dateA = new Date(a.expiryDate);
        const dateB = new Date(b.expiryDate);
        return dateA.getTime() - dateB.getTime();
      });

      if (shelfLife == 0) {
        expiryDate = inventoryList[0].expiryDate;
      } else {
        const primaryExpiryDate: Date = new Date(inventoryList[0].expiryDate);
        //console.log('\n primaryExpiryDate: ', primaryExpiryDate);

        // Create a new date for secondary expiry date
        const secExpiryDate = new Date();
        secExpiryDate.setDate(secExpiryDate.getDate() + Number(shelfLife));
        //console.log('secExpiryDate: ', secExpiryDate, '\n');

        // Compare dates and assign the correct expiry date
        if (secExpiryDate < primaryExpiryDate) {
          expiryDate = secExpiryDate;
        } else {
          expiryDate = primaryExpiryDate;
        }

        // Ensure expiryDate is a Date object
        const expiryDateObj = new Date(expiryDate);
        // Add one hour to the expiry date
        //expiryDateObj.setHours(expiryDateObj.getHours() + 1);
        expiryDate = expiryDateObj;
      }

      //console.log('\n Secondary Expiry Date: ', expiryDate, '\n');

      // console.log('Update Fill Dispenser - expiryDate: ', data.expiryDate);
      Object.assign(dispenser, {
        initQuantity: data.initQuantity,
        initMeasureUnit: data.initMeasureUnit,
        fillDate: fillDate,
        expiryDate: expiryDate,
        isFree: data.isFree,
        ingredientId: data.ingredientId,
        inventories: inventoryList,
      });

      //console.log(dispenser);

      // Save the updated dispenser entity
      await this.dispenserRepository.save(dispenser);

      console.log('\nGenerate new supply suggestions: ', 'Fill Dispenser');
      const notificationResult = await this.sendNoticeToSupplyNotf(locale, dispenser.shop.id);
      console.log(notificationResult);

      return { statusCode: HttpStatus.OK, message: this.i18n.t('messages.dispensers.itemUpdate', language) };
    } catch (error) {
      console.error('Error updating dispenser', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async updateRefillDispenser(locale: string, dispenserId: string, data: UpdateDispenser) {
    const language = { lang: locale };
    const fillDate = new Date();
    const currentHour = fillDate.getHours();
    fillDate.setHours(currentHour + 1);

    // Refill Dispenser with one lot !!!!
    try {
      // Check if dispenser exists
      const dispenser = await this.dispenserRepository.findOne({
        where: { id: dispenserId },
        relations: ['shop'],
      });
      if (!dispenser) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: this.i18n.t('messages.dispensers.itemNotFound', { ...language, args: { id: dispenserId } }),
        };
      }

      Object.assign(dispenser, {
        quantityIn: Number(dispenser.quantityIn) + Number(data.quantityIn),
        measureUnit: data.measureUnit,
        fillDate: fillDate,
      });

      // Save the updated dispenser entity
      await this.dispenserRepository.save(dispenser);

      console.log('\nGenerate new supply suggestions: ', 'Refill Dispenser');
      const notificationResult = await this.sendNoticeToSupplyNotf(locale, dispenser.shop.id);
      console.log(notificationResult);

      return { statusCode: HttpStatus.OK, message: this.i18n.t('messages.dispensers.itemUpdate', language) };
    } catch (error) {
      console.error('Error updating dispenser', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async remove(locale: string, dispenserId: string) {
    const language = { lang: locale };

    // Check if dispenser exists
    const isDispenserExists = await this.dispenserRepository.findOneBy({ id: dispenserId });
    if (!isDispenserExists) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: this.i18n.t('messages.dispensers.itemNotFound', { ...language, args: { id: dispenserId } }),
      };
    }

    // Delete dispenser
    try {
      await this.dispenserRepository.delete(dispenserId); // delete a dispenser from the database
      return { statusCode: HttpStatus.OK, message: this.i18n.t('messages.dispensers.itemDelete', language) };
    } catch (error) {
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

  /** Send notice to supply notifications to update */
  async sendNoticeToSupplyNotf(locale: string, id: string): Promise<any> {
    try {
      // convert the Observable to a Promise with lastValueFrom
      const res = await lastValueFrom(this.notifClient.send({ cmd: 'generateNotifByShop' }, { locale, id }));
      return res;
    } catch (error) {
      console.error('Error sending notice to notifications:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', { lang: locale }),
      };
    }
  }
}
