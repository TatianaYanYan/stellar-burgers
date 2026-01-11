import { FC } from 'react';
import { IngredientDetails } from '@components';
import styles from './ingredient.module.css';

export const Ingredient: FC = () => (
  <div className={styles.container}>
    <h2 className={styles.title}>Детали ингредиента</h2>
    <IngredientDetails />
  </div>
);
