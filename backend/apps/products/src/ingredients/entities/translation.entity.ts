import { Language } from '@wac/shared';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Ingredient } from './ingredient.entity';

@Entity()
export class IngredientTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Language, default: Language.ENGLISH })
  language: Language;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ type: 'varchar', length: 20, default: 'Solid' })
  form: string;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.translations, { onDelete: 'CASCADE' })
  ingredient: Ingredient;
}
