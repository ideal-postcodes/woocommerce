import {
  addressRetrieval,
  Binding,
  Config, setupBind,
} from "@ideal-postcodes/jsutil";

export const pageTest = (): boolean =>
  document.querySelector(".woocommerce-checkout") !== null;

export const selectors = {
  line_1: "#shipping_address_1",
  line_2: "#shipping_address_2",
  post_town: "#shipping_city",
  county: "#shipping_state",
  postcode: "#shipping_postcode",
  organisation: "#shipping_company",
  country: "#shipping_country",
};

export const bind = (config: Config) => {
  const pageBindings = setupBind({ selectors });
  pageBindings.forEach(binding => {
    const { targets } = binding;

    // Initialise autocomplete instance
    new window.IdealPostcodes.Autocomplete.Controller({
      api_key: config.apiKey,
      inputField: selectors.line_1,
      outputFields: {},
      checkKey: true,
      onAddressRetrieved: addressRetrieval({ targets, config }),
      ...config.autocompleteOverride,
    });
  });
};

export const binding: Binding = {
  pageTest,
  bind
};
