/// <reference types="cypress" />
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      addProductToCart(productIndex?: number): Chainable;
      openCart(): Chainable;
      checkCartCount(expectedCount: number): Chainable;
      changeItemQuantity(productId: string, newQuantity: number): Chainable;
      waitForNetworkIdle(timeout?: number, minIdleTime?: number): Chainable;
    }
  }
}

Cypress.Commands.add("addProductToCart", (productIndex = 0) => {
  return cy
    .get('[data-testid^="product-card-"]')
    .eq(productIndex)
    .invoke("attr", "data-testid")
    .then((testId) => {
      if (!testId) {
        throw new Error("data-testid not found on product card");
      }
      const productId = testId.replace("product-card-", "");
      cy.get(`[data-testid="product-card-${productId}"]`).within(() => {
        cy.contains("button", /add to cart/i).click();
      });
      return cy.wrap(productId);
    });
});

Cypress.Commands.add("openCart", () => {
  cy.get('[data-testid="cart-icon-button"]').click();
});

Cypress.Commands.add("checkCartCount", (expectedCount: number) => {
  if (expectedCount === 0) {
    cy.get('[data-testid="cart-count"]').should("not.exist");
  } else {
    cy.get('[data-testid="cart-count"]').should(
      "contain",
      expectedCount.toString()
    );
  }
});

Cypress.Commands.add(
  "changeItemQuantity",
  (productId: string, newQuantity: number) => {
    cy.get(`[data-testid="cart-item-${productId}"]`).within(() => {
      cy.get('[data-testid="quantity-display"]')
        .should("exist")
        .then(($input) => {
          const currentValue = parseInt($input.val() as string, 10) || 1;

          if (currentValue < newQuantity) {
            for (let i = currentValue; i < newQuantity; i++) {
              cy.get(`[data-testid="increase-qty-${productId}"]`).click();
              cy.wait(200);
            }
          } else if (currentValue > newQuantity) {
            for (let i = currentValue; i > newQuantity; i--) {
              cy.get(`[data-testid="decrease-qty-${productId}"]`).click();
              cy.wait(200);
            }
          }

          cy.get('[data-testid="quantity-display"]').should(
            "have.value",
            newQuantity.toString()
          );
        });
    });
  }
);

Cypress.Commands.add(
  "waitForNetworkIdle",
  (timeout: number = 5000, minIdleTime: number = 100) => {
    cy.log(
      `Waiting for network idle (timeout: ${timeout}ms, minIdle: ${minIdleTime}ms)`
    );
    cy.window().then((win) => {
      let lastRequestTime = 0;
      let idleTimer: number | undefined;

      const isIdle = () => {
        const resources = win.performance.getEntriesByType("resource");
        const now = Date.now();
        let latestEndTime = lastRequestTime;

        resources.forEach((resource) => {
          if (
            (resource as PerformanceResourceTiming).responseEnd > latestEndTime
          ) {
            latestEndTime = (resource as PerformanceResourceTiming).responseEnd;
          }
        });

        if (latestEndTime > lastRequestTime) {
          lastRequestTime = latestEndTime;
          if (idleTimer) win.clearTimeout(idleTimer);
          idleTimer = undefined;
          return false;
        } else {
          if (!idleTimer) {
            idleTimer = win.setTimeout(() => {
              cy.log("Network is idle.");
            }, minIdleTime);
          }
          return now - lastRequestTime >= minIdleTime;
        }
      };

      const check = (startTime: number) => {
        const now = Date.now();
        if (now - startTime > timeout) {
          throw new Error(
            `Timed out waiting for network idle after ${timeout}ms`
          );
        }

        const idle = isIdle();
        if (idle) {
          cy.log("Network considered idle.");
        } else {
          cy.wait(50, { log: false }).then(() => check(startTime));
        }
      };

      check(Date.now());
    });
  }
);

export {};
