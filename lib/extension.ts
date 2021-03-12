import {
  Selectors,
  Config,
  idGen,
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

const isSupported = (c: string | null): boolean =>
  ["GB", "IM", "JE", "GG"].indexOf(c || "") !== -1;

/**
 * Creates container for Postcode Lookup
 */
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

interface FinderContainer {
  input: HTMLInputElement;
  elem: HTMLElement;
}

/**
 * Creates container for Address Finder
 */
export const insertAddressFinder = (
  targets: Targets
): FinderContainer | null => {
  if (targets.line_1 === null) return null;
  const id = idGen()();
  const target = getParent(targets.line_1, "p");
  if (target === null) return null;
  const elem = document.createElement("p");
  elem.className = "form-row idpc-finder";
  const label = document.createElement("label");
  label.htmlFor = id;
  label.textContent = "Start typing your address to search";
  const span = document.createElement("span");
  span.className = "woocommerce-input-wrapper";
  const input = document.createElement("input");
  input.type = "text";
  input.id = id;
  input.className = "input-text";
  elem.appendChild(label);
  span.appendChild(input);
  elem.appendChild(span);
  insertBefore({ target, elem });
  return { input, elem };
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
      onAddressPopulated: updateCheckout,
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
    let f: FinderContainer | null;
    if (config.autocomplete) {
      f = config.separateFinder ? insertAddressFinder(targets) : null;
      af = AddressFinder.setup({
        ...config,
        ...localConfig,
        inputField: f ? f.input : selectors.line_1,
        ...config.autocompleteOverride,
      });
    }

    const country = (targets.country as HTMLSelectElement) || null;

    const checkCountry = () => {
      if (isSupported(country.value)) {
        if (pl) show(pl.context);
        if (f) show(f.elem);
        if (af) af.view.attach();
      } else {
        if (pl) hide(pl.context);
        if (f) hide(f.elem);
        if (af) af.view.detach();
      }
    };

    if (config.watchCountry && country) {
      (window.jQuery as any)(country).change(checkCountry);
      checkCountry();
    }
  });
};
