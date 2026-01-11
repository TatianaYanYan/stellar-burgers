import { TIngredient, TOrder, TUser } from '../../../../../utils/types';

export const mockBun: TIngredient = {
  _id: '1',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
};

export const mockSauce: TIngredient = {
  _id: '2',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

export const mockMain: TIngredient = {
  _id: '3',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

export const mockMain2: TIngredient = {
  _id: '4',
  name: 'Мясо бессмертных моллюсков Protostomia',
  type: 'main',
  proteins: 433,
  fat: 244,
  carbohydrates: 33,
  calories: 420,
  price: 1337,
  image: 'https://code.s3.yandex.net/react/code/meat-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png'
};

export const mockBun2: TIngredient = {
  _id: '5',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

export const mockIngredientsArray: TIngredient[] = [
  mockBun,
  mockBun2,
  mockSauce,
  mockMain,
  mockMain2
];

export const mockOrder: TOrder = {
  _id: '643d69a5c3f7b9001cfa093c',
  status: 'done',
  name: 'Флюоресцентный бургер',
  createdAt: '2023-04-17T10:30:00.000Z',
  updatedAt: '2023-04-17T10:30:30.000Z',
  number: 12345,
  ingredients: ['1', '2', '3', '1']
};

export const mockOrder2: TOrder = {
  _id: '643d69a5c3f7b9001cfa093d',
  status: 'pending',
  name: 'Краторный бургер',
  createdAt: '2023-04-17T11:00:00.000Z',
  updatedAt: '2023-04-17T11:00:30.000Z',
  number: 12346,
  ingredients: ['5', '2', '4', '5']
};

export const mockOrdersArray: TOrder[] = [mockOrder, mockOrder2];

export const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

export const mockUserUpdated: TUser = {
  email: 'updated@example.com',
  name: 'Updated User'
};
