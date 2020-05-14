Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

describe("Account", () => {
  let address;

  beforeEach(function() {
    cy.login();
    cy.fixture("address.json").then(data => (address = data));
  });

  it("Autocomplete", function() {
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
      cy.get("#shipping_country").select("GB", { force: true });
    }
    cy.get("#shipping_address_1")
      .click()
      .type(address.street);
    //here wait because it not catching the xhr call to get list
    cy.wait(5000);
    cy.get("#shipping_address_1")
      .clear()
      .type(address.street);
    cy.wait(500);
    cy.get(".idpc_ul li")
      .first()
      .click();
    cy.get("#shipping_city").should("have.value", address.city);
    cy.get("#shipping_postcode").should("have.value", address.postcode);
  });

  describe("Billing", function() {
    it("Autocomplete", function() {
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
        cy.get("#billing_country").select("GB", { force: true });
      }
      cy.get("#billing_address_1")
        .click()
        .type(address.street);
      cy.wait(5000);
      cy.get("#billing_address_1")
        .clear()
        .type(address.street);
      cy.wait(500);
      cy.get(".idpc_ul li")
        .first()
        .click();
      cy.get("#billing_city").should("have.value", address.city);
      cy.get("#billing_postcode").should("have.value", address.postcode);
    });
  });
});
