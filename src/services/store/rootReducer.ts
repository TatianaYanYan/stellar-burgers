import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredients';
import burgerConstructorReducer from './slices/burgerConstructor';
import orderReducer from './slices/order';
import userReducer from './slices/user';
import feedReducer from './slices/feed';
import profileOrdersReducer from './slices/profileOrders';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer,
  user: userReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer
});
