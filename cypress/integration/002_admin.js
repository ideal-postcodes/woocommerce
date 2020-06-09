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
    cy.visit("/wp-admin/admin.php?page=wc-settings&tab=integration&section=idealpostcodes");
    cy.wait(1000);
  });

  describe("Settings", () => {
    describe("Values", () => {
      it("Required", () => {
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_enabled").uncheck();
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_api_key").clear().type(keys.api_key);
        cy.get("button.woocommerce-save-button").click();
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_enabled").should("not.have.attr", "checked");
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_api_key").should("have.value", keys.api_key);
        //save default values
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_enabled").check();
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_api_key").clear().type(keys.api_key);

        cy.get("#woocommerce_idealpostcodes_idealpostcodes_populate_organisation").should(
          "have.attr",
          "checked"
        );
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_populate_county").should(
          "not.have.attr",
          "checked"
        );

        cy.get("#woocommerce_idealpostcodes_idealpostcodes_populate_organisation").uncheck();
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_populate_county").check();
        cy.get("button.woocommerce-save-button").click();
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_populate_organisation").should(
          "not.have.attr",
          "checked"
        );
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_populate_county").should(
          "have.attr",
          "checked"
        );
        //save default values
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_populate_organisation").check();
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_populate_county").uncheck();

        cy.get("button.woocommerce-save-button").click();
        cy.wait(1000);
      });
    });
  });
});
