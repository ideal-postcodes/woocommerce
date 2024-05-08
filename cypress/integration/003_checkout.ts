/// <reference types="cypress" />;
import { address as addresses } from "@ideal-postcodes/api-fixtures";
import { selectors as billingSelectors } from "../../lib/checkout_billing";
import { selectors as shippingSelectors } from "../../lib/checkout_shipping";
import { selectors as billingBlocksSelectors } from "../../lib/checkout_blocks_billing";
import { selectors as shippingBlockSelectors } from "../../lib/checkout_blocks_shipping";

const address = addresses.jersey;

Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

const isBlocks = parseInt(Cypress.env("WC_VERSION"), 10) >= 82;

describe("Checkout", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/?product=test");
    cy.get("button[name='add-to-cart']").click({ force: true });
    cy.get("a").contains("View cart").click({ force: true });
    cy.get("a").contains("Proceed to checkout", { matchCase: false }).click({ force: true });
    cy.intercept(
      "https://api.ideal-postcodes.co.uk/v1/keys/**"
    ).as("call");
    cy.wait("@call").wait(500);
  });

  it("Autocomplete", function () {
    const events = { triggered: false };
    const selectors = isBlocks ? billingBlocksSelectors : billingSelectors;
    cy.window().then((window) => {
      window.jQuery(window.document.body).on("update_checkout", () => {
        events.triggered = true;
      });
      if(isBlocks) {
        cy.get("#checkbox-control-0").uncheck();
        cy.wait(500);
      }
      cy.get(isBlocks ? "#billing" : ".woocommerce-billing-fields").within(() => {
        if (!Cypress.env("LEGACY")) {
          isBlocks ? cy.get(selectors.country).type("United Kingdom").type("{enter}") : cy.get(selectors.country).select("GB", { force: true });
          cy.wait(1000);
        }
        cy.get(selectors.line_1)
          .click({ force: true })
          .focus()
          .clear({force: true})
          .type(address.line_1);
        //here wait because it not catching the xhr call to get list
        cy.wait(5000);
        cy.get(selectors.line_1).clear();
        cy.get(selectors.line_1).type(address.line_1);
        cy.wait(500);
        cy.get(".idpc_ul li").first().click({ force: true });
        cy.get(selectors.post_town).should(
          "have.value",
          "Jersey"
        );
        cy.get(selectors.postcode).should(
          "have.value",
          address.postcode
        );
        cy.wrap(events).should((events) => expect(events.triggered).to.be.true);
      });
    });
  });

  it("Postcode Lookup", function () {
    const events = { triggered: false };
    const selectors = isBlocks ? billingBlocksSelectors : billingSelectors;
    cy.window().then((window) => {
      window.jQuery(window.document.body).on("update_checkout", () => {
        events.triggered = true;
      });
      if(isBlocks) {
        cy.get("#checkbox-control-0").uncheck();
        cy.wait(400);
      }
      cy.get(isBlocks ? "#billing" : ".woocommerce-billing-fields").within(() => {
        if (!Cypress.env("LEGACY")) {
          isBlocks ? cy.get(selectors.country).type("United Kingdom").type("{enter}") : cy.get(selectors.country).select("GB", { force: true });
          cy.wait(1000);
        }
        cy.get("#idpc_input")
          .clear({ force: true })
          .type(address.postcode, { force: true });
        cy.get("#idpc_button").click({ force: true });
        cy.wait(1000);
        cy.get("#idpc_dropdown").select("0");
        cy.get(selectors.post_town).should(
          "have.value",
          "Jersey"
        );
        cy.get(selectors.postcode).should(
          "have.value",
          address.postcode
        );

        cy.wrap(events).should((events) => expect(events.triggered).to.be.true);
      });
    });
  });

  describe("Shipping", function () {
    const selectors = isBlocks ? shippingBlockSelectors : shippingSelectors;
    before(function () {
      if(!isBlocks) cy.get("#ship-to-different-address-checkbox").check();
    });

    it("Autocomplete", function () {
      cy.get(isBlocks ? "#shipping" : ".woocommerce-shipping-fields").within(() => {
        if (!Cypress.env("LEGACY")) {
          isBlocks ? cy.get(selectors.country).type("United Kingdom").type("{enter}") : cy.get(selectors.country).select("GB", { force: true });
          cy.wait(1000);
        }
        cy.get(selectors.line_1).clear({force: true}).type(address.line_1);
        cy.wait(500);
        cy.get(".idpc_ul li").first().click({ force: true });
        cy.get(selectors.post_town).should(
          "have.value",
          "Jersey"
        );
        cy.get(selectors.postcode).should(
          "have.value",
          address.postcode
        );
      });
    });

    it("Postcode Lookup", function () {
      cy.get(isBlocks ? "#shipping" : ".woocommerce-shipping-fields").within(() => {
        if (!Cypress.env("LEGACY")) {
          isBlocks ? cy.get(selectors.country).type("United Kingdom").type("{enter}") : cy.get(selectors.country).select("GB", { force: true });
          cy.wait(1000);
        }
        cy.get("#idpc_input")
          .clear({ force: true })
          .type(address.postcode, { force: true });
        cy.get("#idpc_button").click({ force: true });
        cy.wait(1000);
        cy.get("#idpc_dropdown").select("0");
        cy.get(selectors.post_town).should(
          "have.value",
          "Jersey"
        );
        cy.get(selectors.postcode).should(
          "have.value",
          address.postcode
        );
      });
    });
  });
});
