import userReducer, {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logout,
  setAuthChecked
} from '../user';
import { mockUser, mockUserUpdated } from './__fixtures__/ingredients';

describe('user reducer', () => {
  const initialState = {
    user: null,
    isLoading: false,
    error: null,
    isAuthChecked: false
  };

  it('должен возвращать начальное состояние', () => {
    expect(userReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('setAuthChecked', () => {
    it('должен установить isAuthChecked в true', () => {
      const action = setAuthChecked(true);
      const state = userReducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
    });

    it('должен установить isAuthChecked в false', () => {
      const stateWithAuthChecked = {
        ...initialState,
        isAuthChecked: true
      };
      const action = setAuthChecked(false);
      const state = userReducer(stateWithAuthChecked, action);

      expect(state.isAuthChecked).toBe(false);
    });

    it('не должен изменять другие поля', () => {
      const stateWithData = {
        ...initialState,
        user: mockUser,
        isLoading: true,
        error: 'Ошибка'
      };
      const action = setAuthChecked(true);
      const state = userReducer(stateWithData, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe('Ошибка');
    });
  });

  describe('registerUser.pending', () => {
    it('должен установить isLoading в true', () => {
      const action = { type: registerUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('должен сбросить error в null', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };
      const action = { type: registerUser.pending.type };
      const state = userReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });

    it('должен установить isLoading в true и error в null одновременно', () => {
      const stateWithError = {
        ...initialState,
        error: 'Ошибка',
        isLoading: false
      };
      const action = { type: registerUser.pending.type };
      const state = userReducer(stateWithError, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('registerUser.fulfilled', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен записать пользователя в стор', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
    });

    it('должен сбросить error в null', () => {
      const stateWithError = {
        ...initialState,
        error: 'Старая ошибка',
        isLoading: true
      };
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });

    it('должен установить все значения одновременно', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true,
        error: 'Ошибка'
      };
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeNull();
    });
  });

  describe('registerUser.rejected', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: registerUser.rejected.type,
        error: { message: 'Ошибка регистрации' }
      };
      const state = userReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен записать сообщение об ошибке в error', () => {
      const action = {
        type: registerUser.rejected.type,
        error: { message: 'Email уже используется' }
      };
      const state = userReducer(initialState, action);

      expect(state.error).toBe('Email уже используется');
    });

    it('должен установить дефолтное сообщение об ошибке', () => {
      const action = {
        type: registerUser.rejected.type,
        error: {}
      };
      const state = userReducer(initialState, action);

      expect(state.error).toBe('Ошибка регистрации');
    });
  });

  describe('loginUser.pending', () => {
    it('должен установить isLoading в true', () => {
      const action = { type: loginUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('должен сбросить error в null', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };
      const action = { type: loginUser.pending.type };
      const state = userReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });

  describe('loginUser.fulfilled', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен записать пользователя в стор', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
    });

    it('должен сбросить error в null', () => {
      const stateWithError = {
        ...initialState,
        error: 'Старая ошибка',
        isLoading: true
      };
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });

    it('должен установить все значения одновременно', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true,
        error: 'Ошибка'
      };
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeNull();
    });
  });

  describe('loginUser.rejected', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: loginUser.rejected.type,
        error: { message: 'Неверный пароль' }
      };
      const state = userReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен записать сообщение об ошибке в error', () => {
      const action = {
        type: loginUser.rejected.type,
        error: { message: 'Неверный пароль' }
      };
      const state = userReducer(initialState, action);

      expect(state.error).toBe('Неверный пароль');
    });

    it('должен установить дефолтное сообщение об ошибке', () => {
      const action = {
        type: loginUser.rejected.type,
        error: {}
      };
      const state = userReducer(initialState, action);

      expect(state.error).toBe('Ошибка авторизации');
    });
  });

  describe('getUser.pending', () => {
    it('должен установить isLoading в true', () => {
      const action = { type: getUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('должен сбросить error в null', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };
      const action = { type: getUser.pending.type };
      const state = userReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });

  describe('getUser.fulfilled', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен записать пользователя в стор', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
    });

    it('должен сбросить error в null', () => {
      const stateWithError = {
        ...initialState,
        error: 'Старая ошибка',
        isLoading: true
      };
      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });

  describe('getUser.rejected', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: getUser.rejected.type,
        error: { message: 'Не авторизован' }
      };
      const state = userReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен записать сообщение об ошибке в error', () => {
      const action = {
        type: getUser.rejected.type,
        error: { message: 'Не авторизован' }
      };
      const state = userReducer(initialState, action);

      expect(state.error).toBe('Не авторизован');
    });

    it('должен установить дефолтное сообщение об ошибке', () => {
      const action = {
        type: getUser.rejected.type,
        error: {}
      };
      const state = userReducer(initialState, action);

      expect(state.error).toBe('Ошибка получения данных пользователя');
    });
  });

  describe('updateUser.pending', () => {
    it('должен установить isLoading в true', () => {
      const action = { type: updateUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('должен сбросить error в null', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };
      const action = { type: updateUser.pending.type };
      const state = userReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });

  describe('updateUser.fulfilled', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: updateUser.fulfilled.type,
        payload: mockUserUpdated
      };
      const state = userReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен обновить данные пользователя в сторе', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser
      };
      const action = {
        type: updateUser.fulfilled.type,
        payload: mockUserUpdated
      };
      const state = userReducer(stateWithUser, action);

      expect(state.user).toEqual(mockUserUpdated);
      expect(state.user?.email).toBe('updated@example.com');
    });

    it('должен сбросить error в null', () => {
      const stateWithError = {
        ...initialState,
        error: 'Старая ошибка',
        isLoading: true
      };
      const action = {
        type: updateUser.fulfilled.type,
        payload: mockUserUpdated
      };
      const state = userReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });

  describe('updateUser.rejected', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: updateUser.rejected.type,
        error: { message: 'Ошибка обновления' }
      };
      const state = userReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен записать сообщение об ошибке в error', () => {
      const action = {
        type: updateUser.rejected.type,
        error: { message: 'Ошибка обновления' }
      };
      const state = userReducer(initialState, action);

      expect(state.error).toBe('Ошибка обновления');
    });

    it('должен установить дефолтное сообщение об ошибке', () => {
      const action = {
        type: updateUser.rejected.type,
        error: {}
      };
      const state = userReducer(initialState, action);

      expect(state.error).toBe('Ошибка обновления данных пользователя');
    });
  });

  describe('logout.pending', () => {
    it('должен установить isLoading в true', () => {
      const action = { type: logout.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('должен сбросить error в null', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };
      const action = { type: logout.pending.type };
      const state = userReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });

  describe('logout.fulfilled', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = { type: logout.fulfilled.type };
      const state = userReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен очистить user (установить в null)', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser
      };
      const action = { type: logout.fulfilled.type };
      const state = userReducer(stateWithUser, action);

      expect(state.user).toBeNull();
    });

    it('должен сбросить error в null', () => {
      const stateWithError = {
        ...initialState,
        user: mockUser,
        error: 'Старая ошибка',
        isLoading: true
      };
      const action = { type: logout.fulfilled.type };
      const state = userReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });

    it('должен установить все значения одновременно', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isLoading: true,
        error: 'Ошибка'
      };
      const action = { type: logout.fulfilled.type };
      const state = userReducer(stateWithUser, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('logout.rejected', () => {
    it('должен установить isLoading в false', () => {
      const stateWithLoading = {
        ...initialState,
        isLoading: true
      };
      const action = {
        type: logout.rejected.type,
        error: { message: 'Ошибка выхода' }
      };
      const state = userReducer(stateWithLoading, action);

      expect(state.isLoading).toBe(false);
    });

    it('должен записать сообщение об ошибке в error', () => {
      const action = {
        type: logout.rejected.type,
        error: { message: 'Ошибка сети' }
      };
      const state = userReducer(initialState, action);

      expect(state.error).toBe('Ошибка сети');
    });

    it('должен установить дефолтное сообщение об ошибке', () => {
      const action = {
        type: logout.rejected.type,
        error: {}
      };
      const state = userReducer(initialState, action);

      expect(state.error).toBe('Ошибка при выходе');
    });
  });

  describe('интеграционные тесты', () => {
    it('должен корректно обрабатывать последовательность registerUser: pending -> fulfilled', () => {
      const pendingState = userReducer(initialState, {
        type: registerUser.pending.type
      });
      expect(pendingState.isLoading).toBe(true);
      expect(pendingState.error).toBeNull();

      const fulfilledState = userReducer(pendingState, {
        type: registerUser.fulfilled.type,
        payload: mockUser
      });
      expect(fulfilledState.isLoading).toBe(false);
      expect(fulfilledState.user).toEqual(mockUser);
      expect(fulfilledState.error).toBeNull();
    });

    it('должен корректно обрабатывать последовательность loginUser -> updateUser -> logout', () => {
      // Вход
      const loginState = userReducer(initialState, {
        type: loginUser.fulfilled.type,
        payload: mockUser
      });
      expect(loginState.user).toEqual(mockUser);

      // Обновление
      const updateState = userReducer(loginState, {
        type: updateUser.fulfilled.type,
        payload: mockUserUpdated
      });
      expect(updateState.user).toEqual(mockUserUpdated);

      // Выход
      const logoutState = userReducer(updateState, {
        type: logout.fulfilled.type
      });
      expect(logoutState.user).toBeNull();
    });

    it('должен корректно обрабатывать повторную авторизацию после ошибки', () => {
      // Ошибка входа
      const errorState = userReducer(initialState, {
        type: loginUser.rejected.type,
        error: { message: 'Неверный пароль' }
      });
      expect(errorState.error).toBe('Неверный пароль');

      // Повторная попытка
      const pendingState = userReducer(errorState, {
        type: loginUser.pending.type
      });
      expect(pendingState.error).toBeNull();

      // Успешный вход
      const fulfilledState = userReducer(pendingState, {
        type: loginUser.fulfilled.type,
        payload: mockUser
      });
      expect(fulfilledState.user).toEqual(mockUser);
      expect(fulfilledState.error).toBeNull();
    });
  });
});
