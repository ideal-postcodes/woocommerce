Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

describe("IdealPostcodes Admin Setup", () => {
  before(() => {
    if (Cypress.env("LEGACY")) return cy.installwc3();
    cy.installwc4();
  });

  beforeEach(() => {
    cy.login();
    cy.visit("/wp-admin/plugins.php");
    cy.wait(1000);
  });

  describe("Enable/Disable Plugin", () => {
    it("Disable plugin", () => {
      cy.get(
        "a[aria-label='Deactivate UK Address Postcode Validation']"
      ).click();
      cy.get(
        "a[aria-label='Activate UK Address Postcode Validation']"
      )
        .parent()
        .should("have.class", "activate");
    });

    it("Enable plugin", () => {
      cy.get(
        "a[aria-label='Activate UK Address Postcode Validation']"
      ).click();
      cy.get(
        "a[aria-label='Deactivate UK Address Postcode Validation']"
      )
        .parent()
        .should("have.class", "deactivate");
    });
  });
});
