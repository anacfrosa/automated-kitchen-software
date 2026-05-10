import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { InitMeasureUnit, StandardMeasureUnit } from '@wac/shared/enums/measure-unit.enum';
import { SupplyNotification } from './entities/supply.entity';
import { CreateSupplyNotif, ReadSupplyNotif } from './supply.interface';
import { lastValueFrom } from 'rxjs';
import { convertToGrams } from 'apps/kitchens/src/utils/common';
import {
  assignDispenser,
  calcMaxQtyAvailable,
  getLotNumbersForDispenser,
  findRefillInfo,
  getDispenserMaxCapacity,
} from '../utils/supply-operations';
import { SupplyNotif } from '@wac/shared/enums/supply-notification.enum';
import { ReadIngredient } from 'apps/products/src/ingredients/ingredients.interface';
import { ReadInventory } from 'apps/kitchens/src/inventory/inventory.interface';
import { ReadDispenser } from 'apps/kitchens/src/dispensers/dispensers.interface';

@Injectable()
export class SupplyService {
  constructor(
    private readonly i18n: I18nService,
    @InjectRepository(SupplyNotification)
    private readonly supplyRepository: Repository<SupplyNotification>,
    @Inject('KITCHENS_SERVICE') private readonly kitchenClient: ClientProxy,
    @Inject('PRODUCTS_SERVICE') private readonly productClient: ClientProxy,
  ) {}

  async create(locale: string, id: string): Promise<any> {
    const language = { lang: locale };
    const shopId = id;
    try {
      // Clear supply notifications if necessary
      await this.clearSupplyNotifications();

      const forecastList = await this.getShopForecasts(locale, shopId);
      //console.log(forecastList);

      for (const forecast of forecastList) {
        const { ingredient: ingredient, quantity, measureUnit } = forecast;
        const requiredQtyGrams = convertToGrams(quantity, measureUnit);
        const ingrInventory = await this.getShopInventoryByIngr(locale, shopId, ingredient.id);
        const ingrDispensers = await this.getShopDispsByIngr(locale, shopId, ingredient.id);

        console.log('\nForecast Date: ', forecast.date);
        console.log('Ingredient: ', forecast.ingredient.name);
        console.log('Required Qty Grams: ', requiredQtyGrams, '\n');

        // Get the max quantity (g) available in inventory
        const maxQtyInv = calcMaxQtyAvailable(ingrInventory);
        // Get the max quantity (g) available in dispensers
        const maxQtyDisps = calcMaxQtyAvailable(ingrDispensers);

        if (maxQtyDisps >= requiredQtyGrams) {
          // No notification needed; dispensers have enough quantity.
          console.log('No notification needed; dispensers have enough quantity.\n');
          continue;
        }

        const notification = await this.generateSupplyNotification(
          locale,
          shopId,
          forecast,
          requiredQtyGrams,
          maxQtyInv,
          maxQtyDisps,
          ingrInventory,
          ingrDispensers,
        );
        //console.log('Generated Notification: ', notification);

        const createdNotif = this.supplyRepository.create(notification);
        await this.supplyRepository.save(createdNotif);
      }

      return 'All notifications processed successfully!';
    } catch (error) {
      console.error('Error generating new supply notifications:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async findByShop(locale: string, shopId: string): Promise<any> {
    const language = { lang: locale };

    try {
      const notifications = await this.supplyRepository.findBy({ shopId });

      const supplyNotifications: ReadSupplyNotif[] = await Promise.all(
        notifications.map(async (notif) => {
          const ingrInfo: ReadIngredient = await this.getIngredientInfo(locale, notif.ingredientId);

          let title = '';
          switch (notif.type) {
            case SupplyNotif.PURCHASE:
              title = this.i18n.t('messages.supply.title.purchase', {
                ...language,
                args: { ingrName: ingrInfo.name },
              });
              break;
            case SupplyNotif.FILL:
              title = this.i18n.t('messages.supply.title.fill', { ...language });
              break;
            case SupplyNotif.REFILL:
              title = this.i18n.t('messages.supply.title.refill', { ...language });
              break;
            default:
              title = '';
          }

          return {
            id: notif.id,
            type: notif.type,
            title,
            subtitle: this.i18n.t('messages.supply.subtitle', {
              ...language,
              args: {
                quantity: notif.quantity,
                measureUnit: notif.measureUnit,
                ingrName: ingrInfo.name,
              },
            }),
            forecastDate: notif.forecastDate,
            quantity: notif.quantity,
            measureUnit: notif.measureUnit,
            shopId: notif.shopId,
            ingredientId: notif.ingredientId,
            inventoryId: notif.inventoryId,
            dispenserId: notif.dispenserId,
          };
        }),
      );

      return supplyNotifications;
    } catch (error) {
      console.error('Error finding supply notifications by shopId:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', { lang: locale }),
      };
    }
  }

  async generateSupplyNotification(
    locale: string,
    shopId: string,
    forecast,
    requiredQtyGrams: number,
    maxQtyInv: number,
    maxQtyDisps: number,
    ingrInventory: ReadInventory[],
    ingrDispensers: ReadDispenser[],
  ): Promise<any> {
    console.log('GENERATING notification ... \n');
    const { ingredient: ingredient, date: forecastDate } = forecast;

    // Find the missing quantity (g) to add to dispensers
    const qtyMissing = requiredQtyGrams - maxQtyDisps;
    console.log('qtyMissing: ', qtyMissing, '\n');

    if (maxQtyInv === 0) {
      // Purchase Notification. Quantity not available in any inventory!
      return {
        type: SupplyNotif.PURCHASE,
        forecastDate: forecastDate,
        quantity: qtyMissing < 1000 ? qtyMissing : qtyMissing / 1000,
        measureUnit: qtyMissing < 1000 ? 'g' : 'kg',
        ingredientId: ingredient.id,
        shopId: shopId,
      };
    }

    const minAvailableInv = Math.min(qtyMissing, maxQtyInv);
    //console.log('minQtyInventory: ', availableQtyInv);
    const availableLots = getLotNumbersForDispenser(ingrInventory, minAvailableInv);
    //console.log('availableLots: ', availableLots);

    if (ingredient.shelfLife == 0 && maxQtyDisps !== 0) {
      // Handle not perishable ingredients
      // check if refill is possible
      const refillInfo = findRefillInfo(ingrDispensers, availableLots, minAvailableInv, ingredient);
      if (refillInfo) {
        //console.log('Making a refill ! ');
        return {
          type: SupplyNotif.REFILL,
          forecastDate: forecastDate,
          quantity: refillInfo.quantity < 1000 ? refillInfo.quantity : refillInfo.quantity / 1000,
          measureUnit: refillInfo.quantity < 1000 ? 'g' : 'kg',
          shopId: shopId,
          ingredientId: ingredient.id,
          inventoryId: refillInfo.inventoryId,
          dispenserId: refillInfo.dispenserId,
        };
      }
    }

    const shopDispensers = await this.getShopDispensers(locale, shopId);
    // Assign a free dispenser
    const assignedDisp: ReadDispenser | null = assignDispenser(shopDispensers, ingredient.shelfLife);
    // Find the max quantity that is possible to insert based on the dispenser capacity
    let quantityToAdd: number = 0;
    if (assignedDisp != null) {
      const findMaxQty = getDispenserMaxCapacity(assignedDisp.volume, ingredient.density);
      quantityToAdd = Math.min(findMaxQty, minAvailableInv);
    } else {
      // Fill notification without an assigned dispenser !
      return {
        type: SupplyNotif.FILL,
        forecastDate: forecastDate,
        quantity: minAvailableInv < 1000 ? minAvailableInv : minAvailableInv / 1000,
        measureUnit: minAvailableInv < 1000 ? 'g' : 'kg',
        ingredientId: ingredient.id,
        shopId: shopId,
      };
    }

    // Fill Notification (with one or more lots)
    return {
      type: SupplyNotif.FILL,
      forecastDate: forecastDate,
      quantity: quantityToAdd < 1000 ? quantityToAdd : quantityToAdd / 1000,
      measureUnit: quantityToAdd < 1000 ? 'g' : 'kg',
      ingredientId: ingredient.id,
      shopId: shopId,
      ...(availableLots.length === 1 ? { inventoryId: availableLots[0] } : {}),
      dispenserId: assignedDisp.id,
    };
  }

  private async clearSupplyNotifications() {
    const supplyNotifications = await this.supplyRepository.find();
    if (supplyNotifications.length > 0) {
      console.log('Clearing supply notifications...');
      await this.supplyRepository.clear();
    }
  }

  /** Get all the forecasts from a shop */
  async getShopForecasts(locale: string, shopId: string): Promise<any> {
    try {
      // convert the Observable to a Promise with lastValueFrom
      const res = await lastValueFrom(this.kitchenClient.send({ cmd: 'findForecastsByShopId' }, { locale, shopId }));
      return res;
    } catch (error) {
      console.error('Error getting shop forecasts:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', { lang: locale }),
      };
    }
  }

  /** Get all the inventory of a specific ingredient from a WAC shop */
  async getShopInventoryByIngr(locale: string, shopId: string, ingredientId: string): Promise<any> {
    try {
      // convert the Observable to a Promise with lastValueFrom
      const res = await lastValueFrom(
        this.kitchenClient.send({ cmd: 'findInventoryByShopIdAndIngredientId' }, { locale, shopId, ingredientId }),
      );
      return res;
    } catch (error) {
      console.error('Error getting shop forecasts:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', { lang: locale }),
      };
    }
  }

  /** Get all the dispensers with a specific ingredient from a WAC shop */
  async getShopDispsByIngr(locale: string, shopId: string, ingredientId: string): Promise<any> {
    try {
      // convert the Observable to a Promise with lastValueFrom
      const res = await lastValueFrom(
        this.kitchenClient.send({ cmd: 'findDispensersByShopAndIngredient' }, { locale, shopId, ingredientId }),
      );
      return res;
    } catch (error) {
      console.error('Error getting shop forecasts:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', { lang: locale }),
      };
    }
  }

  /** Get all the dispensers from a WAC shop */
  async getShopDispensers(locale: string, shopId: string): Promise<any> {
    try {
      // convert the Observable to a Promise with lastValueFrom
      const res = await lastValueFrom(this.kitchenClient.send({ cmd: 'findDispensersByShop' }, { locale, shopId }));
      return res;
    } catch (error) {
      console.error('Error getting shop dispensers:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', { lang: locale }),
      };
    }
  }

  /** Get ingredient information from PRODUCTS service */
  async getIngredientInfo(locale: string, ingredientId: string): Promise<any> {
    try {
      const ingredientInfo = await lastValueFrom(
        this.productClient.send({ cmd: 'findOneIngredient' }, { id: ingredientId, locale: locale }),
      );
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
