describe('Создание заказа', () => {
  beforeEach(() => {
    // Перехватываем все необходимые запросы
    cy.interceptIngredients();
    cy.interceptUser();
    cy.interceptOrder();

    // Посещаем главную страницу
    cy.visit('/');

    // Ждём загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Очищаем localStorage и cookies после каждого теста
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('Создание заказа авторизованным пользователем', () => {
    beforeEach(() => {
      // Устанавливаем токены авторизации и перезагружаем страницу
      cy.setAuthTokens();
      cy.reload();
      cy.wait('@getIngredients');
      cy.wait('@getUser');
    });

    it('должно создавать заказ с булкой и начинкой', () => {
      // Собираем бургер: добавляем булку
      cy.contains('Флюоресцентная булка R2-D3')
        .parents('li')
        .find('button')
        .click();

      // Добавляем соус
      cy.contains('Соус Spicy-X').parents('li').find('button').click();

      // Добавляем котлету
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('button')
        .click();

      // Проверяем, что ингредиенты добавлены в конструктор
      cy.contains('Флюоресцентная булка R2-D3 (верх)').should('be.visible');
      cy.contains('Соус Spicy-X').should('be.visible');
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
      cy.contains('Флюоресцентная булка R2-D3 (низ)').should('be.visible');

      // Кликаем на кнопку "Оформить заказ"
      cy.contains('Оформить заказ').click();

      // Ждём выполнения запроса на создание заказа
      cy.wait('@createOrder');

      // Проверяем, что модальное окно с деталями заказа открылось
      cy.get('[data-cy="modal"]').should('be.visible');

      // Проверяем, что номер заказа отображается корректно
      cy.get('[data-cy="modal"]').contains('12345').should('be.visible');

      // Проверяем, что отображается текст "идентификатор заказа"
      cy.get('[data-cy="modal"]')
        .contains('идентификатор заказа')
        .should('be.visible');

      // Закрываем модальное окно по клику на крестик
      cy.get('[data-cy="modal-close-button"]').click();

      // Проверяем, что модальное окно закрылось
      cy.get('[data-cy="modal"]').should('not.exist');

      // Проверяем, что конструктор пуст
      cy.get('[data-cy="bun-top-placeholder"]').should('be.visible');
      cy.get('[data-cy="bun-bottom-placeholder"]').should('be.visible');
      cy.get('[data-cy="ingredients-placeholder"]').should('be.visible');
    });

    it('должно создавать заказ только с булкой', () => {
      // Добавляем только булку
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .click();

      // Проверяем, что булка добавлена
      cy.contains('Краторная булка N-200i (верх)').should('be.visible');
      cy.contains('Краторная булка N-200i (низ)').should('be.visible');

      // Кликаем на кнопку "Оформить заказ"
      cy.contains('Оформить заказ').click();

      // Ждём выполнения запроса
      cy.wait('@createOrder');

      // Проверяем, что модальное окно открылось
      cy.get('[data-cy="modal"]').should('be.visible');

      // Проверяем номер заказа
      cy.get('[data-cy="modal"]').contains('12345').should('be.visible');
    });

    it('должно закрывать модальное окно заказа по клику на оверлей', () => {
      // Собираем бургер
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .click();

      cy.contains('Соус фирменный Space Sauce')
        .parents('li')
        .find('button')
        .click();

      // Оформляем заказ
      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');

      // Проверяем, что модальное окно открылось
      cy.get('[data-cy="modal"]').should('be.visible');

      // Закрываем по клику на оверлей
      cy.get('[data-cy="modal-overlay"]').click({ force: true });

      // Проверяем, что модальное окно закрылось
      cy.get('[data-cy="modal"]').should('not.exist');

      // Проверяем, что конструктор очистился
      cy.get('[data-cy="bun-top-placeholder"]').should('be.visible');
      cy.get('[data-cy="bun-bottom-placeholder"]').should('be.visible');
      cy.get('[data-cy="ingredients-placeholder"]').should('be.visible');
    });

    it('должно отображать процесс создания заказа', () => {
      // Перехватываем запрос с задержкой для этого теста
      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json',
        delay: 1000
      }).as('createOrderDelayed');

      // Собираем бургер
      cy.contains('Флюоресцентная булка R2-D3')
        .parents('li')
        .find('button')
        .click();

      cy.contains('Филе Люминесцентного тетраодонтимформа')
        .parents('li')
        .find('button')
        .click();

      // Кликаем на кнопку оформления заказа
      cy.contains('Оформить заказ').click();

      // Проверяем, что появилось модальное окно с текстом "Оформляем заказ..."
      cy.get('[data-cy="modal"]')
        .contains('Оформляем заказ...')
        .should('exist');

      // Ждём завершения запроса
      cy.wait('@createOrderDelayed');

      // Проверяем, что отображается номер заказа
      cy.get('[data-cy="modal"]').contains('12345').should('be.visible');
    });

    it('должно создавать несколько заказов подряд', () => {
      // Первый заказ
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .click();
      cy.contains('Соус Spicy-X').parents('li').find('button').click();
      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="modal-close-button"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');

      // Проверяем, что конструктор пуст
      cy.get('[data-cy="bun-top-placeholder"]').should('be.visible');
      cy.get('[data-cy="bun-bottom-placeholder"]').should('be.visible');

      // Второй заказ
      cy.contains('Флюоресцентная булка R2-D3')
        .parents('li')
        .find('button')
        .click();
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('button')
        .click();
      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="modal"]').contains('12345').should('be.visible');
    });
  });

  describe('Попытка создания заказа без авторизации', () => {
    it('должно перенаправлять на страницу логина при попытке оформить заказ', () => {
      // Собираем бургер
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .click();

      cy.contains('Соус Spicy-X').parents('li').find('button').click();

      // Пытаемся оформить заказ без авторизации
      cy.contains('Оформить заказ').click();

      // Проверяем, что произошёл редирект на страницу логина
      cy.url().should('include', '/login');
    });

    it('не должно создавать заказ без булки', () => {
      // Устанавливаем токены и перезагружаем страницу
      cy.setAuthTokens();
      cy.reload();
      cy.wait('@getIngredients');
      cy.wait('@getUser');

      // Добавляем только начинку без булки
      cy.contains('Соус Spicy-X').parents('li').find('button').click();
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('button')
        .click();

      // Проверяем, что кнопка "Оформить заказ" не активна или клик не срабатывает
      // (в конструкторе есть проверка на наличие булки)
      cy.contains('Оформить заказ').click();

      // Проверяем, что модальное окно НЕ открылось (запрос не отправился)
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });

  describe('Проверка данных запроса на создание заказа', () => {
    it('должно отправлять корректные ID ингредиентов', () => {
      // Устанавливаем токены и перезагружаем страницу
      cy.setAuthTokens();
      cy.reload();
      cy.wait('@getIngredients');
      cy.wait('@getUser');

      // Собираем бургер с известными ID из fixtures
      // Флюоресцентная булка R2-D3: 643d69a5c3f7b9001cfa093d
      cy.contains('Флюоресцентная булка R2-D3')
        .parents('li')
        .find('button')
        .click();

      // Соус Spicy-X: 643d69a5c3f7b9001cfa0942
      cy.contains('Соус Spicy-X').parents('li').find('button').click();

      // Биокотлета: 643d69a5c3f7b9001cfa0941
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('button')
        .click();

      // Оформляем заказ
      cy.contains('Оформить заказ').click();

      // Проверяем, что запрос содержит правильные ингредиенты
      cy.wait('@createOrder')
        .its('request.body')
        .should('deep.equal', {
          ingredients: [
            '643d69a5c3f7b9001cfa093d', // булка (верх)
            '643d69a5c3f7b9001cfa0942', // соус
            '643d69a5c3f7b9001cfa0941', // котлета
            '643d69a5c3f7b9001cfa093d' // булка (низ)
          ]
        });
    });
  });
});
