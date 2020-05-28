import { address as fixtures } from "@ideal-postcodes/api-fixtures";
const englandAddress = fixtures.england;
const scotlandAddress = fixtures.scotland;

Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

describe("Checkout", () => {

  before(() => {
    cy.login();
    cy.visit("/?product=test");
    cy.get("button[name='add-to-cart']").click();
    cy.get("a")
      .contains("View cart")
      .click({ force: true });
    cy.get("a")
      .contains("Proceed to checkout")
      .click();
  });

  it("Autocomplete", function() {
    cy.get(".woocommerce-billing-fields").within(() => {
      if (!Cypress.env("LEGACY")) {
        cy.get("#billing_country").select("GB", { force: true });
        cy.wait(1000);
      }
      cy.get("#billing_address_1")
        .click()
        .focus()
        .type(englandAddress.line_1);
      //wait here in order to catch the xhr call to get list
      cy.wait(5000);
      cy.get("#billing_address_1").clear();
      cy.get("#billing_address_1").type(englandAddress.line_1);
      cy.wait(500);
      cy.get(".idpc_ul > li")
        .first()
        .click();
      cy.get("#billing_address_2").should("have.value", englandAddress.line_2);
      cy.get("#billing_city").should("have.value", englandAddress.post_town);
      cy.get("#billing_postcode").should("have.value", englandAddress.postcode);
    });
  });

  describe("Shipping", function() {
    before(function() {
      cy.get("#ship-to-different-address-checkbox").check();
    });

    it("Autocomplete", function() {
      cy.get(".woocommerce-shipping-fields").within(() => {
        if (!Cypress.env("LEGACY")) {
          cy.get("#shipping_country").select("GB", { force: true });
          cy.wait(1000);
        }
        cy.get("#shipping_address_1")
          .click()
          .focus()
          .type(scotlandAddress.line_1);
        cy.wait(5000);
        cy.get("#shipping_address_1").clear();
        cy.get("#shipping_address_1").type(scotlandAddress.line_1);
        cy.wait(500);
        cy.get(".idpc_ul > li")
          .eq(1)
          .click();
        cy.get("#shipping_address_2").should("have.value", `${scotlandAddress.line_2}, ${scotlandAddress.line_3}`);
        cy.get("#shipping_city").should("have.value", scotlandAddress.post_town);
        cy.get("#shipping_postcode").should("have.value", scotlandAddress.postcode);
      });
    });
  });
});
