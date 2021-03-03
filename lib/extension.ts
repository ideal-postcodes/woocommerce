import {
  Selectors,
  Config,
  setupBind,
  insertBefore,
  Targets,
  getParent,
} from "@ideal-postcodes/jsutil";
import { AddressFinder } from "@ideal-postcodes/address-finder";
import { PostcodeLookup } from "@ideal-postcodes/postcode-lookup";

export const insertPostcodeField = (targets: Targets): HTMLElement | null => {
  if (targets.line_1 === null) return null;
  const target = getParent(targets.line_1, "p");
  if (target === null) return null;
  const wrapper = document.createElement("p");
  wrapper.className = "form-row";
  const postcodeField = document.createElement("div");
  postcodeField.className = "idpc_lookup field";
  wrapper.appendChild(postcodeField);
  insertBefore({ target, elem: wrapper });
  return postcodeField;
};

const tags = ["wc"];

const updateCheckout = () =>
  (window.jQuery as any)(document.body).trigger("update_checkout");

export const newBind = (selectors: Selectors) => (config: Config) => {
  if (config.enabled !== true) return;

  const pageBindings = setupBind({ selectors });

  pageBindings.forEach((binding) => {
    const { targets } = binding;

    if (config.postcodeLookup) {
      const context = insertPostcodeField(targets);
      if (context) {
        PostcodeLookup.setup({
          context,
          apiKey: config.apiKey,
          tags,
          outputFields: selectors,
          onAddressRetrieved: updateCheckout,
          ...config.postcodeLookupOverride,
        });
      }
    }

    if (config.autocomplete) {
      AddressFinder.setup({
        inputField: selectors.line_1,
        tags,
        apiKey: config.apiKey,
        outputFields: selectors,
        onAddressRetrieved: updateCheckout,
        ...config.autocompleteOverride,
      });
    }
  });
};
