import {
  Selectors,
  Config,
  OutputFields,
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

const toOutputFields = (config: Config, selectors: Selectors): OutputFields => {
  const outputFields: OutputFields = { ...selectors };
  if (config.populateOrganisation === false)
    delete outputFields.organisation_name;
  if (config.populateCounty === false) delete outputFields.county;
  return outputFields;
};

const legacyPostcodeConfig = {
  inputId: "idpc_input",
  buttonId: "idpc_button",
  selectId: "idpc_dropdown",
};

const tags = ["wc"];

const updateCheckout = () =>
  (window.jQuery as any)(document.body).trigger("update_checkout");

export const newBind = (selectors: Selectors) => (config: Config) => {
  if (config.enabled !== true) return;
  const pageBindings = setupBind({ selectors });
  const outputFields = toOutputFields(config, selectors);

  pageBindings.forEach((binding) => {
    const { targets, parent } = binding;

    const localConfig = {
      scope: parent,
      apiKey: config.apiKey,
      tags,
      outputFields,
      onAddressRetrieved: updateCheckout,
    };

    if (config.postcodeLookup) {
      const context = insertPostcodeField(targets);
      if (context) {
        PostcodeLookup.setup({
          ...legacyPostcodeConfig,
          ...config,
          ...localConfig,
          context,
          ...config.postcodeLookupOverride,
        });
      }
    }

    if (config.autocomplete) {
      AddressFinder.setup({
        ...config,
        ...localConfig,
        inputField: selectors.line_1,
        ...config.autocompleteOverride,
      });
    }
  });
};
