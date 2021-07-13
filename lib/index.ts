import { setup } from "@ideal-postcodes/jsutil";

// Load up available bindings
import * as billing from "./checkout_billing";
import * as shipping from "./checkout_shipping";
import * as accountShipping from "./account_shipping";
import * as accountBilling from "./account_billing";

setup({
  //@ts-ignore
  bindings: [billing, shipping, accountShipping, accountBilling],
  window,
});
