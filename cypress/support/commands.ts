// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Useful WC flows
// https://github.com/woocommerce/woocommerce/blob/master/tests/e2e-tests/utils/flows.js
//

declare namespace Cypress {
  interface Chainable {
    login(): void
    installwc4(): void
    installwc42(): void
    installwc3(): void
  }
}


Cypress.Commands.add("login", () => {
  cy.visit("/wp-login.php");
  cy.get("#user_login").clear();
  cy.wait(50);
  cy.get("#user_login")
    .focus()
    .type("admin");
  cy.get("#user_pass").clear();
  cy.wait(50);
  cy.get("#user_pass")
    .focus()
    .type("password");
  cy.get("#wp-submit").click();
  cy.wait(1000);
});

// Install for WooCommerce 4
Cypress.Commands.add("installwc4", () => {
  cy.login();
  cy.visit("/wp-admin");

  // Skip to woocommerce page (debug method)
  // cy.get("a")
  //   .contains("WooCommerce")
  //   .click();

  // Start setup wizard
  cy.get("a")
    .contains("Run the Setup Wizard")
    .click();
  cy.get(".button-primary").click();

  // Enter address and close popup
  cy.get("button")
    .contains("Continue")
    .click();
  cy.get(".woocommerce-profile-wizard__usage-wrapper > .components-button")
    .contains("Continue")
    .click();
  cy.get("button")
    .contains("Continue")
    .click();

  // Select Industry
  cy.get("#inspector-checkbox-control-3").check();
  cy.get("button")
    .contains("Continue")
    .click();

  // Select product type
  cy.get("#inspector-checkbox-control-10").check();
  cy.get("button")
    .contains("Continue")
    .click();

  cy.get("#woocommerce-select-control-1__control-input").click({ force: true });
  cy.get("button")
    .contains("1 - 10")
    .click();
  cy.get("#woocommerce-select-control-2__control-input").click({ force: true });
  cy.get("button")
    .contains("No")
    .click();
  cy.get("input.components-form-toggle__input").click({ multiple: true });
  cy.get("button")
    .contains("Continue")
    .click();

  // Setup template
  cy.get("button")
    .contains("Continue with my active theme")
    .click();

  // Disable jetpack
  cy.contains("No thanks").click();

  // Kill modal
  // cy.contains("Continue").click();
  cy.get(
    ".woocommerce-task-dashboard__welcome-modal-wrapper > .components-button"
  ).click();

  // Setup shipping
  cy.contains("Set up shipping").click();
  cy.contains("Continue").click();
  cy.contains("Proceed").click();
  cy.contains("No thanks").click();
});

// Install for WooCommerce 4.2
Cypress.Commands.add("installwc42", () => {
  cy.login();
  cy.visit("/wp-admin/admin.php?page=wc-setup");

  // Start setup wizard
  cy.get("button")
    .contains("Yes please")
    .click();

  // Enter address and close popup
  cy.wait(1000);
  cy.get("button.components-button")
    .contains("Continue")
    .click();
  cy.wait(1000);
  cy.get(".components-modal__screen-overlay button")
    .contains("Continue")
    .click();

  // Select Industry
  cy.get("#inspector-checkbox-control-3").check();
  cy.get("button")
    .contains("Continue")
    .click();

  // Select product type
  cy.get("#inspector-checkbox-control-10").check();
  cy.get("button")
    .contains("Continue")
    .click();

  cy.get("#woocommerce-select-control-1__control-input").click({ force: true });
  cy.get("button")
    .contains("1 - 10")
    .click();
  cy.get("#woocommerce-select-control-2__control-input").click({ force: true });
  cy.get("button")
    .contains("No")
    .click();
  cy.get("input.components-form-toggle__input").click({ multiple: true });
  cy.get("button")
    .contains("Continue")
    .click();

  // Setup template
  cy.get("button")
    .contains("Continue with my active theme")
    .click();

  // Disable jetpack
  cy.contains("No thanks").click();

  // Kill modal
  cy.get(
    ".woocommerce-task-dashboard__welcome-modal-wrapper > .components-button"
  ).click();

  // Setup shipping
  cy.contains("Set up shipping").click();
  cy.contains("Continue").click();
  cy.contains("Proceed").click();
  cy.contains("No thanks").click();
});

// Install for WooCommerce 3
Cypress.Commands.add("installwc3", () => {
  cy.login();
  cy.visit("/wp-admin");
  cy.get("a")
    .contains("Run the Setup Wizard")
    .click();
  cy.get(".button-primary").click();
  cy.get("button")
    .contains("Continue")
    .click();
  cy.get("button")
    .contains("Continue")
    .click();
  cy.get(".flat_rate > input").each(input => {
    cy.wait(50);
    cy.wrap(input)
      .focus()
      .type("0");
  });
  cy.get("button[name='save_step']")
    .contains("Continue")
    .click();
  cy.get("button[name='save_step']")
    .contains("Continue")
    .click();
  cy.get("a")
    .contains("Skip this step")
    .click();
});
