import { selectors as shippingSelectors } from "../../lib/account_shipping";

Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

describe("Country watching", () => {
  beforeEach(function () {
    cy.login();
    cy.visit(
      "/wp-admin/admin.php?page=wc-settings&tab=integration&section=idealpostcodes"
    );
    cy.wait(1000);
    cy.get("#woocommerce_idealpostcodes_idealpostcodes_watch_country").check();
    cy.get("button.woocommerce-save-button").click({ force: true });
  });

  after(function () {
    cy.login();
    cy.visit(
      "/wp-admin/admin.php?page=wc-settings&tab=integration&section=idealpostcodes"
    );
    cy.wait(1000);
    cy.get(
      "#woocommerce_idealpostcodes_idealpostcodes_watch_country"
    ).uncheck();
    cy.get("button.woocommerce-save-button").click({ force: true });
  });

  describe("when enabled", () => {
    it("disables postcode lookup", function () {
      cy.visit("/");
      cy.get("a").contains("My account").click({ force: true });
      cy.get("a").contains("Addresses").click({ force: true });
      cy.get(".u-column2 > .woocommerce-Address-title > .edit").click({
        force: true,
      });
      if (Cypress.env("LEGACY")) {
        cy.get("#select2-shipping_country-container")
          .click({ force: true })
          .type("United Kingdom{enter}");
      } else {
        cy.get(shippingSelectors.country).select("GB", { force: true });
      }
      cy.get(".idpc_lookup").should("be.visible");
      if (Cypress.env("LEGACY")) {
        cy.get("#select2-shipping_country-container")
          .click({ force: true })
          .type("Germany{enter}");
      } else {
        cy.get(shippingSelectors.country).select("DE", { force: true });
      }
      cy.get(".idpc_lookup").should("not.be.visible");
    });
  });
});
