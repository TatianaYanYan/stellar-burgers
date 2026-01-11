describe('Конструктор бургеров', () => {
  beforeEach(() => {
    // Перехватываем запрос на получение ингредиентов
    cy.interceptIngredients();

    // Посещаем главную страницу
    cy.visit('/');

    // Ждём, пока загрузятся ингредиенты
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов', () => {
    it('должно добавлять булку в конструктор', () => {
      // Находим булку "Краторная булка N-200i"
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .click();

      // Проверяем, что булка появилась в конструкторе (верх и низ)
      cy.contains('Краторная булка N-200i (верх)').should('be.visible');
      cy.contains('Краторная булка N-200i (низ)').should('be.visible');

      // Проверяем, что цена булки учтена в общей стоимости (булка считается дважды)
      cy.get('section').contains('1255').should('exist');
    });

    it('должно заменять булку при добавлении новой', () => {
      // Добавляем первую булку "Краторная булка N-200i"
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .click();

      // Проверяем, что первая булка добавлена
      cy.contains('Краторная булка N-200i (верх)').should('be.visible');

      // Добавляем вторую булку "Флюоресцентная булка R2-D3"
      cy.contains('Флюоресцентная булка R2-D3')
        .parents('li')
        .find('button')
        .click();

      // Проверяем, что вторая булка заменила первую
      cy.contains('Флюоресцентная булка R2-D3 (верх)').should('be.visible');
      cy.contains('Флюоресцентная булка R2-D3 (низ)').should('be.visible');

      // Проверяем, что первой булки больше нет
      cy.contains('Краторная булка N-200i (верх)').should('not.exist');
    });

    it('должно добавлять начинку в конструктор', () => {
      // Добавляем котлету "Биокотлета из марсианской Магнолии"
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('button')
        .click();

      // Проверяем, что котлета появилась в конструкторе
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');

      // Проверяем, что счётчик ингредиента увеличился
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('[class*="counter"]')
        .should('contain', '1');
    });

    it('должно добавлять несколько начинок в конструктор', () => {
      // Добавляем котлету
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('button')
        .click();

      // Добавляем филе
      cy.contains('Филе Люминесцентного тетраодонтимформа')
        .parents('li')
        .find('button')
        .click();

      // Добавляем соус
      cy.contains('Соус Spicy-X').parents('li').find('button').click();

      // Проверяем, что все ингредиенты добавлены
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
      cy.contains('Филе Люминесцентного тетраодонтимформа').should(
        'be.visible'
      );
      cy.contains('Соус Spicy-X').should('be.visible');

      // Проверяем счётчики
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('[class*="counter"]')
        .should('contain', '1');

      cy.contains('Филе Люминесцентного тетраодонтимформа')
        .parents('li')
        .find('[class*="counter"]')
        .should('contain', '1');

      cy.contains('Соус Spicy-X')
        .parents('li')
        .find('[class*="counter"]')
        .should('contain', '1');
    });

    it('должно добавлять один и тот же ингредиент несколько раз', () => {
      // Добавляем соус три раза
      cy.contains('Соус Spicy-X').parents('li').find('button').click();

      cy.contains('Соус Spicy-X').parents('li').find('button').click();

      cy.contains('Соус Spicy-X').parents('li').find('button').click();

      // Проверяем, что счётчик показывает 3
      cy.contains('Соус Spicy-X')
        .parents('li')
        .find('[class*="counter"]')
        .should('contain', '3');
    });

    it('должно правильно рассчитывать общую стоимость', () => {
      // Добавляем булку (1255 * 2 = 2510)
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .click();

      // Добавляем котлету (424)
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('button')
        .click();

      // Добавляем соус (90)
      cy.contains('Соус Spicy-X').parents('li').find('button').click();

      // Общая стоимость: 2510 + 424 + 90 = 3024
      cy.get('section').contains('3024').should('exist');
    });
  });

  describe('Отображение пустого конструктора', () => {
    it('должно показывать placeholder для булок', () => {
      // Проверяем, что есть два placeholder для булок (верх и низ)
      cy.get('[data-cy="bun-top-placeholder"]').should('be.visible');
      cy.get('[data-cy="bun-bottom-placeholder"]').should('be.visible');
    });

    it('должно показывать placeholder для начинки', () => {
      cy.get('[data-cy="ingredients-placeholder"]').should('be.visible');
    });

    it('должно иметь общую стоимость 0', () => {
      // Находим элемент с ценой
      cy.get('[data-cy="total-price"]').should('contain', '0');
    });
  });

  describe('Модальные окна ингредиентов', () => {
    it('должно открывать модальное окно при клике на ингредиент', () => {
      // Кликаем на ингредиент (на ссылку, не на кнопку "Добавить")
      cy.contains('Краторная булка N-200i').click();

      // Проверяем, что модальное окно открылось
      cy.get('[data-cy="modal"]').should('be.visible');

      // Проверяем, что в модальном окне отображается название ингредиента
      cy.get('[data-cy="modal"]')
        .contains('Краторная булка N-200i')
        .should('be.visible');

      // Проверяем, что отображаются детали ингредиента
      cy.get('[data-cy="modal"]').contains('Калории').should('be.visible');
      cy.get('[data-cy="modal"]').contains('Белки').should('be.visible');
      cy.get('[data-cy="modal"]').contains('Жиры').should('be.visible');
      cy.get('[data-cy="modal"]').contains('Углеводы').should('be.visible');
    });

    it('должно закрывать модальное окно по клику на крестик', () => {
      // Открываем модальное окно
      cy.contains('Биокотлета из марсианской Магнолии').click();

      // Проверяем, что модальное окно открылось
      cy.get('[data-cy="modal"]').should('be.visible');

      // Кликаем на кнопку закрытия (крестик)
      cy.get('[data-cy="modal-close-button"]').click();

      // Проверяем, что модальное окно закрылось
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('должно закрывать модальное окно по клику на оверлей', () => {
      // Открываем модальное окно
      cy.contains('Соус Spicy-X').click();

      // Проверяем, что модальное окно открылось
      cy.get('[data-cy="modal"]').should('be.visible');

      // Кликаем на оверлей (фон за модальным окном)
      cy.get('[data-cy="modal-overlay"]').click({ force: true });

      // Проверяем, что модальное окно закрылось
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('должно отображать корректные данные ингредиента в модальном окне', () => {
      // Открываем модальное окно с булкой
      cy.contains('Краторная булка N-200i').click();

      // Проверяем, что отображаются корректные данные из моковых данных
      cy.get('[data-cy="modal"]').within(() => {
        // Проверяем название
        cy.contains('Краторная булка N-200i').should('be.visible');

        // Проверяем калории
        cy.contains('420').should('be.visible');

        // Проверяем белки
        cy.contains('80').should('be.visible');

        // Проверяем жиры
        cy.contains('24').should('be.visible');

        // Проверяем углеводы
        cy.contains('53').should('be.visible');
      });

      // Закрываем модальное окно
      cy.get('[data-cy="modal-close-button"]').click();

      // Открываем модальное окно с соусом
      cy.contains('Соус Spicy-X').click();

      // Проверяем данные соуса
      cy.get('[data-cy="modal"]').within(() => {
        cy.contains('Соус Spicy-X').should('be.visible');
        cy.contains('30').should('be.visible'); // калории
      });
    });

    it('должно корректно обрабатывать последовательное открытие разных модальных окон', () => {
      // Открываем первое модальное окно
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-cy="modal"]')
        .contains('Краторная булка N-200i')
        .should('be.visible');

      // Закрываем его
      cy.get('[data-cy="modal-close-button"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');

      // Открываем второе модальное окно
      cy.contains('Филе Люминесцентного тетраодонтимформа').click();
      cy.get('[data-cy="modal"]')
        .contains('Филе Люминесцентного тетраодонтимформа')
        .should('be.visible');

      // Проверяем, что данные первого ингредиента не отображаются
      cy.get('[data-cy="modal"]')
        .contains('Краторная булка N-200i')
        .should('not.exist');
    });
  });
});
