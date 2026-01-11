/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to intercept ingredients API call
       * @example cy.interceptIngredients()
       */
      interceptIngredients(): Chainable<void>;

      /**
       * Custom command to set auth tokens
       * @example cy.setAuthTokens()
       */
      setAuthTokens(): Chainable<void>;

      /**
       * Custom command to intercept user API call
       * @example cy.interceptUser()
       */
      interceptUser(): Chainable<void>;

      /**
       * Custom command to intercept order creation API call
       * @example cy.interceptOrder()
       */
      interceptOrder(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('interceptIngredients', () => {
  cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );
});

Cypress.Commands.add('setAuthTokens', () => {
  // Устанавливаем моковый accessToken в cookie
  cy.setCookie('accessToken', 'mock-access-token');

  // Устанавливаем моковый refreshToken в localStorage приложения
  cy.window().then((win) => {
    win.localStorage.setItem('refreshToken', 'mock-refresh-token');
  });
});

Cypress.Commands.add('interceptUser', () => {
  cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
    'getUser'
  );
});

Cypress.Commands.add('interceptOrder', () => {
  cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
    'createOrder'
  );
});

export {};
