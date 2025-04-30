import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // Your app's base URL
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
