/// <reference types="cypress" />

describe("Cart Functionality", () => {
  it("should add a product and verify it in the cart dropdown", () => {
    cy.addProductToCart(0).then((productId) => {
      cy.checkCartCount(1);
      cy.openCart();
      cy.get(`[data-testid="cart-item-${productId}"]`).should("exist");
    });
  });

  it("should increase and decrease item quantity in the cart dropdown", () => {
    cy.addProductToCart(0).then((productId) => {
      cy.checkCartCount(1);
      cy.openCart();

      cy.get(`[data-testid="cart-item-${productId}"]`).within(() => {
        cy.get('[data-testid="quantity-display"]').should("have.value", "1");
        cy.get(`[data-testid="increase-qty-${productId}"]`).click();
        cy.get('[data-testid="quantity-display"]').should("have.value", "2");
      });

      cy.checkCartCount(1);
      cy.get(`[data-testid="cart-item-${productId}"]`).within(() => {
        cy.get(`[data-testid="decrease-qty-${productId}"]`).click();
        cy.get('[data-testid="quantity-display"]').should("have.value", "1");
      });
      cy.checkCartCount(1);
    });
  });

  it("should remove an item from the cart page", () => {
    cy.addProductToCart(0).then((productId) => {
      cy.checkCartCount(1);

      cy.visit("/en/cart");

      cy.get(`[data-testid="cart-item-${productId}"]`).within(() => {
        cy.get('[data-testid="quantity-display"]').should("exist");
        cy.get(`[data-testid="remove-item-${productId}"]`).click();
      });

      cy.get(`[data-testid="cart-item-${productId}"]`).should("not.exist");
      cy.contains(/your cart is empty/i).should("be.visible");
      cy.checkCartCount(0);
    });
  });

  it("should add multiple different products to the cart", () => {
    let firstProductId: string;
    cy.addProductToCart(0)
      .then((id) => {
        firstProductId = id;
        cy.checkCartCount(1);
        return cy.addProductToCart(1);
      })
      .then((secondProductId) => {
        cy.checkCartCount(2);
        cy.openCart();
        cy.get(`[data-testid="cart-item-${firstProductId}"]`).should("exist");
        cy.get(`[data-testid="cart-item-${secondProductId}"]`).should("exist");
      });
  });
});
