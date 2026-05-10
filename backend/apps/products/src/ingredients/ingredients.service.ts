import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientTranslation } from './entities/translation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIngredient, ReadIngredient, UpdateIngredient } from './ingredients.interface';

@Injectable()
export class IngredientsService {
  constructor(
    private readonly i18n: I18nService,
    @InjectRepository(Ingredient)
    private readonly ingRepository: Repository<Ingredient>,
    @InjectRepository(IngredientTranslation)
    private readonly ingTranslationRepository: Repository<IngredientTranslation>,
  ) {}

  async create(locale: string, data: CreateIngredient): Promise<any> {
    console.log('\nCreate Ingredient : ', data);

    const { id, language, name, form, image, icon, shelfLife, density } = data;

    try {
      if (!id) {
        console.log('Create ingredient wihout id');
        const isTranslationExists = await this.ingTranslationRepository.findOneBy({ language, name });
        if (isTranslationExists) {
          const message = this.i18n.t('messages.itemFound', { lang: locale, args: { id: id } });
          throw new HttpException(message, HttpStatus.CONFLICT); // throw a conflict error
        }
        const ingredient = await this.ingRepository.save(
          this.ingRepository.create({ image, icon, shelfLife, density }),
        );
        console.log('ingredient: ', ingredient);
        const translation = this.ingTranslationRepository.create({ ingredient, language, name, form });
        console.log('translation: ', translation);
        await this.ingTranslationRepository.save(translation); // save the ingredient translation
        return { statusCode: HttpStatus.CREATED, message: this.i18n.t('messages.itemCreate', { lang: locale }) };
      } else {
        const ingredient = await this.ingRepository.findOneBy({ id: id });
        if (!ingredient) {
          const message = this.i18n.t('messages.itemNotFound', { lang: locale, args: { id: id } });
          throw new HttpException(message, HttpStatus.NOT_FOUND);
        }
        const isIngredientExists = await this.ingTranslationRepository.findOneBy({ ingredient, language, name, form });
        if (isIngredientExists) {
          const message = this.i18n.t('messages.itemFound', { lang: locale, args: { id: id } });
          throw new HttpException(message, HttpStatus.CONFLICT); // throw a conflict error
        }
        const translation = this.ingTranslationRepository.create({ ingredient, language, name, form });
        await this.ingTranslationRepository.save(translation); // save the action translation
        return { statusCode: HttpStatus.CREATED, message: this.i18n.t('messages.itemCreate', { lang: locale }) };
      }
    } catch (error) {
      console.log('Error creating ingredient...', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', { lang: locale }),
      };
    }
  }

  async findAll(locale: string): Promise<any> {
    console.log('\n ----------- Find All -----------');
    console.log('Locale: ', locale);
    const ingredientsList: ReadIngredient[] = [];
    try {
      const ingredients = await this.ingRepository.find({ relations: ['translations'] });
      console.log('Ingredients founded: ', ingredients);
      ingredients.map((ingredient) => {
        const translation = ingredient.translations.find((translation) => translation.language == locale);
        console.log('translation: ', translation);
        ingredientsList.push({
          id: ingredient.id,
          name: translation ? translation.name : `There is no translation for ${locale}`,
          form: translation ? translation.form : `There is no translation for ${locale}`,
          image: ingredient.image,
          icon: ingredient.icon,
          shelfLife: ingredient.shelfLife,
          density: Number(ingredient.density),
        });
      });
      return ingredientsList;
    } catch (error) {
      console.log('Error finding all ingredients', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', { lang: locale }),
      };
    }
  }

  async findOne(locale: string, ingredientId: string): Promise<any> {
    const language = { lang: locale };
    try {
      console.log('Ingredient Service - findOne');
      console.log('ingredientId: ' + ingredientId);
      const ingredient = await this.ingRepository.findOne({ where: { id: ingredientId }, relations: ['translations'] });
      //console.log(ingredient);
      if (!ingredient) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: this.i18n.translate('messages.itemNotFound', { ...language, args: { ingredientId } }),
        };
      }
      // Get the correct translation
      const translation = ingredient.translations.find((translation) => translation.language == locale);
      return {
        id: ingredient.id,
        name: translation ? translation.name : `There is no translation for ${locale}`,
        form: translation ? translation.form : `There is no translation for ${locale}`,
        image: ingredient.image,
        icon: ingredient.icon,
        shelfLife: ingredient.shelfLife,
        density: Number(ingredient.density),
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }

  async update(locale: string, ingredientId: string, { image, language, name, form }: UpdateIngredient) {
    try {
      // Check if ingredient exists
      const ingredient = await this.ingRepository.findOne({ where: { id: ingredientId } });
      if (!ingredient) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: this.i18n.t('messages.itemNotFound', { ...{ lang: locale }, args: { ingredientId } }),
        };
      }

      // Update ingredient entity if needed
      if (image !== undefined) {
        await this.ingRepository.update(ingredientId, { image });
      }

      // Update ingredient-translation entity if needed
      if (language !== undefined) {
        const translation = await this.ingTranslationRepository.findOneBy({ ingredient, language });
        await this.ingTranslationRepository.update({ id: translation.id }, { name, form });
      }

      return { statusCode: HttpStatus.OK, message: this.i18n.t('messages.itemUpdate', { lang: locale }) };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', { lang: locale }),
      };
    }
  }

  async remove(locale: string, ingredientId: string) {
    const language = { lang: locale };
    try {
      // delete an ingredient from the database
      await this.ingRepository.delete(ingredientId);
      return {
        statusCode: HttpStatus.OK,
        message: this.i18n.t('messages.itemDelete', language),
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.t('messages.somethingWrong', language),
      };
    }
  }
}
