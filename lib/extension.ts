import { AddressFinder }from "@ideal-postcodes/address-finder";
import { PostcodeLookup } from "@ideal-postcodes/postcode-lookup";
import {
  Selectors,
  Config,
  idGen,
  isString,
  OutputFields,
  hide,
  toHtmlElem,
  isInput,
  update,
  insertBefore,
  Targets,
  getParent,
  AnyAddress,
  loaded,
  markLoaded,
  toArray,
} from "@ideal-postcodes/jsutil";

if (!window.IdealPostcodes) window.IdealPostcodes = {};
window.IdealPostcodes.AddressFinder = AddressFinder;
window.IdealPostcodes.PostcodeLookup = PostcodeLookup;

const isSupported = (c: string | null): boolean => {
  if(c === null) return false;
  if(c.length > 2) {
    return [ "United Kingdom (UK)", "Isle of Man", "Jersey", "Guernsey" ].indexOf(c || "") !== -1;
  }
  return [ "GB", "IM", "JE", "GG" ].indexOf(c || "") !== -1;
}

const isDiv = (e: HTMLElement | null): e is HTMLDivElement => {
  if (e === null) return false;
  return (
    e instanceof HTMLDivElement || e.constructor.name === "HTMLDivElement"
  );
};

interface Result {
  selectContainer: HTMLElement;
  context: HTMLElement;
  button: HTMLElement;
  input: HTMLElement;
  wrapper: HTMLElement;
}

const newSpan = (innerElem: HTMLElement, blocks: boolean = false): HTMLElement => {
  const span = document.createElement(blocks ? "div" : "span");
  span.className = blocks ? "wc-block-components-text-input" : "woocommerce-input-wrapper";
  span.appendChild(innerElem);
  return span;
};

type SelectorAttr = string[];

interface SelectorParsed {
  tag: string | null,
  classes: string[],
  id: string | null,
  attrs: SelectorAttr[]
}

/**
 * Parse CSS selector
 * @param subSelector
 */
const parseSelector = (subSelector: string): SelectorParsed => {
  const obj: SelectorParsed = { tag: null, classes:[], id: null, attrs:[]};
  subSelector.split(/(?=\.)|(?=#)|(?=\[)/).forEach((token: string) => {
    switch (token[0]) {
      case '#':

        obj.id = token.slice(1);
        break;
      case '.':
        obj.classes.push(token.slice(1));
        break;
      case '[':
        obj.attrs.push(token.slice(1,-1).split('='));
        break;
      default :
        obj.tag = token
        break;
    }
  });
  return obj;
}

interface PostcodeFieldConfig {
  entity?: string;
  contextClass?: string | null;
  inputClass?: string;
  buttonClass?: string;
}

/**
 * Creates container for Postcode Lookup
 */
// eslint-disable-next-line
export const insertPostcodeField = (targets: Targets, config: PostcodeFieldConfig, blocks: boolean = false): Result | null => {
  if (targets.line_1 === null) return null;
  const entity: string = config.entity || (blocks ? "div" : "p");
  const contextClass: string | null = config.contextClass || null;
  const selector = parseSelector(entity);
  const tag = selector.tag !== null ? selector.tag : entity;
  const wrapperClass = contextClass !== null ? contextClass : "form-row";
  const target = getParent(targets.line_1, tag, (element) => {
    let check = true;
    if(selector.classes.length > 0) {
      check = selector.classes.every(cls => element.classList.contains(cls));
    }
    if(selector.id && selector.id !== element.id) check = false;
    return check;
  });
  if (target === null) return null;
  const wrapper = document.createElement(tag);
  wrapper.className = blocks ? `wc-block-components-text-input ${contextClass}` :`${wrapperClass} idpc_lookup field`;
  if(blocks) {
    wrapper.setAttribute("style", "display: flex; justify-content: space-between; column-gap:16px; flex-flow: wrap;");
  }

  insertBefore({ target, elem: wrapper });
  const label = document.createElement("label");
  label.innerText = "Postcode Lookup";

  if(!blocks) {
    wrapper.appendChild(label);
  }

  const input = document.createElement("input");
  if(!blocks) input.className = config.inputClass || "idpc-input";
  input.type = "text";
  if(!blocks) input.placeholder = "Enter your postcode";
  input.setAttribute(
    "aria-label",
    "Search a postcode to retrieve your address"
  );
  input.id = "idpc_input";
  if(blocks) {
    input.addEventListener("focus", () => wrapper.classList.add("is-active"));
    input.addEventListener("blur", () => {
      if(input.value === "") wrapper.classList.remove("is-active");
    });
  }
  if(blocks) {
    const span = newSpan(input, blocks);
    span.appendChild(label);
    span.setAttribute("style", "flex: 2 1 0;");
    label.setAttribute("for", input.id)
    wrapper.appendChild(span);
  } else {
    wrapper.appendChild(newSpan(input));
  }

  const button = document.createElement("button");
  const span = newSpan(button, blocks);
  wrapper.appendChild(span);
  button.type = "button";
  button.className = config.buttonClass || blocks ? "components-button wc-block-components-button" : "idpc-button btn";
  button.innerText = "Find my Address";
  button.id = "idpc_button";
  button.setAttribute("style", "width: 100%; height: 100%");
  if(blocks) span.setAttribute("style", "flex: 1 1 0;")

  let selectContainer = document.createElement(blocks ? "div" : "span");
  if(!blocks) {
    selectContainer.className = "selection";
    wrapper.appendChild(newSpan(selectContainer));
  } else {
    const label = document.createElement("label");
    const breaker = document.createElement("div");
    breaker.style.height = "0";
    breaker.style.flexBasis = "100%";
    label.setAttribute("for", "idpc_dropdown");
    label.innerText = "Select your address";
    selectContainer.classList.add("wc-block-components-text-input");
    selectContainer.classList.add("selection");
    selectContainer.classList.add("is-active");
    selectContainer.setAttribute("style", "display:none; flex-basis:100%");
    selectContainer.appendChild(label);
    wrapper.appendChild(breaker);
    wrapper.appendChild(selectContainer);
  }

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

export const toOutputFields = (
  config: Config,
  selectors: Selectors
): OutputFields => {
  const outputFields: OutputFields = { ...selectors };
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

interface WooConfig extends Config {
  entity?: string;
  contextClass?: string;
}

const getAnchors = (selector: string): HTMLElement[] => {
  const matches = window.document.querySelectorAll(selector);
  const anchors = toArray(matches).filter((e) => !loaded(e));
  if (anchors.length === 0) return [];
  anchors.forEach((anchor) => markLoaded(anchor));
  return anchors;
};

interface PageBindings {
  anchor: HTMLElement;
  targets: Targets;
  parent: HTMLElement;
}

interface SetupOptions {
  selectors: Selectors
}

interface Setup {
  (options: SetupOptions): PageBindings[];
}

const getTargets = (
  parent: HTMLElement,
  selectors: Selectors
): Targets | null => {
  const line_1: HTMLElement | null = toHtmlElem(parent, selectors.line_1);
  const post_town: HTMLElement | null = toHtmlElem(parent, selectors.post_town);
  const postcode: HTMLElement | null = toHtmlElem(parent, selectors.postcode);
  const line_2: HTMLElement | null = toHtmlElem(parent, selectors.line_2);
  const line_3: HTMLElement | null = toHtmlElem(parent, selectors.line_3);
  const country: HTMLElement | null = toHtmlElem(parent, selectors.country);
  const county: HTMLElement | null = toHtmlElem(parent, selectors.county);
  const organisation: HTMLElement | null = toHtmlElem(
    parent,
    selectors.organisation
  );

  return {
    line_1,
    line_2,
    line_3,
    post_town,
    county,
    postcode,
    organisation,
    country,
  };
};

const setup: Setup = ({ selectors }) => {
  const anchors = getAnchors(selectors.line_1);
  return anchors.reduce<PageBindings[]>((prev, anchor) => {
    const parent = getParent(anchor, "form");
    if (!parent) return prev;

    const targets = getTargets(parent, selectors);
    if (targets === null) return prev;

    prev.push({ targets, parent, anchor });
    return prev;
  }, []);
}

export const newBind = (selectors: Selectors, blocks: boolean = false) => (config: WooConfig) => {
  if (config.enabled !== true) return;
  const pageBindings = setup({ selectors });
  const outputFields = toOutputFields(config, selectors);

  pageBindings.forEach((binding) => {
    const { targets, parent } = binding;

    const localConfig = {
      scope: parent,
      apiKey: config.apiKey,
      tags,
      outputFields,
      onAddressPopulated: function(address: AnyAddress) {
        if (isString(outputFields.country)) {
          const countryField = toHtmlElem(parent, outputFields.country);
          //@ts-expect-error
          let county = toHtmlElem(parent, outputFields.county);
          if(isDiv(county)) {
            county = county.querySelector("input");
          }
          //in case input is readonly when enforced country by owner
          if(countryField && isInput(countryField) && countryField.getAttribute("readonly") !== null) {
            update(countryField, address.country_iso_2);
          }

          if(blocks) {
            //@ts-expect-error
            countryField?.parentElement?.parentElement?.nextSibling?.firstChild.click();
            if(county) {
              if (isInput(county)) {
                update(county, address.county);
                //@ts-expect-error
                county?.parentElement?.parentElement?.nextSibling?.firstChild.click();
              } else {
                //@ts-expect-error
                update(county, address.county_code);
              }
            }
            //ensure blur on population for better reopen search after click
            //@ts-expect-error
            setTimeout(() => this.input.blur(), 200);
          }
        }
        updateCheckout();
      },
    };

    let plContainer: HTMLElement;
    if (config.postcodeLookup) {
      const insertConfig = {
        ...config,
        ...config.postcodeLookupOverride
      }
      const result = insertPostcodeField(targets, insertConfig, blocks);
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
          onSelectCreated:function (select) {
            if(blocks) {
              //get input styles and apply to select
              const copyNodeStyle = function (sourceNode: HTMLElement, targetNode: HTMLElement) {
                const computedStyle = window.getComputedStyle(sourceNode);
                Array.from(computedStyle).forEach(key => targetNode.style.setProperty(key, computedStyle.getPropertyValue(key), computedStyle.getPropertyPriority(key)))
              }
              const input = document.querySelector('.wc-block-components-text-input input[type="text"]') as HTMLElement;
              copyNodeStyle(input, select);
              select.style.width = "100%";
              select.style.padding = "1.5em .5em .5em";
            }
            if(config.postcodeLookupOverride.onSelectCreated !== undefined) {
              config.postcodeLookupOverride.onSelectCreated.call(this, select);
            }
          }
        });
      }

      let country = (targets.country as HTMLSelectElement) || null;
      if(isDiv(country)) {
        //@ts-expect-error
        country = country.querySelector("input");
      }

      const checkCountry = () => {
        if (isSupported(country.value)) {
          if (plContainer) plContainer.style.display = blocks ? "flex" : "block";
        } else {
          if (plContainer) hide(plContainer);
        }
      };

      country?.addEventListener("change", checkCountry);

      const handleValueChange = () => {
        country.dispatchEvent(new Event("change", { bubbles: true }))
      }

      let oldValue = country.value;
      // Create a MutationObserver to detect changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
            const newValue = country.value;
            if (newValue !== oldValue) {
              oldValue = newValue;
              handleValueChange();
            }
          }
        });
      });

      // Configure the observer
      observer.observe(country, {
        attributes: true
      });
      //observer for sudo select etc in accounts
      const shadowSelectSpan = document.querySelector(`#select2-${selectors.country.replace(/#|\./g, "")}-container`);
      if(shadowSelectSpan !== null) {
        let oldValue = shadowSelectSpan.getAttribute("title");
        // Create a MutationObserver to detect changes
        const observerShadow = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'title') {
              const newValue = shadowSelectSpan.getAttribute("title");
              if (newValue !== oldValue) {
                oldValue = newValue;
                handleValueChange();
              }
            }
          });
        });
        observerShadow.observe(shadowSelectSpan, {
          attributes: true
        });
      }

      checkCountry();
    }

    let f: FinderContainer | null;
    if (config.autocomplete) {
      f = config.separateFinder ? insertAddressFinder(targets) : null;
      AddressFinder.setup({
        ...config,
        autocomplete: AddressFinder.defaults.autocomplete, // Temporary fix for clash
        ...localConfig,
        inputField: f ? f.input : selectors.line_1,
        ...config.autocompleteOverride,
        onMounted: function() {
          if(config.autocompleteOverride.onMounted !== undefined
            && typeof config.autocompleteOverride.onMounted === "function") {
            config.autocompleteOverride.onMounted.call(this);
          }
          this.list.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
          });
        }
      });
    }
  });
};
