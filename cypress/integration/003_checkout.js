Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

describe("Checkout", () => {
  let address;

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

  //add products to cart for further testing
  beforeEach(function() {
    cy.fixture("address.json").then(data => (address = data));
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
        .type(address.street);
      //here wait because it not catching the xhr call to get list
      cy.wait(5000);
      cy.get("#billing_address_1").clear();
      cy.get("#billing_address_1").type(address.street);
      cy.wait(500);
      cy.get(".idpc_ul li")
        .first()
        .click();
      cy.get("#billing_city").should("have.value", address.city);
      cy.get("#billing_postcode").should("have.value", address.postcode);
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
          .clear()
          .type(address.street);
        cy.wait(500);
        cy.get(".idpc_ul li")
          .first()
          .click();
        cy.get("#shipping_city").should("have.value", address.city);
        cy.get("#shipping_postcode").should("have.value", address.postcode);
      });
    });
  });
});
