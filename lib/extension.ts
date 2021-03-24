import {
  Selectors,
  Config,
  idGen,
  isString,
  OutputFields,
  toIso,
  hide,
  show,
  toHtmlElem,
  isInput,
  update,
  setupBind,
  insertBefore,
  Targets,
  getParent,
} from "@ideal-postcodes/jsutil";
import {
  AddressFinder,
  Controller as AfController,
} from "@ideal-postcodes/address-finder";
import { PostcodeLookup } from "@ideal-postcodes/postcode-lookup";
import { Address } from "@ideal-postcodes/api-typings";

if (!window.IdealPostcodes) window.IdealPostcodes = {};
window.IdealPostcodes.AddressFinder = AddressFinder;
window.IdealPostcodes.PostcodeLookup = PostcodeLookup;

const isSupported = (c: string | null): boolean =>
  ["GB", "IM", "JE", "GG"].indexOf(c || "") !== -1;

interface Result {
  selectContainer: HTMLElement;
  context: HTMLElement;
  button: HTMLElement;
  input: HTMLElement;
  wrapper: HTMLElement;
}

const newSpan = (innerElem: HTMLElement): HTMLElement => {
  const span = document.createElement("span");
  span.className = "woocommerce-input-wrapper";
  span.appendChild(innerElem);
  return span;
};

/**
 * Creates container for Postcode Lookup
 */
export const insertPostcodeField = (targets: Targets): Result | null => {
  if (targets.line_1 === null) return null;
  const target = getParent(targets.line_1, "p");
  if (target === null) return null;
  const wrapper = document.createElement("p");
  wrapper.className = "form-row idpc_lookup field";

  insertBefore({ target, elem: wrapper });

  const label = document.createElement("label");
  label.innerText = "Postcode Lookup";
  wrapper.appendChild(label);

  const input = document.createElement("input");
  input.className = "idpc-input";
  input.type = "text";
  input.placeholder = "Enter your postcode";
  input.setAttribute(
    "aria-label",
    "Search a postcode to retrieve your address"
  );
  input.id = "idpc_input";
  wrapper.appendChild(newSpan(input));

  const button = document.createElement("button");
  button.type = "button";
  button.className = "idpc-button btn";
  button.innerText = "Find my Address";
  button.id = "idpc_button";
  wrapper.appendChild(newSpan(button));

  const selectContainer = document.createElement("span");
  selectContainer.className = "selection";
  wrapper.appendChild(newSpan(selectContainer));

  const context = document.createElement("div");
  wrapper.appendChild(context);

  return { button, input, context, selectContainer, wrapper };
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
      onAddressPopulated: (address: Address) => {
        if (isString(outputFields.country)) {
          const countryField = toHtmlElem(parent, outputFields.country);
          if (isInput(countryField)) {
            const iso = toIso(address);
            if (iso) update(countryField, iso);
          }
        }
        updateCheckout();
      },
    };

    let plContainer: HTMLElement;
    if (config.postcodeLookup) {
      const result = insertPostcodeField(targets);
      if (result) {
        const { context, button, input, selectContainer, wrapper } = result;
        plContainer = wrapper;
        PostcodeLookup.setup({
          ...legacyPostcodeConfig,
          ...config,
          ...localConfig,
          context,
          input,
          button,
          selectContainer,
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
        if (plContainer) show(plContainer);
        if (f) show(f.elem);
        if (af) af.view.attach();
      } else {
        if (plContainer) hide(plContainer);
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
