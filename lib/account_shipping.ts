import { Binding } from "@ideal-postcodes/jsutil";
import { newBind } from "./extension";

export const pageTest = (): boolean =>
  document.querySelector(".woocommerce-address-fields") !== null;

export const selectors = {
  line_1: "#shipping_address_1",
  line_2: "#shipping_address_2",
  post_town: "#shipping_city",
  county: "#shipping_state",
  postcode: "#shipping_postcode",
  organisation_name: "#shipping_company",
  country: "#shipping_country",
};

export const bind = newBind(selectors);

//@ts-ignore
export const binding: Binding = { pageTest, bind };
