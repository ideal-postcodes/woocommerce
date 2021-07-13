import { orderSelectors } from "../../lib/admin";
import { address as addresses } from "@ideal-postcodes/api-fixtures";

const address = addresses.jersey;

Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

const billingTest = () => {
  const billingSelector = orderSelectors[0];
  cy.get("div#order_data").within(() => {
    cy.get("h3").contains("Billing").within(() => {
      cy.get("a").contains("Edit").click({ force: true });
    });
    cy.wait(2000);
    if (!Cypress.env("LEGACY")) {
      cy.get(billingSelector.country).select("GB", { force: true });
      cy.wait(1000);
    }
    cy.get(billingSelector.line_1)
      .click({ force: true })
      .focus()
      .type(address.line_1);
    //here wait because it not catching the xhr call to get list
    cy.wait(1000);
    cy.get(".idpc_ul li").first().click({ force: true });
    cy.get(billingSelector.post_town).should(
      "have.value",
      "Jersey"
    );
    cy.get(billingSelector.postcode).should(
      "have.value",
      address.postcode
    );
  });
}

const shippingTest = () => {
  const shippingSelector = orderSelectors[1];
  cy.get("div#order_data").within(() => {
    cy.get("h3").contains("Shipping").within(() => {
      cy.get("a").contains("Edit").click({ force: true });
    });
    cy.wait(2000);
    if (!Cypress.env("LEGACY")) {
      cy.get(shippingSelector.country).select("GB", { force: true });
      cy.wait(1000);
    }
    cy.get(shippingSelector.line_1)
      .click({ force: true })
      .focus()
      .type(address.line_1);
    //here wait because it not catching the xhr call to get list
    cy.wait(1000);
    cy.get(".idpc_ul li").first().click({ force: true });
    cy.get(shippingSelector.post_town).should(
      "have.value",
      "Jersey"
    );
    cy.get(shippingSelector.postcode).should(
      "have.value",
      address.postcode
    );
  });
}

describe("IdealPostcodes Admin", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/wp-admin/post-new.php?post_type=shop_order");
    cy.wait(1000);
  });

  describe("Orders", () => {
    /**
     * We testing only new one because edit is same page at different
     * address. Till that changes there is no need to test same structure
     */
    describe("New", () => {
      //save order for next tests
      after(() => {

      });
      it("Billing", billingTest);
      it("Shipping", shippingTest);
    });
  });
});
