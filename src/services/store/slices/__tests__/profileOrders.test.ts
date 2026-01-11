import profileOrdersReducer, { getProfileOrders } from '../profileOrders';
import { mockOrdersArray } from './__fixtures__/ingredients';

describe('profileOrders reducer', () => {
  const initialState = {
    orders: [],
    isLoading: false,
    isError: false
  };

  it('должен возвращать начальное состояние', () => {
    expect(profileOrdersReducer(undefined, { type: '@@INIT' })).toEqual(
      initialState
    );
  });

  describe('getProfileOrders.pending', () => {
    it('должен установить isLoading в true', () => {
      const action = { type: getProfileOrders.pending.type };
      const state = profileOrdersReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('должен сбросить isError в false', () => {
      const stateWithError = {
        ...initialState,
        isError: true
      };
      const action = { type: getProfileOrders.pending.type };
      const state = profileOrdersReducer(stateWithError, action);

      expect(state.isError).toBe(false);
    });

    it('должен установить isLoading в true и isError в false одновременно', () => {
      const stateWithError = {
        ...initialState,
        isError: true,
        isLoading: false
      };
      const action = { type: getProfileOrders.pending.type };
      const state = profileOrdersReducer(stateWithError, action);

      expect(state.isLoading).toBe(true);
      expect(state.isError).toBe(false);
    });

    it('не должен изменять массив orders', () => {
      const stateWithOrders = {
        ...initialState,
        orders: mockOrdersArray
      };
      const action = { type: getProfileOrders.pending.type };
      const state = profileOrdersReducer(stateWithOrders, action);

      expect(state.orders).toEqual(mockOrdersArray);
    });
  });

  describe('getProfileOrders.fulfilled', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: getProfileOrders.fulfilled.type,
        payload: mockOrdersArray
      };
      const state = profileOrdersReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен записать заказы в стор', () => {
      const action = {
        type: getProfileOrders.fulfilled.type,
        payload: mockOrdersArray
      };
      const state = profileOrdersReducer(initialState, action);

      expect(state.orders).toEqual(mockOrdersArray);
      expect(state.orders).toHaveLength(2);
    });

    it('должен установить isLoading в false и записать заказы одновременно', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: getProfileOrders.fulfilled.type,
        payload: mockOrdersArray
      };
      const state = profileOrdersReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockOrdersArray);
    });

    it('должен заменить существующие заказы новыми', () => {
      const stateWithOldData = {
        ...initialState,
        orders: [mockOrdersArray[0]],
        isLoading: true
      };
      const action = {
        type: getProfileOrders.fulfilled.type,
        payload: mockOrdersArray
      };
      const state = profileOrdersReducer(stateWithOldData, action);

      expect(state.orders).toEqual(mockOrdersArray);
      expect(state.orders).toHaveLength(2);
    });

    it('должен корректно записать пустой массив заказов', () => {
      const action = {
        type: getProfileOrders.fulfilled.type,
        payload: []
      };
      const state = profileOrdersReducer(initialState, action);

      expect(state.orders).toEqual([]);
      expect(state.orders).toHaveLength(0);
    });

    it('должен сохранить правильную структуру данных заказов', () => {
      const action = {
        type: getProfileOrders.fulfilled.type,
        payload: mockOrdersArray
      };
      const state = profileOrdersReducer(initialState, action);

      state.orders.forEach((order) => {
        expect(order).toHaveProperty('_id');
        expect(order).toHaveProperty('status');
        expect(order).toHaveProperty('name');
        expect(order).toHaveProperty('number');
        expect(order).toHaveProperty('ingredients');
        expect(order).toHaveProperty('createdAt');
        expect(order).toHaveProperty('updatedAt');
      });
    });

    it('не должен изменять значение isError при успешной загрузке', () => {
      const stateWithError = {
        ...initialState,
        isError: true,
        isLoading: true
      };
      const action = {
        type: getProfileOrders.fulfilled.type,
        payload: mockOrdersArray
      };
      const state = profileOrdersReducer(stateWithError, action);

      expect(state.isError).toBe(true);
    });
  });

  describe('getProfileOrders.rejected', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = { type: getProfileOrders.rejected.type };
      const state = profileOrdersReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен установить isError в true', () => {
      const action = { type: getProfileOrders.rejected.type };
      const state = profileOrdersReducer(initialState, action);

      expect(state.isError).toBe(true);
    });

    it('должен установить isLoading в false и isError в true одновременно', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = { type: getProfileOrders.rejected.type };
      const state = profileOrdersReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
    });

    it('не должен изменять массив orders при ошибке', () => {
      const stateWithOrders = {
        ...initialState,
        orders: mockOrdersArray,
        isLoading: true
      };
      const action = { type: getProfileOrders.rejected.type };
      const state = profileOrdersReducer(stateWithOrders, action);

      expect(state.orders).toEqual(mockOrdersArray);
    });

    it('должен заменить isError: false на isError: true', () => {
      const stateWithoutError = {
        ...initialState,
        isError: false,
        isLoading: true
      };
      const action = { type: getProfileOrders.rejected.type };
      const state = profileOrdersReducer(stateWithoutError, action);

      expect(state.isError).toBe(true);
    });
  });

  describe('интеграционные тесты', () => {
    it('должен корректно обрабатывать последовательность pending -> fulfilled', () => {
      const pendingState = profileOrdersReducer(initialState, {
        type: getProfileOrders.pending.type
      });
      expect(pendingState.isLoading).toBe(true);
      expect(pendingState.isError).toBe(false);
      expect(pendingState.orders).toEqual([]);

      const fulfilledState = profileOrdersReducer(pendingState, {
        type: getProfileOrders.fulfilled.type,
        payload: mockOrdersArray
      });
      expect(fulfilledState.isLoading).toBe(false);
      expect(fulfilledState.orders).toEqual(mockOrdersArray);
    });

    it('должен корректно обрабатывать последовательность pending -> rejected', () => {
      const pendingState = profileOrdersReducer(initialState, {
        type: getProfileOrders.pending.type
      });
      expect(pendingState.isLoading).toBe(true);
      expect(pendingState.isError).toBe(false);

      const rejectedState = profileOrdersReducer(pendingState, {
        type: getProfileOrders.rejected.type
      });
      expect(rejectedState.isLoading).toBe(false);
      expect(rejectedState.isError).toBe(true);
    });

    it('должен корректно обрабатывать повторный запрос после ошибки', () => {
      const stateWithError = {
        ...initialState,
        isError: true
      };

      const pendingState = profileOrdersReducer(stateWithError, {
        type: getProfileOrders.pending.type
      });
      expect(pendingState.isLoading).toBe(true);
      expect(pendingState.isError).toBe(false);

      const fulfilledState = profileOrdersReducer(pendingState, {
        type: getProfileOrders.fulfilled.type,
        payload: mockOrdersArray
      });
      expect(fulfilledState.isLoading).toBe(false);
      expect(fulfilledState.orders).toEqual(mockOrdersArray);
    });
  });
});
