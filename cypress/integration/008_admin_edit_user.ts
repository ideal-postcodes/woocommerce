import { userSelectors } from "../../lib/admin";
import { address as addresses } from "@ideal-postcodes/api-fixtures";

const address = addresses.jersey;

Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

const createUser = () => {
  cy.visit("/wp-admin/user-new.php");
  cy.wait(1000);
  cy.get("#user_login").type("test", { delay: 100 });
  cy.get("#email").type("test@test.com", { delay: 100 });
  cy.get("#send_user_notification").uncheck();
  cy.get("#role").select("customer");
  cy.get("#createusersub").click();
  cy.wait(2000);
  cy.get("tbody[data-wp-lists=\"list:user\"] .username a").contains("test").click();
}

const billingTest = () => {
  const billingSelector = userSelectors[0];
  cy.get("form#your-profile #fieldset-billing").within(() => {
    if (!Cypress.env("LEGACY")) {
      cy.get(billingSelector.country).select("GB", { force: true });
      cy.wait(1000);
    }
    cy.get(billingSelector.line_1)
      .click({ force: true })
      .focus()
      .type(address.line_1);
    //here wait because it not catching the xhr call to get list
    cy.wait(5000);
    cy.get(billingSelector.line_1).clear();
    cy.get(billingSelector.line_1).type(address.line_1);
    cy.wait(500);
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
  const shippingSelector = userSelectors[1];
  cy.get("form#your-profile #fieldset-shipping").within(() => {
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
    cy.wait(5000);
    cy.get(shippingSelector.line_1).clear();
    cy.get(shippingSelector.line_1).type(address.line_1);
    cy.wait(1000);
    cy.get(".idpc_ul > li").first().click({ force: true });
    cy.wait(3000);
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
  before(() => {
    cy.login();
    createUser();
    cy.wait(1000);
  });

  describe("Create Customer User", () => {
    describe("New", () => {
      it("Billing", billingTest);
      it("Shipping", shippingTest);
    });
  });
});
