import { Binding } from "@ideal-postcodes/jsutil";
import { newBind } from "./extension";

export const pageTest = (): boolean =>
  document.querySelector(".woocommerce-checkout") !== null;

export const selectors = {
  line_1: "#billing_address_1",
  line_2: "#billing_address_2",
  post_town: "#billing_city",
  county: "#billing_state",
  postcode: "#billing_postcode",
  organisation: "#billing_company",
  country: "#billing_country",
};

export const bind = newBind(selectors);

//@ts-ignore
export const binding: Binding = { pageTest, bind };
