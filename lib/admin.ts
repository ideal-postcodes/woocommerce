import { Address } from "@ideal-postcodes/api-typings";
import { watch } from "@ideal-postcodes/address-finder";
import { toIso, change, hasValue, isSelect } from "@ideal-postcodes/jsutil";

const config = (window as any).idpcConfig;

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

export const orderSelectors = [orderBilling, orderShipping];

orderSelectors.forEach((selectors) => {
  watch(
    {
      ...config,
      outputFields: selectors,
      onAddressRetrieved: function (address: Address) {
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
      getScope: () => document.querySelector("div#order_data"),
    }
  );
});
