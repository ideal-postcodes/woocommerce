import { address as addresses } from "@ideal-postcodes/api-fixtures";
import { selectors as billingSelectors } from "../../lib/account_billing";
import { selectors as shippingSelectors } from "../../lib/account_shipping";

const address = addresses.jersey;

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
    it("disables address finder if non-uk country selected", function () {
      cy.visit("/");
      cy.get("a").contains("My account").click({ force: true });
      cy.get("a").contains("Addresses").click({ force: true });
      cy.get(".u-column2 > .woocommerce-Address-title > .edit").click({
        force: true,
      });

      // Ensure UK selected
      if (Cypress.env("LEGACY")) {
        cy.get("#select2-shipping_country-container")
          .click({ force: true })
          .type("United Kingdom{enter}");
      } else {
        cy.get(shippingSelectors.country).select("GB", { force: true });
      }

      cy.get("div.idpc_autocomplete").should("be.visible");

      // Switch to Germany
      if (Cypress.env("LEGACY")) {
        cy.get("#select2-shipping_country-container")
          .click({ force: true })
          .type("Germany{enter}");
      } else {
        cy.get(shippingSelectors.country).select("DE", { force: true });
      }
      cy.get("div.idpc_autocomplete").should("not.exist");
    });

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
