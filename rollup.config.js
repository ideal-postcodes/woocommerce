import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import ts from "@wessberg/rollup-plugin-ts";
import inject from "@rollup/plugin-inject";

const polyfills = {
  Promise: "promise-polyfill",
  Set: "core-js-pure/features/set",
  "Object.assign": "core-js-pure/features/object/assign",
};

const banner = `/**
 * @license
 * Ideal Postcodes <https://ideal-postcodes.co.uk>
 * WooCommerce Integration
 * Copyright IDDQD Limited, all rights reserved
 */`;

// Configure terser to ignore build info banner
const terserConfig = {
  output: {
    comments: (_, { value, type }) => {
      if (type === "comment2") return /@license/i.test(value);
    },
  },
};

const context = "window";

const targets = "ie 11";

export default [
  {
    input: "lib/index.ts",
    output: {
      file: "./uk-address-postcode-validation/js/woocommerce.min.js",
      banner,
      format: "umd",
      name: "IdealPostcodes",
      exports: "named",
    },
    plugins: [
      resolve({
        preferBuiltins: true,
        mainFields: ["browser", "module", "main"],
        browser: true,
      }),
      commonjs(),
      inject(polyfills),
      ts({
        transpiler: "babel",
        browserslist: [targets],
        babelConfig: {
          presets: [["@babel/preset-env", { targets }]],
        },
      }),
      terser(terserConfig),
    ],
  },
  {
    //admin script
    input: "lib/admin.ts",
    output: {
      file: "./uk-address-postcode-validation/js/admin-woocommerce.min.js",
      banner,
      format: "umd",
      name: "IdealPostcodes",
      exports: "named",
    },
    plugins: [
      resolve({
        preferBuiltins: true,
        mainFields: ["browser", "module", "main"],
        browser: true,
      }),
      commonjs(),
      inject(polyfills),
      ts({
        transpiler: "babel",
        browserslist: [targets],
        babelConfig: {
          presets: [["@babel/preset-env", { targets }]],
        },
      }),
      terser(terserConfig),
    ],
  }
];
