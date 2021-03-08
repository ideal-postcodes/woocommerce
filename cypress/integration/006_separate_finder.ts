/// <reference types="cypress" />;
import { address as addresses } from "@ideal-postcodes/api-fixtures";
import { selectors } from "../../lib/checkout_billing";

const address = addresses.jersey;

Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

describe("Separate finder", () => {
  beforeEach(function () {
    cy.login();
    cy.visit(
      "/wp-admin/admin.php?page=wc-settings&tab=integration&section=idealpostcodes"
    );
    cy.wait(1000);
    cy.get(
      "#woocommerce_idealpostcodes_idealpostcodes_separate_finder"
    ).check();
    cy.get("button.woocommerce-save-button").click({ force: true });
  });

  after(function () {
    cy.visit(
      "/wp-admin/admin.php?page=wc-settings&tab=integration&section=idealpostcodes"
    );
    cy.wait(1000);
    cy.get(
      "#woocommerce_idealpostcodes_idealpostcodes_separate_finder"
    ).uncheck();
    cy.get("button.woocommerce-save-button").click({ force: true });
  });

  describe("when enabled", () => {
    it("renders address finder in new field", function () {
      cy.visit("/?product=test");
      cy.get("button[name='add-to-cart']").click({ force: true });
      cy.get("a").contains("View cart").click({ force: true });
      cy.get("a").contains("Proceed to checkout").click({ force: true });
      cy.get(".woocommerce-billing-fields").within(() => {
        cy.wait(1000);
        if (!Cypress.env("LEGACY")) {
          cy.get(selectors.country).select("GB", { force: true });
          cy.wait(1000);
        }
        cy.get(selectors.line_1)
          .click({ force: true })
          .focus()
          .type(address.line_1);
        //here wait because it not catching the xhr call to get list
        cy.wait(5000);
        cy.get(".idpc_ul").should("not.be.visible");
        cy.get(".idpc-finder").within(() => {
          cy.get(".idpc_autocomplete").should("be.visible");
          cy.get("input.input-text")
            .click({ force: true })
            .focus()
            .clear()
            .type(address.line_1);
          cy.wait(5000);
          cy.get("input.input-text").clear().type(address.line_1);
          cy.wait(5000);
          cy.get(".idpc_ul li").should("be.visible");
        });
      });
    });
  });
});
