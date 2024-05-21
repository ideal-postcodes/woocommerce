import { Binding } from "@ideal-postcodes/jsutil";
import { newBind } from "./extension";

export const pageTest = (): boolean => {
  return document.querySelector('div[data-block-name="woocommerce/checkout"]') !== null;
}

export const selectors = {
  line_1: "#billing-address_1",
  line_2: "#billing-address_2",
  post_town: "#billing-city",
  county: "#billing-state",
  postcode: "#billing-postcode",
  organisation: "#billing-company",
  country: "#billing-country input",
};

export const bind = newBind(selectors, true);

//@ts-ignore
export const binding: Binding = { pageTest, bind };
