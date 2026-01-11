import orderReducer, { createOrder, clearOrder } from '../order';
import { mockOrder } from './__fixtures__/ingredients';

describe('order reducer', () => {
  const initialState = {
    order: null,
    orderName: '',
    isLoading: false,
    error: null
  };

  it('должен возвращать начальное состояние', () => {
    expect(orderReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('createOrder.pending', () => {
    it('должен установить isLoading в true', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('должен сбросить error в null', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };
      const action = { type: createOrder.pending.type };
      const state = orderReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });

    it('должен установить isLoading в true и error в null одновременно', () => {
      const stateWithError = {
        ...initialState,
        error: 'Ошибка',
        isLoading: false
      };
      const action = { type: createOrder.pending.type };
      const state = orderReducer(stateWithError, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('не должен изменять order и orderName', () => {
      const stateWithOrder = {
        ...initialState,
        order: mockOrder,
        orderName: 'Старый заказ'
      };
      const action = { type: createOrder.pending.type };
      const state = orderReducer(stateWithOrder, action);

      expect(state.order).toEqual(mockOrder);
      expect(state.orderName).toBe('Старый заказ');
    });
  });

  describe('createOrder.fulfilled', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: createOrder.fulfilled.type,
        payload: {
          order: mockOrder,
          name: 'Флюоресцентный бургер'
        }
      };
      const state = orderReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен записать order в стор', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: {
          order: mockOrder,
          name: 'Флюоресцентный бургер'
        }
      };
      const state = orderReducer(initialState, action);

      expect(state.order).toEqual(mockOrder);
    });

    it('должен записать orderName в стор', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: {
          order: mockOrder,
          name: 'Флюоресцентный бургер'
        }
      };
      const state = orderReducer(initialState, action);

      expect(state.orderName).toBe('Флюоресцентный бургер');
    });

    it('должен установить isLoading в false, order и orderName одновременно', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: createOrder.fulfilled.type,
        payload: {
          order: mockOrder,
          name: 'Флюоресцентный бургер'
        }
      };
      const state = orderReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
      expect(state.order).toEqual(mockOrder);
      expect(state.orderName).toBe('Флюоресцентный бургер');
    });

    it('должен заменить предыдущий заказ новым', () => {
      const stateWithOldOrder = {
        ...initialState,
        order: { ...mockOrder, number: 99999 },
        orderName: 'Старый заказ',
        isLoading: true
      };
      const action = {
        type: createOrder.fulfilled.type,
        payload: {
          order: mockOrder,
          name: 'Флюоресцентный бургер'
        }
      };
      const state = orderReducer(stateWithOldOrder, action);

      expect(state.order?.number).toBe(12345);
      expect(state.orderName).toBe('Флюоресцентный бургер');
    });

    it('должен сохранить правильную структуру заказа', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: {
          order: mockOrder,
          name: 'Флюоресцентный бургер'
        }
      };
      const state = orderReducer(initialState, action);

      expect(state.order).toHaveProperty('_id');
      expect(state.order).toHaveProperty('status');
      expect(state.order).toHaveProperty('name');
      expect(state.order).toHaveProperty('number');
      expect(state.order).toHaveProperty('ingredients');
    });
  });

  describe('createOrder.rejected', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: createOrder.rejected.type,
        error: { message: 'Ошибка создания заказа' }
      };
      const state = orderReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен записать сообщение об ошибке в error', () => {
      const action = {
        type: createOrder.rejected.type,
        error: { message: 'Ошибка сети' }
      };
      const state = orderReducer(initialState, action);

      expect(state.error).toBe('Ошибка сети');
    });

    it('должен установить дефолтное сообщение об ошибке, если message отсутствует', () => {
      const action = {
        type: createOrder.rejected.type,
        error: {}
      };
      const state = orderReducer(initialState, action);

      expect(state.error).toBe('Ошибка создания заказа');
    });

    it('должен установить isLoading в false и error одновременно', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: createOrder.rejected.type,
        error: { message: 'Ошибка сервера' }
      };
      const state = orderReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка сервера');
    });

    it('не должен изменять order и orderName при ошибке', () => {
      const stateWithOrder = {
        ...initialState,
        order: mockOrder,
        orderName: 'Текущий заказ',
        isLoading: true
      };
      const action = {
        type: createOrder.rejected.type,
        error: { message: 'Ошибка' }
      };
      const state = orderReducer(stateWithOrder, action);

      expect(state.order).toEqual(mockOrder);
      expect(state.orderName).toBe('Текущий заказ');
    });
  });

  describe('clearOrder', () => {
    it('должен очистить order', () => {
      const stateWithOrder = {
        ...initialState,
        order: mockOrder,
        orderName: 'Заказ',
        error: 'Ошибка'
      };
      const action = clearOrder();
      const state = orderReducer(stateWithOrder, action);

      expect(state.order).toBeNull();
    });

    it('должен очистить orderName', () => {
      const stateWithOrder = {
        ...initialState,
        order: mockOrder,
        orderName: 'Заказ'
      };
      const action = clearOrder();
      const state = orderReducer(stateWithOrder, action);

      expect(state.orderName).toBe('');
    });

    it('должен очистить error', () => {
      const stateWithOrder = {
        ...initialState,
        order: mockOrder,
        orderName: 'Заказ',
        error: 'Ошибка'
      };
      const action = clearOrder();
      const state = orderReducer(stateWithOrder, action);

      expect(state.error).toBeNull();
    });

    it('должен очистить order, orderName и error одновременно', () => {
      const stateWithOrder = {
        ...initialState,
        order: mockOrder,
        orderName: 'Заказ',
        error: 'Ошибка'
      };
      const action = clearOrder();
      const state = orderReducer(stateWithOrder, action);

      expect(state.order).toBeNull();
      expect(state.orderName).toBe('');
      expect(state.error).toBeNull();
    });

    it('не должен изменять isLoading', () => {
      const stateWithOrder = {
        ...initialState,
        order: mockOrder,
        orderName: 'Заказ',
        isLoading: true
      };
      const action = clearOrder();
      const state = orderReducer(stateWithOrder, action);

      expect(state.isLoading).toBe(true);
    });
  });

  describe('интеграционные тесты', () => {
    it('должен корректно обрабатывать последовательность pending -> fulfilled', () => {
      const pendingState = orderReducer(initialState, {
        type: createOrder.pending.type
      });
      expect(pendingState.isLoading).toBe(true);
      expect(pendingState.error).toBeNull();

      const fulfilledState = orderReducer(pendingState, {
        type: createOrder.fulfilled.type,
        payload: {
          order: mockOrder,
          name: 'Флюоресцентный бургер'
        }
      });
      expect(fulfilledState.isLoading).toBe(false);
      expect(fulfilledState.order).toEqual(mockOrder);
      expect(fulfilledState.orderName).toBe('Флюоресцентный бургер');
    });

    it('должен корректно обрабатывать последовательность pending -> rejected', () => {
      const pendingState = orderReducer(initialState, {
        type: createOrder.pending.type
      });
      expect(pendingState.isLoading).toBe(true);

      const rejectedState = orderReducer(pendingState, {
        type: createOrder.rejected.type,
        error: { message: 'Ошибка создания заказа' }
      });
      expect(rejectedState.isLoading).toBe(false);
      expect(rejectedState.error).toBe('Ошибка создания заказа');
    });

    it('должен корректно обрабатывать создание заказа -> clearOrder', () => {
      const fulfilledState = orderReducer(initialState, {
        type: createOrder.fulfilled.type,
        payload: {
          order: mockOrder,
          name: 'Флюоресцентный бургер'
        }
      });
      expect(fulfilledState.order).toEqual(mockOrder);

      const clearedState = orderReducer(fulfilledState, clearOrder());
      expect(clearedState.order).toBeNull();
      expect(clearedState.orderName).toBe('');
      expect(clearedState.error).toBeNull();
    });
  });
});
