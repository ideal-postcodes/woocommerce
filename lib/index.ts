import { setup } from "@ideal-postcodes/jsutil";

// Load up available bindings
import * as billing from "./checkout_billing";
import * as shipping from "./checkout_shipping";
import * as accountShipping from "./account_shipping";
import * as accountBilling from "./account_billing";
import * as billingBlocks from "./checkout_blocks_billing";
import * as checkoutBlocks from "./checkout_blocks_shipping";

setup({
  //@ts-ignore
  bindings: [billing, shipping, accountShipping, accountBilling, checkoutBlocks, billingBlocks],
  window,
});
