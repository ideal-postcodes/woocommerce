import { address as fixtures } from "@ideal-postcodes/api-fixtures";
const englandAddress = fixtures.england;
const scotlandAddress = fixtures.scotland;

Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

describe("Account", () => {

  it("Autocomplete", function () {
    cy.login();
    cy.visit("/");
    cy.get("a")
      .contains("My account")
      .click();
    cy.get("a")
      .contains("Addresses")
      .click();
    cy.get(".u-column2 > .woocommerce-Address-title > .edit").click();
    if (Cypress.env("LEGACY")) {
      cy.get("#select2-shipping_country-container")
        .click()
        .type("United Kingdom{enter}");
    } else {
      cy.get("#shipping_country").select("GB", {
        force: true
      });
    }
    cy.get("#shipping_address_1")
      .click()
      .type(scotlandAddress.line_1);
    //wait here in order to catch the xhr call to get list
    cy.wait(5000);
    cy.get("#shipping_address_1")
      .clear()
      .type(scotlandAddress.line_1);
    cy.wait(500);
    cy.get(".idpc_ul > li")
      .eq(1)
      .click();
    cy.get("#shipping_address_2").should("have.value", `${scotlandAddress.line_2}, ${scotlandAddress.line_3}`);
    cy.get("#shipping_city").should("have.value", scotlandAddress.post_town);
    cy.get("#shipping_postcode").should("have.value", scotlandAddress.postcode);
  });

  describe("Billing", function () {
    it("Autocomplete", function () {
      cy.login();
      cy.visit("/");
      cy.get("a")
        .contains("My account")
        .click();
      cy.get("a")
        .contains("Addresses")
        .click();
      cy.get(".u-column1 > .woocommerce-Address-title > .edit").click();
      let countryField;
      if (Cypress.env("LEGACY")) {
        cy.get("#select2-billing_country-container")
          .click()
          .type("United Kingdom{enter}");
      } else {
        cy.get("#billing_country").select("GB", {
          force: true
        });
      }
      cy.get("#billing_address_1")
        .click()
        .type(englandAddress.line_1);
      cy.wait(5000);
      cy.get("#billing_address_1")
        .clear()
        .type(englandAddress.line_1);
      cy.wait(500);
      cy.get(".idpc_ul > li")
        .first()
        .click();
      cy.get("#billing_address_2").should("have.value", englandAddress.line_2);
      cy.get("#billing_city").should("have.value", englandAddress.post_town);
      cy.get("#billing_postcode").should("have.value", englandAddress.postcode);
    });
  });
});
