import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, OneToOne, Column } from 'typeorm';
import { IngredientTranslation } from './translation.entity';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ type: 'int', default: 0 })
  shelfLife: number;

  @Column({ type: 'decimal', default: 0 })  // g/cm3
  density: number;

  @OneToMany(() => IngredientTranslation, (translate) => translate.ingredient)
  translations: IngredientTranslation[];
}
