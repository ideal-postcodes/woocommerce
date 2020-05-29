import { Binding, relevantPage, config, loadAutocomplete } from "@ideal-postcodes/jsutil";

// Load up available bindings
import * as billing from "./checkout_billing";
import * as shipping from "./checkout_shipping";
import * as accountShipping from "./account_shipping";
import * as accountBilling from "./account_billing";

const bindings: Binding[] = [
  billing,
  shipping,
  accountShipping,
  accountBilling,
];

const startInitTimer = () => setTimeout(init, 1000);

/**
 * Checks if page is relevant
 *
 * Loads required assets
 *
 * Starts plugin watcher when assets are available
 *
 * Starts bindings
 */
const init = (): unknown => {
  // Exit if any of the below guard clauses fail
  const c = config();
  if (c === undefined) return;
  if (!c.enabled) return;
  if (!relevantPage(bindings)) return;

  // Retrieve assets
  loadAutocomplete(c);

  // Check if assets present, if not, try again later
  if (window.IdealPostcodes === undefined) return startInitTimer();
  if (window.IdealPostcodes.Autocomplete === undefined) return startInitTimer();
  if (window.IdealPostcodes.Autocomplete.Controller === undefined)
    return startInitTimer();

  // When assets ready, apply bindings
  return bindings.forEach((b) => b.start(c));
};

init();
