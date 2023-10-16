import { AddressFinder } from "@ideal-postcodes/address-finder";
import { toIso, change, hasValue, isSelect, AnyAddress } from "@ideal-postcodes/jsutil";

const { watch } = AddressFinder;

const config = (window as any).idpcConfig || {};

const orderBilling = {
  line_1: "#_billing_address_1",
  line_2: "#_billing_address_2",
  post_town: "#_billing_city",
  county: "#_billing_state",
  postcode: "#_billing_postcode",
  organisation_name: "#_billing_company",
  country: "#_billing_country",
};

const orderShipping = {
  line_1: "#_shipping_address_1",
  line_2: "#_shipping_address_2",
  post_town: "#_shipping_city",
  county: "#_shipping_state",
  postcode: "#_shipping_postcode",
  organisation_name: "#_shipping_company",
  country: "#_shipping_country",
};


const userBilling = {
  line_1: "#billing_address_1",
  line_2: "#billing_address_2",
  post_town: "#billing_city",
  county: "#billing_state",
  postcode: "#billing_postcode",
  organisation_name: "#billing_company",
  country: "#billing_country",
};

const userShipping = {
  line_1: "#shipping_address_1",
  line_2: "#shipping_address_2",
  post_town: "#shipping_city",
  county: "#shipping_state",
  postcode: "#shipping_postcode",
  organisation_name: "#shipping_company",
  country: "#shipping_country",
};



export const orderSelectors = [orderBilling, orderShipping];
export const userSelectors = [userBilling, userShipping];


orderSelectors.forEach((selectors) => {
  watch(
    {
      ...config,
      ...(config.autocompleteOverride || {}),
      outputFields: selectors,
      listStyle: {
        minWidth: "25em"
      },
      onAddressRetrieved: function (address: AnyAddress) {
        const select = document.querySelector(
          selectors.country
        ) as HTMLSelectElement;
        const code = toIso(address);
        if (
          select !== null &&
          code !== null &&
          isSelect(select) &&
          hasValue(select, code)
        )
          change({ e: select, value: code });
      },
    },
    {
      pageTest: (): boolean => /\/wp-admin/i.test(window.location.href),
      getScope: () => document.querySelector("div#order_data")
    }
  );
});

userSelectors.forEach((selectors) => {
  watch(
    {
      ...config,
      ...(config.autocompleteOverride || {}),
      outputFields: selectors,
      onAddressRetrieved: function (address: AnyAddress) {
        const select = document.querySelector(
          selectors.country
        ) as HTMLSelectElement;
        const code = toIso(address);
        if (
          select !== null &&
          code !== null &&
          isSelect(select) &&
          hasValue(select, code)
        )
          change({ e: select, value: code });
      },
    },
    {
      pageTest: (): boolean => /\/wp-admin/i.test(window.location.href),
      getScope: () => document.querySelector("form#your-profile"),
    }
  );
});
