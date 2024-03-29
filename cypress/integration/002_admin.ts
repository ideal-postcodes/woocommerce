const apiKey = Cypress.env("API_KEY");

Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

describe("IdealPostcodes Admin", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/wp-admin/admin.php?page=wc-settings&tab=integration&section=idealpostcodes");
    cy.wait(1000);
  });

  describe("Settings", () => {
    describe("Values", () => {
      it("Required", () => {
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_enabled").uncheck();
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_api_key").clear().type(apiKey);
        cy.get("button.woocommerce-save-button").click();
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_enabled").should("not.have.attr", "checked");
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_api_key").should("have.value", apiKey);
        //save default values
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_enabled").check();
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_api_key").clear().type(apiKey);
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_autocomplete").should(
          "have.attr",
          "checked"
        );
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_postcodelookup").should(
          "have.attr",
          "checked"
        );

        cy.get("#woocommerce_idealpostcodes_idealpostcodes_populate_organisation").should(
          "have.attr",
          "checked"
        );
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_populate_county").should(
          "have.attr",
          "checked"
        );
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_watch_country").should(
          "not.have.attr",
          "checked"
        );
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_separate_finder").should(
          "not.have.attr",
          "checked"
        );
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_autocomplete").uncheck();
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_postcodelookup").uncheck();
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_populate_organisation").uncheck();
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_populate_county").uncheck();
        cy.get("button.woocommerce-save-button").click({ force: true });
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_autocomplete").should(
          "not.have.attr",
          "checked"
        );
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_postcodelookup").should(
          "not.have.attr",
          "checked"
        );
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_populate_organisation").should(
          "not.have.attr",
          "checked"
        );

        cy.get("#woocommerce_idealpostcodes_idealpostcodes_populate_county").should(
          "not.have.attr",
          "checked"
        );
        //save default values
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_autocomplete").check();
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_postcodelookup").check();
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_populate_organisation").check();
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_populate_county").check();

        //override for set default country and disable country check
        cy.get("#woocommerce_idealpostcodes_idealpostcodes_autocomplete_override").clear().type("{\n" +
          "\"defaultCountry\": \"GBR\",\n" +
          "\"detectCountry\": false\n" +
          "}");

        cy.get("button.woocommerce-save-button").click({ force: true });
        cy.wait(1000);
      });
    });
  });
});
