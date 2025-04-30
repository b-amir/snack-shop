/// <reference types="cypress" />

describe("Cart Session Cookie Handling", () => {
  const CART_COOKIE_NAME = "cartSessionId";

  const closeCartDropdown = () => {
    cy.get("body").click(0, 0, { force: true });
  };

  it("should set/clear session cookie and reflect in cart state", () => {
    cy.clearCookies();

    cy.addProductToCart(0).then(() => {
      cy.getCookie(CART_COOKIE_NAME)
        .should("exist")
        .its("value")
        .should("be.a", "string")
        .and("not.be.empty")
        .then((initialSessionId) => {
          cy.log(`Initial session ID: ${initialSessionId}`);
          cy.wrap(initialSessionId).as("initialSessionId");
        });

      cy.openCart();
      cy.get('[data-testid^="cart-item-"]').should("have.length", 1);
      closeCartDropdown();
    });

    cy.clearCookies();
    cy.log("Cookies cleared");
    cy.getCookie(CART_COOKIE_NAME).should("not.exist");

    cy.reload();

    cy.openCart();
    cy.get('[data-testid^="cart-item-"]').should("not.exist");
    cy.contains(/your cart is empty/i).should("be.visible");
    closeCartDropdown();

    cy.addProductToCart(1).then(() => {
      cy.getCookie(CART_COOKIE_NAME)
        .should("exist")
        .its("value")
        .should("be.a", "string")
        .and("not.be.empty")
        .then((newSessionId) => {
          cy.log(`New session ID: ${newSessionId}`);
          cy.get("@initialSessionId").then((initialSessionId) => {
            expect(newSessionId).to.not.equal(initialSessionId);
          });
        });

      cy.openCart();
      cy.get('[data-testid^="cart-item-"]').should("have.length", 1);
      closeCartDropdown();
    });
  });
});
