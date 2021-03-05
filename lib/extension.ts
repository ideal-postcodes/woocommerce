import {
  Selectors,
  Config,
  OutputFields,
  hide,
  show,
  setupBind,
  insertBefore,
  Targets,
  getParent,
} from "@ideal-postcodes/jsutil";
import {
  AddressFinder,
  Controller as AfController,
} from "@ideal-postcodes/address-finder";
import {
  PostcodeLookup,
  Controller as PlController,
} from "@ideal-postcodes/postcode-lookup";

if (!window.IdealPostcodes) window.IdealPostcodes = {};
window.IdealPostcodes.AddressFinder = AddressFinder;
window.IdealPostcodes.PostcodeLookup = PostcodeLookup;

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

    let pl: PlController;
    if (config.postcodeLookup) {
      const context = insertPostcodeField(targets);
      if (context) {
        pl = PostcodeLookup.setup({
          ...legacyPostcodeConfig,
          ...config,
          ...localConfig,
          context,
          ...config.postcodeLookupOverride,
        });
      }
    }

    let af: AfController;
    if (config.autocomplete) {
      af = AddressFinder.setup({
        ...config,
        ...localConfig,
        inputField: selectors.line_1,
        ...config.autocompleteOverride,
      });
    }

    const isSupported = (c: string | null): boolean =>
      ["GB", "IM", "JE", "GG"].indexOf(c || "") !== -1;

    const country = (targets.country as HTMLSelectElement) || null;

    const checkCountry = () => {
      if (isSupported(country.value)) {
        if (pl) show(pl.context);
        if (af) af.view.attach();
      } else {
        if (pl) hide(pl.context);
        if (af) af.view.detach();
      }
    };

    if (config.watchCountry && country) {
      (window.jQuery as any)(country).change(checkCountry);
      checkCountry();
    }
  });
};
