import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../burgerConstructor';
import {
  mockBun,
  mockBun2,
  mockSauce,
  mockMain,
  mockMain2
} from './__fixtures__/ingredients';

describe('burgerConstructor reducer', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  it('должен возвращать начальное состояние', () => {
    expect(burgerConstructorReducer(undefined, { type: '@@INIT' })).toEqual(
      initialState
    );
  });

  describe('обработка экшена добавления ингредиента', () => {
    it('должен добавить булку', () => {
      const action = addIngredient(mockBun);
      const state = burgerConstructorReducer(initialState, action);

      expect(state.bun).toBeDefined();
      expect(state.bun?.type).toBe('bun');
      expect(state.bun?.name).toBe('Флюоресцентная булка R2-D3');
      expect(state.bun?._id).toBe('1');
      expect(state.bun?.id).toBeDefined(); // должен быть сгенерирован id
      expect(state.ingredients).toHaveLength(0);
    });

    it('должен заменить булку при добавлении новой', () => {
      const stateWithBun = {
        bun: { ...mockBun, id: 'old-bun-id' },
        ingredients: []
      };

      const action = addIngredient(mockBun2);
      const state = burgerConstructorReducer(stateWithBun, action);

      expect(state.bun?.name).toBe('Краторная булка N-200i');
      expect(state.bun?._id).toBe('5');
      expect(state.bun?.id).not.toBe('old-bun-id');
    });

    it('должен добавить соус в массив ингредиентов', () => {
      const action = addIngredient(mockSauce);
      const state = burgerConstructorReducer(initialState, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].type).toBe('sauce');
      expect(state.ingredients[0].name).toBe('Соус Spicy-X');
      expect(state.ingredients[0].id).toBeDefined();
      expect(state.bun).toBeNull();
    });

    it('должен добавить основной ингредиент в массив ингредиентов', () => {
      const action = addIngredient(mockMain);
      const state = burgerConstructorReducer(initialState, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].type).toBe('main');
      expect(state.ingredients[0].name).toBe(
        'Биокотлета из марсианской Магнолии'
      );
      expect(state.ingredients[0].id).toBeDefined();
      expect(state.bun).toBeNull();
    });

    it('должен добавить несколько ингредиентов', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockSauce)
      );
      state = burgerConstructorReducer(state, addIngredient(mockMain));
      state = burgerConstructorReducer(state, addIngredient(mockMain2));

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0].name).toBe('Соус Spicy-X');
      expect(state.ingredients[1].name).toBe(
        'Биокотлета из марсианской Магнолии'
      );
      expect(state.ingredients[2].name).toBe(
        'Мясо бессмертных моллюсков Protostomia'
      );
    });

    it('должен генерировать уникальный id для каждого добавленного ингредиента', () => {
      let state = burgerConstructorReducer(
        initialState,
        addIngredient(mockSauce)
      );
      state = burgerConstructorReducer(state, addIngredient(mockSauce));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).toBeDefined();
      expect(state.ingredients[1].id).toBeDefined();
      expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
    });
  });

  describe('обработка экшена удаления ингредиента', () => {
    it('должен удалить ингредиент по id', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockSauce, id: 'sauce-id-1' },
          { ...mockMain, id: 'main-id-1' },
          { ...mockMain2, id: 'main-id-2' }
        ]
      };

      const action = removeIngredient('main-id-1');
      const state = burgerConstructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toHaveLength(2);
      expect(
        state.ingredients.find((item) => item.id === 'main-id-1')
      ).toBeUndefined();
      expect(state.ingredients[0].id).toBe('sauce-id-1');
      expect(state.ingredients[1].id).toBe('main-id-2');
    });

    it('должен удалить первый ингредиент из списка', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockSauce, id: 'sauce-id-1' },
          { ...mockMain, id: 'main-id-1' }
        ]
      };

      const action = removeIngredient('sauce-id-1');
      const state = burgerConstructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe('main-id-1');
    });

    it('должен удалить последний ингредиент из списка', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockSauce, id: 'sauce-id-1' },
          { ...mockMain, id: 'main-id-1' }
        ]
      };

      const action = removeIngredient('main-id-1');
      const state = burgerConstructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe('sauce-id-1');
    });

    it('не должен изменять состояние при удалении несуществующего id', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockSauce, id: 'sauce-id-1' },
          { ...mockMain, id: 'main-id-1' }
        ]
      };

      const action = removeIngredient('non-existent-id');
      const state = burgerConstructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients).toEqual(stateWithIngredients.ingredients);
    });
  });

  describe('обработка экшена изменения порядка ингредиентов', () => {
    it('должен переместить ингредиент вниз (с индекса 0 на индекс 2)', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockSauce, id: 'sauce-id-1' },
          { ...mockMain, id: 'main-id-1' },
          { ...mockMain2, id: 'main-id-2' }
        ]
      };

      const action = moveIngredient({ fromIndex: 0, toIndex: 2 });
      const state = burgerConstructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0].id).toBe('main-id-1');
      expect(state.ingredients[1].id).toBe('main-id-2');
      expect(state.ingredients[2].id).toBe('sauce-id-1');
    });

    it('должен переместить ингредиент вверх (с индекса 2 на индекс 0)', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockSauce, id: 'sauce-id-1' },
          { ...mockMain, id: 'main-id-1' },
          { ...mockMain2, id: 'main-id-2' }
        ]
      };

      const action = moveIngredient({ fromIndex: 2, toIndex: 0 });
      const state = burgerConstructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0].id).toBe('main-id-2');
      expect(state.ingredients[1].id).toBe('sauce-id-1');
      expect(state.ingredients[2].id).toBe('main-id-1');
    });

    it('должен переместить ингредиент на одну позицию вниз', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockSauce, id: 'sauce-id-1' },
          { ...mockMain, id: 'main-id-1' },
          { ...mockMain2, id: 'main-id-2' }
        ]
      };

      const action = moveIngredient({ fromIndex: 0, toIndex: 1 });
      const state = burgerConstructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0].id).toBe('main-id-1');
      expect(state.ingredients[1].id).toBe('sauce-id-1');
      expect(state.ingredients[2].id).toBe('main-id-2');
    });

    it('должен переместить ингредиент на одну позицию вверх', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockSauce, id: 'sauce-id-1' },
          { ...mockMain, id: 'main-id-1' },
          { ...mockMain2, id: 'main-id-2' }
        ]
      };

      const action = moveIngredient({ fromIndex: 1, toIndex: 0 });
      const state = burgerConstructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0].id).toBe('main-id-1');
      expect(state.ingredients[1].id).toBe('sauce-id-1');
      expect(state.ingredients[2].id).toBe('main-id-2');
    });

    it('не должен изменять порядок при перемещении элемента на его же позицию', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockSauce, id: 'sauce-id-1' },
          { ...mockMain, id: 'main-id-1' }
        ]
      };

      const action = moveIngredient({ fromIndex: 0, toIndex: 0 });
      const state = burgerConstructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).toBe('sauce-id-1');
      expect(state.ingredients[1].id).toBe('main-id-1');
    });
  });

  describe('дополнительные тесты', () => {
    it('должен очистить конструктор (clearConstructor)', () => {
      const stateWithData = {
        bun: { ...mockBun, id: 'bun-id' },
        ingredients: [
          { ...mockSauce, id: 'sauce-id-1' },
          { ...mockMain, id: 'main-id-1' }
        ]
      };

      const action = clearConstructor();
      const state = burgerConstructorReducer(stateWithData, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
      expect(state).toEqual(initialState);
    });

    it('не должен изменять булку при удалении ингредиентов', () => {
      const stateWithData = {
        bun: { ...mockBun, id: 'bun-id' },
        ingredients: [{ ...mockSauce, id: 'sauce-id-1' }]
      };

      const action = removeIngredient('sauce-id-1');
      const state = burgerConstructorReducer(stateWithData, action);

      expect(state.bun).toEqual(stateWithData.bun);
      expect(state.ingredients).toHaveLength(0);
    });

    it('не должен изменять булку при перемещении ингредиентов', () => {
      const stateWithData = {
        bun: { ...mockBun, id: 'bun-id' },
        ingredients: [
          { ...mockSauce, id: 'sauce-id-1' },
          { ...mockMain, id: 'main-id-1' }
        ]
      };

      const action = moveIngredient({ fromIndex: 0, toIndex: 1 });
      const state = burgerConstructorReducer(stateWithData, action);

      expect(state.bun).toEqual(stateWithData.bun);
    });
  });
});
