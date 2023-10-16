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
    installwc55(): void;
    installwc56(): void;
    installwc59(): void;
    installwc60(): void;
    installwc70(): void;
  }
}

Cypress.Commands.add("login", () => {
  cy.visit("/wp-login.php");
  cy.wait(100);
  cy.get("#user_login").clear();
  cy.wait(10);
  cy.get("#user_login").focus().type("admin");
  cy.get("#user_pass").clear();
  cy.wait(100);
  cy.get("#user_pass").focus().type("password");
  cy.get("#wp-submit").click();
  cy.wait(1000);
});

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

const install43 = (closeModalSelector: string, url: string, skipYesButton = false, survey = false, country = false, skipModal = false, shippingSet = "Set up shipping") => {
  let businessSurvey = false;
  const version =  parseInt(Cypress.env("WC_VERSION"), 10);
  if (Cypress.env("WC_VERSION") && parseInt(Cypress.env("WC_VERSION"), 10) >= 52) {
    businessSurvey = true;
  }
  return () => {
    cy.login();
    cy.visit(url);

    // Start setup wizard
    !skipYesButton && cy.get("button").contains("Yes please").click();

    // Enter address and close popup
    if(country) {
      cy.wait(2000);
      cy.get("input#woocommerce-select-control-0__control-input").type("United Kingdom");
      cy.wait(500);
      cy.get("button#woocommerce-select-control__option-0-GB").click();
      cy.wait(500);
    }
    cy.wait(2000);
    cy.get("button.components-button").contains("Continue").click();
    cy.wait(2000);
    if(survey) {
      cy.get("button.components-button").contains("No thanks").click();
      cy.wait(2000);
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
      if(version >= 59) {
        cy.wait(1000);
        cy.get("#inspector-checkbox-control-16").click();
        cy.wait(1000);
      } else {
        cy.get("#inspector-checkbox-control-15").uncheck();
      }
      cy.get("button").contains("Continue").click();
    }

    // Setup template
    cy.wait(5000);
    cy.get("button").contains("Continue with my active theme").click();
    cy.wait(2000);
    if(version >= 59) {
      cy.visit("/wp-admin/admin.php?page=wc-admin");
    } else {
      // Disable jetpack
      if(!businessSurvey) cy.contains("No thanks").click();
    }
    // Kill modal
    if(!skipModal) cy.get(closeModalSelector).click();
    //TODO add some search text switch
    if(businessSurvey) cy.get("div").contains(shippingSet).click();
    // Setup shipping
    if(!businessSurvey) cy.contains("Set up shipping").click();
    cy.wait(1000);
    cy.contains(/^(Proceed)|(Save\sshipping\soptions)$/).click();
    cy.wait(1000);
    cy.contains("No thanks").click();
    cy.wait(1000);
  };
};

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

// Install for WooCommerce 5.4
Cypress.Commands.add(
  "installwc54",
  install43(
    '.components-modal__screen-overlay button[aria-label="Close dialog"]',
    "/wp-admin/admin.php?page=wc-admin&path=%2Fsetup-wizard",
    true,
    true
  )
);

// Install for WooCommerce 5.5
Cypress.Commands.add(
  "installwc55",
  install43(
    '.components-modal__screen-overlay button[aria-label="Close dialog"]',
    "/wp-admin/admin.php?page=wc-admin&path=%2Fsetup-wizard",
    true,
    true
  )
);

// Install for WooCommerce 5.6
Cypress.Commands.add(
  "installwc56",
  install43(
    '.components-modal__screen-overlay button[aria-label="Close dialog"]',
    "/wp-admin/admin.php?page=wc-admin&path=%2Fsetup-wizard",
    true,
    true
  )
);

// Install for WooCommerce 5.9
Cypress.Commands.add(
  "installwc59",
  install43(
    '.components-modal__screen-overlay button[aria-label="Close dialog"]',
    "/wp-admin/admin.php?page=wc-admin&path=%2Fsetup-wizard",
    true,
    true
  )
);

// Install for WooCommerce 6.0
Cypress.Commands.add(
  "installwc60",
  install43(
    '.components-modal__screen-overlay button[aria-label="Close dialog"]',
    "/wp-admin/admin.php?page=wc-admin&path=%2Fsetup-wizard",
    true,
    true
  )
);

// Install for WooCommerce 7.0
Cypress.Commands.add(
  "installwc70",
  install43(
    '.components-modal__screen-overlay button[aria-label="Close dialog"]',
    "/wp-admin/admin.php?page=wc-admin&path=%2Fsetup-wizard",
    true,
    true,
    true,
    true,
    "Add shipping costs"
  )
);

Cypress.Commands.add("installwc80", () => {
  cy.login();
  cy.visit("/wp-admin/admin.php?page=wc-admin&path=%2Fsetup-wizard");
  cy.get(".components-button.woocommerce-profiler-setup-store__button.is-primary").click();
  cy.wait(1000);
  cy.get(".components-button.woocommerce-profiler-button.is-primary").click();
  cy.wait(1000);
  cy.get("#woocommerce-select-control-0__control-input").click();
  cy.wait(200);
  cy.get("#woocommerce-select-control__option-0-electronics_and_computers").click({ force: true });
  cy.get("#woocommerce-select-control-1__control-input").click();
  cy.wait(200);
  cy.get("#woocommerce-select-control__option-1-GB").click({ force: true });
  cy.wait(200);
  cy.get(".components-button.woocommerce-profiler-button.is-primary").click();
  cy.wait(1000);
  cy.get(".components-button.woocommerce-profiler-navigation-skip-link.is-link").click();
  cy.url({ timeout: 300000 }).should('contain', '/wp-admin/admin.php?page=wc-admin');
  cy.contains("Add shipping costs").click();
  cy.url({ timeout: 300000 }).should('contain', '/wp-admin/admin.php?page=wc-admin&task=shipping');
  cy.get("#woocommerce-shipping-rate__toggle-0").click();
  cy.contains("Save shipping options").click();
  cy.get(".components-button.woocommerce-task-shipping-recommendations_skip-button.dual.is-tertiary").click();
  cy.url({ timeout: 300000 }).should('contain', '/wp-admin/admin.php?page=wc-admin');
  cy.contains("Add tax rates").click();
  cy.url({ timeout: 300000 }).should('contain', '/wp-admin/admin.php?page=wc-admin&task=tax');
  cy.contains("I don't charge sales tax").click();
  cy.url({ timeout: 300000 }).should('contain', '/wp-admin/admin.php?page=wc-admin');
  cy.wait(1000);
})
