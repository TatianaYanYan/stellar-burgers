import feedReducer, {
  getFeeds,
  getOrderByNumber,
  clearOrderData
} from '../feed';
import { mockOrder, mockOrdersArray } from './__fixtures__/ingredients';

describe('feed reducer', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    orderData: null,
    isLoading: false,
    isError: false
  };

  it('должен возвращать начальное состояние', () => {
    expect(feedReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('getFeeds.pending', () => {
    it('должен установить isLoading в true', () => {
      const action = { type: getFeeds.pending.type };
      const state = feedReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('должен сбросить isError в false', () => {
      const stateWithError = {
        ...initialState,
        isError: true
      };
      const action = { type: getFeeds.pending.type };
      const state = feedReducer(stateWithError, action);

      expect(state.isError).toBe(false);
    });

    it('должен установить isLoading в true и isError в false одновременно', () => {
      const stateWithError = {
        ...initialState,
        isError: true,
        isLoading: false
      };
      const action = { type: getFeeds.pending.type };
      const state = feedReducer(stateWithError, action);

      expect(state.isLoading).toBe(true);
      expect(state.isError).toBe(false);
    });
  });

  describe('getFeeds.fulfilled', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: getFeeds.fulfilled.type,
        payload: {
          orders: mockOrdersArray,
          total: 1000,
          totalToday: 50
        }
      };
      const state = feedReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен записать orders в стор', () => {
      const action = {
        type: getFeeds.fulfilled.type,
        payload: {
          orders: mockOrdersArray,
          total: 1000,
          totalToday: 50
        }
      };
      const state = feedReducer(initialState, action);

      expect(state.orders).toEqual(mockOrdersArray);
      expect(state.orders).toHaveLength(2);
    });

    it('должен записать total в стор', () => {
      const action = {
        type: getFeeds.fulfilled.type,
        payload: {
          orders: mockOrdersArray,
          total: 1000,
          totalToday: 50
        }
      };
      const state = feedReducer(initialState, action);

      expect(state.total).toBe(1000);
    });

    it('должен записать totalToday в стор', () => {
      const action = {
        type: getFeeds.fulfilled.type,
        payload: {
          orders: mockOrdersArray,
          total: 1000,
          totalToday: 50
        }
      };
      const state = feedReducer(initialState, action);

      expect(state.totalToday).toBe(50);
    });

    it('должен установить все значения одновременно', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: getFeeds.fulfilled.type,
        payload: {
          orders: mockOrdersArray,
          total: 1000,
          totalToday: 50
        }
      };
      const state = feedReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockOrdersArray);
      expect(state.total).toBe(1000);
      expect(state.totalToday).toBe(50);
    });

    it('должен заменить существующие заказы новыми', () => {
      const stateWithOldData = {
        ...initialState,
        orders: [mockOrder],
        total: 500,
        totalToday: 25,
        isLoading: true
      };
      const action = {
        type: getFeeds.fulfilled.type,
        payload: {
          orders: mockOrdersArray,
          total: 1000,
          totalToday: 50
        }
      };
      const state = feedReducer(stateWithOldData, action);

      expect(state.orders).toEqual(mockOrdersArray);
      expect(state.total).toBe(1000);
      expect(state.totalToday).toBe(50);
    });

    it('должен корректно записать пустой массив заказов', () => {
      const action = {
        type: getFeeds.fulfilled.type,
        payload: {
          orders: [],
          total: 0,
          totalToday: 0
        }
      };
      const state = feedReducer(initialState, action);

      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.totalToday).toBe(0);
    });
  });

  describe('getFeeds.rejected', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = { type: getFeeds.rejected.type };
      const state = feedReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен установить isError в true', () => {
      const action = { type: getFeeds.rejected.type };
      const state = feedReducer(initialState, action);

      expect(state.isError).toBe(true);
    });

    it('должен установить isLoading в false и isError в true одновременно', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = { type: getFeeds.rejected.type };
      const state = feedReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
    });

    it('не должен изменять orders, total и totalToday при ошибке', () => {
      const stateWithData = {
        ...initialState,
        orders: mockOrdersArray,
        total: 1000,
        totalToday: 50,
        isLoading: true
      };
      const action = { type: getFeeds.rejected.type };
      const state = feedReducer(stateWithData, action);

      expect(state.orders).toEqual(mockOrdersArray);
      expect(state.total).toBe(1000);
      expect(state.totalToday).toBe(50);
    });
  });

  describe('getOrderByNumber.pending', () => {
    it('должен установить isLoading в true', () => {
      const action = { type: getOrderByNumber.pending.type };
      const state = feedReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('должен сбросить isError в false', () => {
      const stateWithError = {
        ...initialState,
        isError: true
      };
      const action = { type: getOrderByNumber.pending.type };
      const state = feedReducer(stateWithError, action);

      expect(state.isError).toBe(false);
    });

    it('должен установить isLoading в true и isError в false одновременно', () => {
      const stateWithError = {
        ...initialState,
        isError: true,
        isLoading: false
      };
      const action = { type: getOrderByNumber.pending.type };
      const state = feedReducer(stateWithError, action);

      expect(state.isLoading).toBe(true);
      expect(state.isError).toBe(false);
    });
  });

  describe('getOrderByNumber.fulfilled', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = feedReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен записать orderData в стор', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = feedReducer(initialState, action);

      expect(state.orderData).toEqual(mockOrder);
    });

    it('должен установить isLoading в false и записать orderData одновременно', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = feedReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
      expect(state.orderData).toEqual(mockOrder);
    });

    it('должен заменить предыдущий orderData новым', () => {
      const stateWithOldData = {
        ...initialState,
        orderData: { ...mockOrder, number: 99999 },
        isLoading: true
      };
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = feedReducer(stateWithOldData, action);

      expect(state.orderData?.number).toBe(12345);
    });

    it('не должен изменять orders, total и totalToday', () => {
      const stateWithData = {
        ...initialState,
        orders: mockOrdersArray,
        total: 1000,
        totalToday: 50,
        isLoading: true
      };
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = feedReducer(stateWithData, action);

      expect(state.orders).toEqual(mockOrdersArray);
      expect(state.total).toBe(1000);
      expect(state.totalToday).toBe(50);
    });
  });

  describe('getOrderByNumber.rejected', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = { type: getOrderByNumber.rejected.type };
      const state = feedReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен установить isError в true', () => {
      const action = { type: getOrderByNumber.rejected.type };
      const state = feedReducer(initialState, action);

      expect(state.isError).toBe(true);
    });

    it('должен установить isLoading в false и isError в true одновременно', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = { type: getOrderByNumber.rejected.type };
      const state = feedReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
    });

    it('не должен изменять orderData при ошибке', () => {
      const stateWithData = {
        ...initialState,
        orderData: mockOrder,
        isLoading: true
      };
      const action = { type: getOrderByNumber.rejected.type };
      const state = feedReducer(stateWithData, action);

      expect(state.orderData).toEqual(mockOrder);
    });
  });

  describe('clearOrderData', () => {
    it('должен очистить orderData', () => {
      const stateWithData = {
        ...initialState,
        orderData: mockOrder
      };
      const action = clearOrderData();
      const state = feedReducer(stateWithData, action);

      expect(state.orderData).toBeNull();
    });

    it('не должен изменять другие поля', () => {
      const stateWithData = {
        ...initialState,
        orderData: mockOrder,
        orders: mockOrdersArray,
        total: 1000,
        totalToday: 50,
        isLoading: true,
        isError: true
      };
      const action = clearOrderData();
      const state = feedReducer(stateWithData, action);

      expect(state.orderData).toBeNull();
      expect(state.orders).toEqual(mockOrdersArray);
      expect(state.total).toBe(1000);
      expect(state.totalToday).toBe(50);
      expect(state.isLoading).toBe(true);
      expect(state.isError).toBe(true);
    });
  });

  describe('интеграционные тесты', () => {
    it('должен корректно обрабатывать последовательность getFeeds: pending -> fulfilled', () => {
      const pendingState = feedReducer(initialState, {
        type: getFeeds.pending.type
      });
      expect(pendingState.isLoading).toBe(true);
      expect(pendingState.isError).toBe(false);

      const fulfilledState = feedReducer(pendingState, {
        type: getFeeds.fulfilled.type,
        payload: {
          orders: mockOrdersArray,
          total: 1000,
          totalToday: 50
        }
      });
      expect(fulfilledState.isLoading).toBe(false);
      expect(fulfilledState.orders).toEqual(mockOrdersArray);
      expect(fulfilledState.total).toBe(1000);
    });

    it('должен корректно обрабатывать последовательность getOrderByNumber: pending -> fulfilled -> clearOrderData', () => {
      const pendingState = feedReducer(initialState, {
        type: getOrderByNumber.pending.type
      });
      expect(pendingState.isLoading).toBe(true);

      const fulfilledState = feedReducer(pendingState, {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder
      });
      expect(fulfilledState.orderData).toEqual(mockOrder);

      const clearedState = feedReducer(fulfilledState, clearOrderData());
      expect(clearedState.orderData).toBeNull();
    });
  });
});
