import ingredientsReducer, { fetchIngredients } from '../ingredients';
import { mockIngredientsArray } from './__fixtures__/ingredients';

describe('ingredients reducer', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  it('должен возвращать начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: '@@INIT' })).toEqual(
      initialState
    );
  });

  describe('fetchIngredients.pending', () => {
    it('должен установить isLoading в true', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('должен сбросить error в null', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });

    it('должен установить isLoading в true и error в null одновременно', () => {
      const stateWithError = {
        ...initialState,
        error: 'Ошибка',
        isLoading: false
      };
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(stateWithError, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('не должен изменять массив ingredients', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: mockIngredientsArray
      };
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(stateWithIngredients, action);

      expect(state.ingredients).toEqual(mockIngredientsArray);
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredientsArray
      };
      const state = ingredientsReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен записать полученные ингредиенты в стор', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredientsArray
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.ingredients).toEqual(mockIngredientsArray);
      expect(state.ingredients).toHaveLength(5);
    });

    it('должен заменить существующие ингредиенты новыми', () => {
      const oldIngredients = [mockIngredientsArray[0]];
      const stateWithOldData = {
        ...initialState,
        ingredients: oldIngredients,
        isLoading: true
      };
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredientsArray
      };
      const state = ingredientsReducer(stateWithOldData, action);

      expect(state.ingredients).toEqual(mockIngredientsArray);
      expect(state.ingredients).not.toEqual(oldIngredients);
    });

    it('должен корректно записать пустой массив ингредиентов', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: []
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.ingredients).toEqual([]);
      expect(state.ingredients).toHaveLength(0);
    });

    it('должен установить isLoading в false и записать ингредиенты одновременно', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredientsArray
      };
      const state = ingredientsReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredientsArray);
    });

    it('должен сохранить правильную структуру данных ингредиентов', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredientsArray
      };
      const state = ingredientsReducer(initialState, action);

      state.ingredients.forEach((ingredient) => {
        expect(ingredient).toHaveProperty('_id');
        expect(ingredient).toHaveProperty('name');
        expect(ingredient).toHaveProperty('type');
        expect(ingredient).toHaveProperty('proteins');
        expect(ingredient).toHaveProperty('fat');
        expect(ingredient).toHaveProperty('carbohydrates');
        expect(ingredient).toHaveProperty('calories');
        expect(ingredient).toHaveProperty('price');
        expect(ingredient).toHaveProperty('image');
        expect(ingredient).toHaveProperty('image_mobile');
        expect(ingredient).toHaveProperty('image_large');
      });
    });

    it('не должен изменять значение error при успешной загрузке', () => {
      const stateWithError = {
        ...initialState,
        error: 'Старая ошибка',
        isLoading: true
      };
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredientsArray
      };
      const state = ingredientsReducer(stateWithError, action);

      expect(state.error).toBe('Старая ошибка');
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка сети' }
      };
      const state = ingredientsReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен записать сообщение об ошибке в error', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка сети' }
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.error).toBe('Ошибка сети');
    });

    it('должен установить дефолтное сообщение об ошибке, если message отсутствует', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.error).toBe('Ошибка загрузки ингредиентов');
    });

    it('должен установить isLoading в false и error одновременно', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка сервера' }
      };
      const state = ingredientsReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка сервера');
    });

    it('должен заменить предыдущую ошибку новой', () => {
      const stateWithOldError = {
        ...initialState,
        error: 'Старая ошибка',
        isLoading: true
      };
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Новая ошибка' }
      };
      const state = ingredientsReducer(stateWithOldError, action);

      expect(state.error).toBe('Новая ошибка');
      expect(state.error).not.toBe('Старая ошибка');
    });

    it('не должен изменять массив ingredients при ошибке', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: mockIngredientsArray,
        isLoading: true
      };
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка' }
      };
      const state = ingredientsReducer(stateWithIngredients, action);

      expect(state.ingredients).toEqual(mockIngredientsArray);
    });
  });

  describe('интеграционные тесты последовательности состояний', () => {
    it('должен корректно обрабатывать последовательность pending -> fulfilled', () => {
      // Отправка запроса
      const pendingState = ingredientsReducer(initialState, {
        type: fetchIngredients.pending.type
      });
      expect(pendingState.isLoading).toBe(true);
      expect(pendingState.error).toBeNull();
      expect(pendingState.ingredients).toEqual([]);

      // Успешный ответ
      const fulfilledState = ingredientsReducer(pendingState, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredientsArray
      });
      expect(fulfilledState.isLoading).toBe(false);
      expect(fulfilledState.ingredients).toEqual(mockIngredientsArray);
    });

    it('должен корректно обрабатывать последовательность pending -> rejected', () => {
      // Отправка запроса
      const pendingState = ingredientsReducer(initialState, {
        type: fetchIngredients.pending.type
      });
      expect(pendingState.isLoading).toBe(true);
      expect(pendingState.error).toBeNull();

      // Ошибка
      const rejectedState = ingredientsReducer(pendingState, {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка сети' }
      });
      expect(rejectedState.isLoading).toBe(false);
      expect(rejectedState.error).toBe('Ошибка сети');
    });

    it('должен корректно обрабатывать повторный запрос после ошибки', () => {
      // Состояние с ошибкой
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };

      // Новый запрос должен очистить ошибку
      const pendingState = ingredientsReducer(stateWithError, {
        type: fetchIngredients.pending.type
      });
      expect(pendingState.isLoading).toBe(true);
      expect(pendingState.error).toBeNull();

      // Успешный ответ
      const fulfilledState = ingredientsReducer(pendingState, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredientsArray
      });
      expect(fulfilledState.isLoading).toBe(false);
      expect(fulfilledState.error).toBeNull();
      expect(fulfilledState.ingredients).toEqual(mockIngredientsArray);
    });
  });
});
