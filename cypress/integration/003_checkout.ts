/// <reference types="cypress" />;
import { address as addresses } from "@ideal-postcodes/api-fixtures";
import { selectors as billingSelectors } from "../../lib/checkout_billing";
import { selectors as shippingSelectors } from "../../lib/checkout_shipping";

const address = addresses.jersey;

Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

describe("Checkout", () => {
  before(() => {
    cy.login();
    cy.visit("/?product=test");
    cy.get("button[name='add-to-cart']").click({ force: true });
    cy.get("a").contains("View cart").click({ force: true });
    cy.get("a").contains("Proceed to checkout").click({ force: true });
  });

  it("Autocomplete", function () {
    const events = { triggered: false };

    cy.window().then((window) => {
      window.jQuery(window.document.body).on("update_checkout", () => {
        events.triggered = true;
      });
      cy.get(".woocommerce-billing-fields").within(() => {
        if (!Cypress.env("LEGACY")) {
          cy.get(billingSelectors.country).select("GB", { force: true });
          cy.wait(1000);
        }
        cy.get(billingSelectors.line_1)
          .click({ force: true })
          .focus()
          .type(address.line_1);
        //here wait because it not catching the xhr call to get list
        cy.wait(5000);
        cy.get(billingSelectors.line_1).clear();
        cy.get(billingSelectors.line_1).type(address.line_1);
        cy.wait(500);
        cy.get(".idpc_ul li").first().click({ force: true });
        cy.get(billingSelectors.post_town).should(
          "have.value",
          "Jersey"
        );
        cy.get(billingSelectors.postcode).should(
          "have.value",
          address.postcode
        );
        cy.wrap(events).should((events) => expect(events.triggered).to.be.true);
      });
    });
  });

  it("Postcode Lookup", function () {
    const events = { triggered: false };

    cy.window().then((window) => {
      window.jQuery(window.document.body).on("update_checkout", () => {
        events.triggered = true;
      });

      cy.get(".woocommerce-billing-fields").within(() => {
        if (!Cypress.env("LEGACY")) {
          cy.get(billingSelectors.country).select("GB", { force: true });
          cy.wait(1000);
        }
        cy.get("#idpc_input")
          .clear({ force: true })
          .type(address.postcode, { force: true });
        cy.get("#idpc_button").click({ force: true });
        cy.wait(1000);
        cy.get("#idpc_dropdown").select("0");
        cy.get(billingSelectors.post_town).should(
          "have.value",
          "Jersey"
        );
        cy.get(billingSelectors.postcode).should(
          "have.value",
          address.postcode
        );

        cy.wrap(events).should((events) => expect(events.triggered).to.be.true);
      });
    });
  });

  describe("Shipping", function () {
    before(function () {
      cy.get("#ship-to-different-address-checkbox").check();
    });

    it("Autocomplete", function () {
      cy.get(".woocommerce-shipping-fields").within(() => {
        if (!Cypress.env("LEGACY")) {
          cy.get(shippingSelectors.country).select("GB", { force: true });
          cy.wait(1000);
        }
        cy.get(shippingSelectors.line_1).clear().type(address.line_1);
        cy.wait(500);
        cy.get(".idpc_ul li").first().click({ force: true });
        cy.get(shippingSelectors.post_town).should(
          "have.value",
          "Jersey"
        );
        cy.get(shippingSelectors.postcode).should(
          "have.value",
          address.postcode
        );
      });
    });

    it("Postcode Lookup", function () {
      cy.get(".woocommerce-shipping-fields").within(() => {
        if (!Cypress.env("LEGACY")) {
          cy.get(shippingSelectors.country).select("GB", { force: true });
          cy.wait(1000);
        }
        cy.get("#idpc_input")
          .clear({ force: true })
          .type(address.postcode, { force: true });
        cy.get("#idpc_button").click({ force: true });
        cy.wait(1000);
        cy.get("#idpc_dropdown").select("0");
        cy.get(shippingSelectors.post_town).should(
          "have.value",
          "Jersey"
        );
        cy.get(shippingSelectors.postcode).should(
          "have.value",
          address.postcode
        );
      });
    });
  });
});
