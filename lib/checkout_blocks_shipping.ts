import { Binding } from "@ideal-postcodes/jsutil";
import { newBind } from "./extension";

export const pageTest = (): boolean =>
  document.querySelector('div[data-block-name="woocommerce/checkout"]') !== null;

export const selectors = {
  line_1: "#shipping-address_1",
  line_2: "#shipping-address_2",
  post_town: "#shipping-city",
  county: "#shipping-state",
  postcode: "#shipping-postcode",
  organisation_name: "#shipping-company",
  country: "#shipping-country input",
};

export const bind = newBind(selectors, true);

//@ts-ignore
export const binding: Binding = { pageTest, bind };
