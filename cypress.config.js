import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8000",
    video: false,
    testIsolation: false,
    specPattern: "cypress/integration/**/**.ts",
  },
  viewportWidth: 1920,
  viewportHeight: 1024,
  env: {
    "WC_VERSION": "80",
    "API_KEY": "ak_marcin"
  }
});
