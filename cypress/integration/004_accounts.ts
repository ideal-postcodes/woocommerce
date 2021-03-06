import { address as addresses } from "@ideal-postcodes/api-fixtures";
import { selectors as billingSelectors } from "../../lib/account_billing";
import { selectors as shippingSelectors } from "../../lib/account_shipping";

const address = addresses.jersey;

Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

describe("Account", () => {
  beforeEach(function () {
    cy.login();
  });

  it("Autocomplete", function () {
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
    cy.get(shippingSelectors.line_1)
      .click({ force: true })
      .type(address.line_1);
    //here wait because it not catching the xhr call to get list
    cy.wait(5000);
    cy.get(shippingSelectors.line_1).clear().type(address.line_1);
    cy.wait(500);
    cy.get(".idpc_ul li").first().click({ force: true });
    cy.get(shippingSelectors.post_town).should("have.value", "Jersey");
    cy.get(shippingSelectors.postcode).should("have.value", address.postcode);
  });

  it("Postcode Lookup", function () {
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
    cy.get("#idpc_input")
      .clear({
        force: true,
      })
      .type(address.postcode, {
        force: true,
      });
    cy.get("#idpc_button").click({ force: true });
    cy.wait(1000);
    cy.get("#idpc_dropdown").select("0");
    cy.get(shippingSelectors.post_town).should("have.value", "Jersey");
    cy.get(shippingSelectors.postcode).should("have.value", address.postcode);
  });

  describe("Billing", function () {
    it("Autocomplete", function () {
      cy.visit("/");
      cy.get("a").contains("My account").click({ force: true });
      cy.get("a").contains("Addresses").click({ force: true });
      cy.get(".u-column1 > .woocommerce-Address-title > .edit").click({
        force: true,
      });
      let countryField;
      if (Cypress.env("LEGACY")) {
        cy.get("#select2-billing_country-container")
          .click({ force: true })
          .type("United Kingdom{enter}");
      } else {
        cy.get(billingSelectors.country).select("GB", { force: true });
      }
      cy.get(billingSelectors.line_1)
        .click({ force: true })
        .type(address.line_1);
      cy.wait(5000);
      cy.get(billingSelectors.line_1).clear().type(address.line_1);
      cy.wait(500);
      cy.get(".idpc_ul li").first().click({ force: true });
      cy.get(billingSelectors.post_town).should("have.value", "Jersey");
      cy.get(billingSelectors.postcode).should("have.value", address.postcode);
    });

    it("Postcode Lookup", function () {
      cy.visit("/");
      cy.get("a").contains("My account").click({ force: true });
      cy.get("a").contains("Addresses").click({ force: true });
      cy.get(".u-column1 > .woocommerce-Address-title > .edit").click({
        force: true,
      });

      if (Cypress.env("LEGACY")) {
        cy.get("#select2-billing_country-container")
          .click({ force: true })
          .type("United Kingdom{enter}");
      } else {
        cy.get(billingSelectors.country).select("GB", { force: true });
      }
      cy.get("#idpc_input")
        .clear({
          force: true,
        })
        .type(address.postcode, {
          force: true,
        });
      cy.get("#idpc_button").click({ force: true });
      cy.wait(1000);
      cy.get("#idpc_dropdown").select("0");
      cy.get(billingSelectors.post_town).should("have.value", "Jersey");
      cy.get(billingSelectors.postcode).should("have.value", address.postcode);
    });
  });
});
