Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

describe("IdealPostcodes Admin", () => {
  let keys;
  //install woocommerce
  beforeEach(() => {
    cy.fixture("keys.json").then(data => (keys = data));
  });

  beforeEach(() => {
    cy.login();
    cy.visit("/wp-admin/admin.php?page=wc-settings");
    cy.contains("a", "Ideal Postcodes").click();
    cy.wait(1000);
  });

  describe("Settings", () => {
    it("Able to navigate to settings tab", () => {
      cy.get("#idealpostcodes_enabled").should("have.attr", "checked");
      cy.get("#idealpostcodes_api_key").should("have.value", "");
    });

    describe("Sections", () => {
      describe("Values", () => {
        it("Required", () => {
          cy.visit(
            "/wp-admin/admin.php?page=wc-settings&tab=ideal_postcodes&section"
          );
          cy.get("#idealpostcodes_enabled").uncheck();
          cy.get("#idealpostcodes_api_key").clear().type(keys.api_key);
          cy.get("button.woocommerce-save-button").click();
          cy.get("#idealpostcodes_enabled").should("not.have.attr", "checked");
          cy.get("#idealpostcodes_api_key").should("have.value", keys.api_key);
          //save default values
          cy.get("#idealpostcodes_enabled").check();
          cy.get("#idealpostcodes_api_key").clear().type(keys.api_key);
          cy.get("button.woocommerce-save-button").click();
          cy.wait(1000);
        });
        it("Options", () => {
          cy.visit(
            "/wp-admin/admin.php?page=wc-settings&tab=ideal_postcodes&section=options"
          );
          cy.get("#idealpostcodes_populate_organisation").should(
            "have.attr",
            "checked"
          );
          cy.get("#idealpostcodes_populate_county").should(
            "not.have.attr",
            "checked"
          );
          cy.get("#idealpostcodes_populate_organisation").uncheck();
          cy.get("#idealpostcodes_populate_county").check();
          cy.get("button.woocommerce-save-button").click();
          cy.get("#idealpostcodes_populate_organisation").should(
            "not.have.attr",
            "checked"
          );
          cy.get("#idealpostcodes_populate_county").should(
            "have.attr",
            "checked"
          );
          //save default values
          cy.get("#idealpostcodes_populate_organisation").check();
          cy.get("#idealpostcodes_populate_county").uncheck();
          cy.get("button.woocommerce-save-button").click();
        });
      });
    });
  });
});
