import { rootReducer } from './rootReducer';

describe('rootReducer', () => {
  it('должен правильно инициализироваться с начальным состоянием', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState).toBeDefined();
    expect(typeof initialState).toBe('object');
  });

  it('должен содержать все необходимые слайсы', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('order');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('profileOrders');
  });

  it('должен инициализировать ingredients слайс с правильным начальным состоянием', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState.ingredients).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  it('должен инициализировать burgerConstructor слайс с правильным начальным состоянием', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('должен инициализировать order слайс с правильным начальным состоянием', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState.order).toEqual({
      order: null,
      orderName: '',
      isLoading: false,
      error: null
    });
  });

  it('должен инициализировать user слайс с правильным начальным состоянием', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState.user).toEqual({
      user: null,
      isLoading: false,
      error: null,
      isAuthChecked: false
    });
  });

  it('должен инициализировать feed слайс с правильным начальным состоянием', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState.feed).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      orderData: null,
      isLoading: false,
      isError: false
    });
  });

  it('должен инициализировать profileOrders слайс с правильным начальным состоянием', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState.profileOrders).toEqual({
      orders: [],
      isLoading: false,
      isError: false
    });
  });

  it('должен быть функцией', () => {
    expect(typeof rootReducer).toBe('function');
  });

  it('должен возвращать то же состояние при неизвестном экшене', () => {
    const currentState = rootReducer(undefined, { type: '@@INIT' });
    const newState = rootReducer(currentState, { type: 'UNKNOWN_ACTION' });

    // Redux Toolkit возвращает тот же объект, если состояние не изменилось, для оптимизации
    expect(newState).toEqual(currentState);
    expect(newState).toBe(currentState);
  });

  it('должен иметь правильную структуру состояния со всеми ключами', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const expectedKeys = [
      'ingredients',
      'burgerConstructor',
      'order',
      'user',
      'feed',
      'profileOrders'
    ];

    expect(Object.keys(initialState).sort()).toEqual(expectedKeys.sort());
  });
});
