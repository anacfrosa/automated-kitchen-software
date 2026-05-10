import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Inventory } from './entities/inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateInventory,
  PurchaseInfo,
  ReadInventory,
  ReadInventoryByShop,
  UpdateInventory,
} from './inventory.interface';
import { ShopsService } from '../shops/shops.service';
import { ClientProxy } from '@nestjs/microservices';
import { calculateDaysUntilExpiryDate, convertToStandardUnit } from '../utils/common';
import { ReadDispenser } from '../dispensers/dispensers.interface';
import { StorageLocation } from '@wac/shared/enums/storage-location';
import { PurchaseItemInfo } from 'apps/suppliers/src/purchases/purchases.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class InventoryService {
  constructor(
    private readonly i18n: I18nService,
    private readonly shopsService: ShopsService,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @Inject('PRODUCTS_SERVICE') private readonly productClient: ClientProxy,
    @Inject('SUPPLIERS_SERVICE') private readonly supplierClient: ClientProxy,
    @Inject('NOTIFICATIONS_SERVICE') private readonly notifClient: ClientProxy,
  ) {}

  async create(locale: string, data: CreateInventory): Promise<any> {
    const language = { lang: locale };
    const inventoryId = data.id;
    const shopId = data.shopId;
    const lotNumber = data.lotNumber;

    console.log('\nCreate Inventory: ', data);

    //console.log('expiryDate: ', data.expiryDate);
    const daysUntilExpiry = calculateDaysUntilExpiryDate(data.expiryDate);
    // console.log('daysUntilExpiry: ', daysUntilExpiry);
    // console.log(daysUntilExpiry > 45 ? StorageLocation.Dry : StorageLocation.Fridge);

    try {
      // Check if ingredient lot number already exists
      console.log('\nCheck if lot number already exists. \n');
      const lotExists = await this.inventoryRepository.findOne({
        where: { lotNumber: lotNumber },
      });

      if (lotExists !== null) {
        console.log('\n Lot number already exists ! \n');
        const newPurchasedItemIds: string[] = lotExists.purchaseItemsId;
        newPurchasedItemIds.push(data.purchaseItemId);
        Object.assign(lotExists, {
          quantityIn:
            Number(lotExists.quantityIn) + Number(convertToStandardUnit(data.initQuantity, data.initMeasureUnit)),
          purchaseItemsId: newPurchasedItemIds,
        });
        // Save the updated inventory entity
        await this.inventoryRepository.save(lotExists);

        return { statusCode: HttpStatus.CREATED, message: this.i18n.t('messages.inventory.itemUpdate', language) };
      }
      console.log('\n Lot number doenst exists !! \n');

      // Get shop where is the ingredient inventory
      const shop = await this.shopsService.findOne(locale, shopId);

      if (!inventoryId) {
        const inventory = this.inventoryRepository.create({
          id: inventoryId,
          shop: shop,
          storage: daysUntilExpiry > 45 ? StorageLocation.DRY : StorageLocation.FRIDGE,
          purchaseItemsId: [data.purchaseItemId],
          lotNumber: lotNumber,
          ...data,
        });
        await this.inventoryRepository.save(inventory);

        return { statusCode: HttpStatus.CREATED, message: this.i18n.t('messages.inventory.itemCreate', language) };
      } else {
        const inventoryExists = await this.inventoryRepository.findOneBy({ id: inventoryId });
        if (inventoryExists) {
          return {
            statusCode: HttpStatus.CONFLICT,
            message: this.i18n.t('messages.inventory.itemFound', { ...language, args: { id: inventoryId } }),
          };
        }
        const inventory = this.inventoryRepository.create({
          id: inventoryId,
          shop: shop,
          storage: daysUntilExpiry > 45 ? StorageLocation.DRY : StorageLocation.FRIDGE,
          purchaseItemsId: [data.purchaseItemId],
          lotNumber: lotNumber,
          ...data,
        });

        await this.inventoryRepository.save(inventory);

        return { statusCode: HttpStatus.CREATED, message: this.i18n.t('messages.inventory.itemCreate', language) };
      }
    } catch (error) {
      console.log('Error adding a new inventory: ', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async findAll(locale: string): Promise<any> {
    const language = { lang: locale };
    const inventoryList: ReadInventory[] = [];
    let currentQuantity: number = 0;

    try {
      // Get all the inventory of ingredients
      const inventory = await this.inventoryRepository.find({
        relations: ['shop', 'dispensers'],
      });

      await Promise.all(
        inventory.map(async (item) => {
          const purchasedItemIds: string[] = item.purchaseItemsId;
          const purchasedItems: PurchaseInfo[] = [];
          for (const id of purchasedItemIds) {
            const purchaseItemInfo = await this.getPurchaseItemInfo(locale, id);
            purchasedItems.push(purchaseItemInfo);
          }

          // Sorting the list by expiryDate in ascending order
          purchasedItems.sort((a, b) => {
            const dateA = new Date(a.receptionDate);
            const dateB = new Date(b.receptionDate);
            return dateB.getTime() - dateA.getTime();
          });

          currentQuantity =
            Number(convertToStandardUnit(item.initQuantity, item.initMeasureUnit)) + // convert to standard unit
            Number(item.quantityIn) -
            Number(item.quantityOut);

          inventoryList.push({
            id: item.id,
            initQuantity: {
              quantity: item.initQuantity,
              measureUnit: item.initMeasureUnit,
            },
            quantity: {
              in: item.quantityIn,
              out: item.quantityOut,
              current: parseFloat(currentQuantity.toFixed(3)),
              measureUnit: item.measureUnit, // Keep Standard Unit
            },
            lotNumber: item.lotNumber,
            expiryDate: item.expiryDate,
            storage: item.storage,
            shopId: item.shop.id,
            purchaseInfo: {
              ids: purchasedItemIds,
              supplier: purchasedItems[0].supplier,
              receptionDate: purchasedItems[0].receptionDate,
              ingredient: purchasedItems[0].ingredient,
            },
          });
        }),
      );

      return inventoryList;
    } catch (error) {
      console.error('Error find all inventory:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async findByShop(locale: string, shopId: string): Promise<any> {
    const language = { lang: locale };
    const inventoryList: ReadInventoryByShop[] = [];
    let currentQuantity: number = 0;

    try {
      // Get all the ingredient inventory that belongs to shopId
      const inventory = await this.inventoryRepository.find({
        where: { shop: { id: shopId } },
        relations: ['shop', 'dispensers'],
      });

      await Promise.all(
        inventory.map(async (item) => {
          const purchasedItemIds: string[] = item.purchaseItemsId;
          const purchasedItems: PurchaseInfo[] = [];
          for (const id of purchasedItemIds) {
            const purchaseItemInfo = await this.getPurchaseItemInfo(locale, id);
            purchasedItems.push(purchaseItemInfo);
          }

          // Sorting the list by expiryDate in ascending order
          purchasedItems.sort((a, b) => {
            const dateA = new Date(a.receptionDate);
            const dateB = new Date(b.receptionDate);
            return dateB.getTime() - dateA.getTime();
          });

          currentQuantity =
            Number(convertToStandardUnit(item.initQuantity, item.initMeasureUnit)) + // convert to standard unit
            Number(item.quantityIn) -
            Number(item.quantityOut);

          inventoryList.push({
            id: item.id,
            initQuantity: {
              quantity: item.initQuantity,
              measureUnit: item.initMeasureUnit,
            },
            quantity: {
              in: item.quantityIn,
              out: item.quantityOut,
              current: parseFloat(currentQuantity.toFixed(3)),
              measureUnit: item.measureUnit, // Keep Standard Unit
            },
            lotNumber: item.lotNumber,
            expiryDate: item.expiryDate,
            storage: item.storage,
            shopId: item.shop.id,
            purchaseInfo: {
              ids: purchasedItemIds,
              supplier: purchasedItems[0].supplier,
              receptionDate: purchasedItems[0].receptionDate,
              ingredient: purchasedItems[0].ingredient,
            },
          });
        }),
      );

      //Sort inventoryList by ingredient.name
      inventoryList.sort((a, b) => a.purchaseInfo.ingredient.name.localeCompare(b.purchaseInfo.ingredient.name));

      return inventoryList;
    } catch (error) {
      console.error('Error find all inventory by shop id:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async findByShopAndIngredient(locale: string, shopId: string, ingredientId: string): Promise<any> {
    const language = { lang: locale };
    const inventoryList: ReadInventoryByShop[] = [];
    let currentQuantity: number = 0;

    try {
      // Get all the ingredient inventory that belongs to shopId
      const inventory = await this.inventoryRepository.find({
        where: { shop: { id: shopId } },
        relations: ['shop', 'dispensers'],
      });

      await Promise.all(
        inventory.map(async (item) => {
          const purchasedItemIds: string[] = item.purchaseItemsId;
          const purchasedItems: PurchaseInfo[] = [];
          for (const id of purchasedItemIds) {
            const purchaseItemInfo = await this.getPurchaseItemInfo(locale, id);
            purchasedItems.push(purchaseItemInfo);
          }

          // Sorting the list by expiryDate in ascending order
          purchasedItems.sort((a, b) => {
            const dateA = new Date(a.receptionDate);
            const dateB = new Date(b.receptionDate);
            return dateB.getTime() - dateA.getTime();
          });

          currentQuantity =
            Number(convertToStandardUnit(item.initQuantity, item.initMeasureUnit)) + // convert to standard unit
            Number(item.quantityIn) -
            Number(item.quantityOut);

          if (ingredientId === purchasedItems[0].ingredient.id) {
            inventoryList.push({
              id: item.id,
              initQuantity: {
                quantity: item.initQuantity,
                measureUnit: item.initMeasureUnit,
              },
              quantity: {
                in: item.quantityIn,
                out: item.quantityOut,
                current: parseFloat(currentQuantity.toFixed(3)),
                measureUnit: item.measureUnit, // Keep Standard Unit
              },
              lotNumber: item.lotNumber,
              expiryDate: item.expiryDate,
              storage: item.storage,
              shopId: item.shop.id,
              purchaseInfo: {
                ids: purchasedItemIds,
                supplier: purchasedItems[0].supplier,
                receptionDate: purchasedItems[0].receptionDate,
                ingredient: purchasedItems[0].ingredient,
              },
            });
          }
        }),
      );

      // Sorting the list by expiryDate in ascending order
      inventoryList.sort((a, b) => {
        const dateA = new Date(a.expiryDate);
        const dateB = new Date(b.expiryDate);
        return dateA.getTime() - dateB.getTime();
      });

      return inventoryList;
    } catch (error) {
      console.error('Error find all inventory by shop id and ingredient id:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async findOne(locale: string, inventoryId: string): Promise<any> {
    const language = { lang: locale };
    const dispensersList: ReadDispenser[] = [];
    let currentQuantity: number = 0;

    try {
      // Check if ingredient inventory exists
      const inventoryExists = await this.inventoryRepository.findOneBy({ id: inventoryId });
      if (!inventoryExists) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: this.i18n.t('messages.inventory.itemNotFound', { ...language, args: { id: inventoryId } }),
        };
      }

      const inventory = await this.inventoryRepository.findOne({
        where: { id: inventoryId },
        relations: ['shop', 'dispensers'],
      });

      const purchasedItemIds: string[] = inventory.purchaseItemsId;
      const purchasedItems: PurchaseItemInfo[] = [];
      for (const id of purchasedItemIds) {
        const purchaseItemInfo = await this.getPurchaseItemInfo(locale, id);
        purchasedItems.push(purchaseItemInfo);
      }

      // Sorting the list by expiryDate in ascending order
      purchasedItems.sort((a, b) => {
        const dateA = new Date(a.receptionDate);
        const dateB = new Date(b.receptionDate);
        return dateB.getTime() - dateA.getTime();
      });
      currentQuantity =
        Number(convertToStandardUnit(inventory.initQuantity, inventory.initMeasureUnit)) + // convert to standard unit
        Number(inventory.quantityIn) -
        Number(inventory.quantityOut);

      for (const dispenser of inventory.dispensers) {
        //console.log('dispenser: ', dispenser);
        const quantityInDisp: number =
          Number(convertToStandardUnit(dispenser.initQuantity, dispenser.initMeasureUnit)) +
          Number(dispenser.quantityIn) -
          Number(dispenser.quantityOut);

        //console.log('dispenser: ', quantityInDisp);

        dispensersList.push({
          id: dispenser.id,
          number: dispenser.number,
          quantity: {
            current: quantityInDisp,
            measureUnit: dispenser.measureUnit,
          },
          expiryDate: dispenser.expiryDate,
          storage: dispenser.storage,
        });
      }

      return {
        id: inventory.id,
        initQuantity: {
          quantity: inventory.initQuantity,
          measureUnit: inventory.initMeasureUnit,
        },
        quantity: {
          in: inventory.quantityIn,
          out: inventory.quantityOut,
          current: parseFloat(currentQuantity.toFixed(3)),
          measureUnit: inventory.measureUnit, // Keep Standard Unit
        },
        lotNumber: inventory.lotNumber,
        expiryDate: inventory.expiryDate,
        storage: inventory.storage,
        shopId: inventory.shop.id,
        dispensers: dispensersList,
        purchaseInfo: {
          ids: purchasedItemIds,
          supplier: purchasedItems[0].supplier,
          receptionDate: purchasedItems[0].receptionDate,
          ingredient: purchasedItems[0].ingredient,
        },
      };
    } catch (error) {
      console.error('Error find one inventory by shop id:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async findInventoryByPurchaseItem(locale: string, id: string): Promise<any> {
    const language = { lang: locale };
    let currentQuantity: number = 0;
    const purchaseItemId = id;

    try {
      // Check if purchaseItemId inventory exists
      const inventoryList = await this.inventoryRepository.find();
      //console.log(inventoryList);

      if (inventoryList.length !== 0) {
        let foundedItem = false;
        for (const inventory of inventoryList) {
          // Check if purchaseItemId exists
          const purchasedItemIds: string[] = inventory['purchaseItemsId'];
          console.log(purchasedItemIds);
          let purchasedItem: PurchaseItemInfo;
          for (const id of purchasedItemIds) {
            if (id == purchaseItemId) {
              const purchaseItemInfo = await this.getPurchaseItemInfo(locale, purchaseItemId);
              purchasedItem = purchaseItemInfo;
              foundedItem = true;
              break;
            }
          }

          if (foundedItem) {
            currentQuantity =
              Number(convertToStandardUnit(inventory['initQuantity'], inventory['initMeasureUnit'])) + // convert to standard unit
              Number(inventory['quantityIn']) -
              Number(inventory['quantityOut']);

            return {
              id: inventory['id'],
              initQuantity: {
                quantity: inventory['initQuantity'],
                measureUnit: inventory['initMeasureUnit'],
              },
              quantity: {
                in: inventory['quantityIn'],
                out: inventory['quantityOut'],
                current: parseFloat(currentQuantity.toFixed(3)),
                measureUnit: inventory['measureUnit'], // Keep Standard Unit
              },
              lotNumber: inventory['lotNumber'],
              expiryDate: inventory['expiryDate'],
              storage: inventory['storage'],
            };
          }
        }
      }

      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No purchase item found with that id.',
      };
    } catch (error) {
      console.error('Error find one inventory by shop id:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async update(locale: string, inventoryId: string, data: UpdateInventory) {
    console.log('\n -------- Update inventory: --------', '\n');

    const language = { lang: locale };
    let currentQuantity: number = 0;

    // Update ingredient inventory values
    try {
      // Check if inventory exists
      const inventory = await this.inventoryRepository.findOne({
        where: { id: inventoryId },
        relations: ['shop', 'dispensers'],
      });
      //const inventory = await this.inventoryRepository.findOneBy({ id: inventoryId });
      if (!inventory) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: this.i18n.t('messages.inventory.itemNotFound', { ...language, args: { id: inventoryId } }),
        };
      }

      const { quantityIn, quantityOut, measureUnit, ...updatedData } = data;
      currentQuantity =
        Number(convertToStandardUnit(inventory['initQuantity'], inventory['initMeasureUnit'])) + // convert to standard unit
        Number(inventory['quantityIn']) -
        Number(inventory['quantityOut']);

      // console.log('\n currentQuantity: ', currentQuantity);
      // console.log('Quantity OUT: ', Number(quantityOut));
      // console.log('In Dispenser ?', inventory.dispensers.length, '\n');

      // if (currentQuantity === Number(quantityOut) && inventory.dispensers.length === 0) {
      //   console.log('\n DELETE inventory record from database', '\n');
      //   // Delete inventory record from database
      //   await this.remove(locale, inventoryId);
      // } else {
      //console.log('\n UPDATE inventory', '\n');
      // Update inventory
      await this.inventoryRepository.update(inventoryId, {
        quantityIn: quantityIn ? Number(inventory.quantityIn) + Number(quantityIn) : inventory.quantityIn,
        quantityOut: quantityOut ? Number(inventory.quantityOut) + Number(quantityOut) : inventory.quantityOut,
        measureUnit: measureUnit, // Keep Standard Unit
        ...updatedData,
      });
      // }

      // Notice supply notifications to generate new ones
      await this.sendNoticeToSupplyNotf(locale, inventory.shop.id);

      return { statusCode: HttpStatus.OK, message: this.i18n.t('messages.inventory.itemUpdate', language) };
    } catch (error) {
      console.error('Error updating inventory', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async remove(locale: string, inventoryId: string) {
    const language = { lang: locale };

    // Check if ingredient inventory exists
    const inventoryExists = await this.inventoryRepository.findOneBy({ id: inventoryId });
    if (!inventoryExists) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: this.i18n.t('messages.inventory.itemNotFound', { ...language, args: { id: inventoryId } }),
      };
    }

    // Delete inventory
    try {
      await this.inventoryRepository.delete(inventoryId); // delete a ingredient inventory from the database
      return { statusCode: HttpStatus.OK, message: this.i18n.t('messages.inventory.itemDelete', language) };
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

  /** Get purchase item information from SUPPLIERS service */
  async getPurchaseItemInfo(locale: string, itemId: string): Promise<any> {
    try {
      const itemInfo = await new Promise<any>((resolve, reject) => {
        this.supplierClient.send({ cmd: 'findPurchaseItem' }, { id: itemId, locale: locale }).subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (err) => {
            reject(err);
          },
        });
      });
      return itemInfo;
    } catch (error) {
      console.error('Error getting purchase item information:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', { lang: locale }),
      };
    }
  }

  /** Send notice to supply notifications to update */
  async sendNoticeToSupplyNotf(locale: string, id: string): Promise<any> {
    console.log('\n sendNoticeToSupplyNotf - shopId: ', id, '\n');
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
