import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  retries: {
    runMode: 1,
    openMode: 0,
  },
  viewportHeight: 1000,
  viewportWidth: 1800,
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.ts",
  },
  component: {
    specPattern: "**/**/*.cy.tsx",
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
