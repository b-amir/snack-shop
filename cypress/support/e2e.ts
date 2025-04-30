import "./commands";

Cypress.on("window:before:load", (win) => {
  delete (win.navigator as unknown as Record<string, unknown>).serviceWorker;
});

beforeEach(() => {
  cy.visit("/");

  cy.window().then((win) => {
    win.localStorage.removeItem("cart");
  });

  cy.fixture("example.json").as("testData");
});
