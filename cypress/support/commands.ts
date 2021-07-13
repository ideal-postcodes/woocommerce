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
    login(): void;
    installwc33(): void;
    installwc42(): void;
    installwc43(): void;
    installwc45(): void;
    installwc46(): void;
    installwc47(): void;
    installwc48(): void;
    installwc49(): void;
    installwc50(): void;
    installwc51(): void;
    installwc52(): void;
    installwc54(): void;
  }
}

Cypress.Commands.add("login", () => {
  cy.visit("/wp-login.php");
  cy.get("#user_login").clear();
  cy.wait(50);
  cy.get("#user_login").focus().type("admin");
  cy.get("#user_pass").clear();
  cy.wait(50);
  cy.get("#user_pass").focus().type("password");
  cy.get("#wp-submit").click();
  cy.wait(1000);
});

const install33 = () => {
  cy.login();
  cy.visit("/wp-admin");
  cy.get("a").contains("Run the Setup Wizard").click();
  cy.get(".button-primary").click();
  cy.get("button").contains("Continue").click();
  cy.get("button").contains("Continue").click();
  cy.get(".flat_rate > input").each((input) => {
    cy.wait(50);
    cy.wrap(input).focus().type("0");
  });
  cy.get("button[name='save_step']").contains("Continue").click();
  cy.get("button[name='save_step']").contains("Continue").click();
  cy.get("a").contains("Skip this step").click();
};

const install42 = () => {
  cy.login();
  cy.visit("/wp-admin/admin.php?page=wc-setup");

  // Start setup wizard
  cy.get("button").contains("Yes please").click();

  // Enter address and close popup
  cy.wait(1000);
  cy.get("button.components-button").contains("Continue").click();
  cy.wait(1000);
  cy.get(".components-modal__screen-overlay button")
    .contains("Continue")
    .click();

  // Select Industry
  cy.get("#inspector-checkbox-control-3").check();
  cy.get("button").contains("Continue").click();

  // Select product type
  cy.get("#inspector-checkbox-control-10").check();
  cy.get("button").contains("Continue").click();

  cy.get("#woocommerce-select-control-1__control-input").click({ force: true });
  cy.get("button").contains("1 - 10").click();
  cy.get("#woocommerce-select-control-2__control-input").click({ force: true });
  cy.get("button").contains("No").click();
  cy.get("input.components-form-toggle__input").click({ multiple: true });
  cy.get("button").contains("Continue").click();

  // Setup template
  cy.get("button").contains("Continue with my active theme").click();

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
};

const install43 = (closeModalSelector: string, url: string, skipYesButton = false, survey = false) => {
  let businessSurvey = false;
  if (Cypress.env("WC_VERSION") && parseInt(Cypress.env("WC_VERSION"), 10) >= 52) {
    businessSurvey = true;
  }
  return () => {
    cy.login();
    cy.visit(url);

    // Start setup wizard
    !skipYesButton && cy.get("button").contains("Yes please").click();

    // Enter address and close popup
    cy.wait(1000);
    cy.get("button.components-button").contains("Continue").click();
    cy.wait(1000);
    if(survey) {
      cy.get("button.components-button").contains("No thanks").click();
      cy.wait(1000);
    } else {
      cy.get(".components-modal__screen-overlay button")
        .contains("Continue")
        .click();
    }

    // Select Industry
    cy.get("#inspector-checkbox-control-3").check();
    cy.get("button").contains("Continue").click();

    // Select product type
    cy.get("#inspector-checkbox-control-10").check();
    cy.get("button").contains("Continue").click();

    cy.get("#woocommerce-select-control-1__control-input").click({
      force: true,
    });
    cy.get("button").contains("1 - 10").click();
    cy.get("#woocommerce-select-control-2__control-input").click({
      force: true,
    });
    if(!businessSurvey) {
      cy.get("button").contains("No").click();
      cy.get("input.components-form-toggle__input").click({ multiple: true });
      cy.get("button").contains("Continue").click();
    }
    if(businessSurvey) {
      cy.get("#woocommerce-select-control__listbox-2 button#woocommerce-select-control__option-2-no").click({force:true});
      cy.get("button").contains("Continue").click();
      cy.get("#inspector-checkbox-control-15").uncheck();
      cy.get("button").contains("Continue").click();
    }

    // Setup template
    cy.wait(5000);
    cy.get("button").contains("Continue with my active theme").click();
    cy.wait(2000);
    // Disable jetpack
    if(!businessSurvey) cy.contains("No thanks").click();

    // Kill modal
    cy.get(closeModalSelector).click();
    //TODO add some search text switch
    if(businessSurvey) cy.get("div").contains("Set up shipping").click();
    // Setup shipping
    if(!businessSurvey) cy.contains("Set up shipping").click();
    cy.wait(1000);
    cy.contains("Proceed").click();
    cy.wait(1000);
    cy.contains("No thanks").click();
    cy.wait(1000);
  };
};

// Install for WooCommerce 3
Cypress.Commands.add("installwc33", install33);
// Install for WooCommerce 4.2
Cypress.Commands.add("installwc42", install42);
// Install for WooCommerce 4.3
Cypress.Commands.add(
  "installwc43",
  install43(
    ".woocommerce-task-dashboard__welcome-modal-wrapper > .components-button",
    "/wp-admin/admin.php?page=wc-setup"
  )
);
// Install for WooCommerce 4.5
Cypress.Commands.add(
  "installwc45",
  install43(
    '.components-modal__screen-overlay button[aria-label="Close dialog"]',
    "/wp-admin/admin.php?page=wc-setup"
  )
);

// Install for WooCommerce 4.6
Cypress.Commands.add(
  "installwc46",
  install43(
    '.components-modal__screen-overlay button[aria-label="Close dialog"]',
    "/wp-admin/admin.php?page=wc-admin&path=%2Fsetup-wizard",
    true
  )
);

// Install for WooCommerce 4.7
Cypress.Commands.add(
  "installwc47",
  install43(
    '.components-modal__screen-overlay button[aria-label="Close dialog"]',
    "/wp-admin/admin.php?page=wc-admin&path=%2Fsetup-wizard",
    true
  )
);

// Install for WooCommerce 4.8
Cypress.Commands.add(
  "installwc48",
  install43(
    '.components-modal__screen-overlay button[aria-label="Close dialog"]',
    "/wp-admin/admin.php?page=wc-admin&path=%2Fsetup-wizard",
    true
  )
);

// Install for WooCommerce 4.9
Cypress.Commands.add(
  "installwc49",
  install43(
    '.components-modal__screen-overlay button[aria-label="Close dialog"]',
    "/wp-admin/admin.php?page=wc-admin&path=%2Fsetup-wizard",
    true,
    true
  )
);

// Install for WooCommerce 5.0
Cypress.Commands.add(
  "installwc50",
  install43(
    '.components-modal__screen-overlay button[aria-label="Close dialog"]',
    "/wp-admin/admin.php?page=wc-admin&path=%2Fsetup-wizard",
    true,
    true
  )
);

// Install for WooCommerce 5.1
Cypress.Commands.add(
  "installwc51",
  install43(
    '.components-modal__screen-overlay button[aria-label="Close dialog"]',
    "/wp-admin/admin.php?page=wc-admin&path=%2Fsetup-wizard",
    true,
    true
  )
);

// Install for WooCommerce 5.2
Cypress.Commands.add(
  "installwc52",
  install43(
    '.components-modal__screen-overlay button[aria-label="Close dialog"]',
    "/wp-admin/admin.php?page=wc-admin&path=%2Fsetup-wizard",
    true,
    true
  )
);

// Install for WooCommerce 5.2
Cypress.Commands.add(
  "installwc54",
  install43(
    '.components-modal__screen-overlay button[aria-label="Close dialog"]',
    "/wp-admin/admin.php?page=wc-admin&path=%2Fsetup-wizard",
    true,
    true
  )
);
