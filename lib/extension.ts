import {
  Selectors,
  Config,
  setupBind,
  addressRetrieval,
  insertBefore,
  Targets,
  getParent,
} from "@ideal-postcodes/jsutil";

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

export const newBind = (selectors: Selectors) => {
  return (config: Config) => {
    if (config.enabled !== true) return;

    const pageBindings = setupBind({ selectors });
    pageBindings.forEach((binding) => {
      const { targets } = binding;

      if (config.postcodeLookup) {
        const postcodeField = insertPostcodeField(targets);
        if (postcodeField === null) return;
        window.jQuery(postcodeField).setupPostcodeLookup({
          api_key: config.apiKey,
          check_key: true,
          onAddressSelected: addressRetrieval({ config, targets }),
          ...config.postcodeLookupOverride,
        });
      }

      if (config.autocomplete) {
        new window.IdealPostcodes.Autocomplete.Controller({
          api_key: config.apiKey,
          inputField: selectors.line_1,
          outputFields: {},
          checkKey: true,
          onAddressRetrieved: addressRetrieval({ targets, config }),
          ...config.autocompleteOverride,
        });
      }
    });
  };
};
