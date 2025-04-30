/// <reference types="cypress" />

describe("Caching and Localization", () => {
  it("should load products, potentially using cache on reload", () => {
    cy.get('[data-testid^="product-card-"]').should("have.length.at.least", 1);
    cy.get('[data-testid^="product-card-"]').first().should("be.visible");
    cy.log("Initial product load successful.");

    cy.reload();
    cy.get('[data-testid^="product-card-"]').should("have.length.at.least", 1);
    cy.get('[data-testid^="product-card-"]').first().should("be.visible");
    cy.log(
      "Products loaded successfully after reload (cache status depends on server implementation)."
    );
  });

  it("should navigate to product details and back", () => {
    cy.get('[data-testid^="product-card-"]')
      .first()
      .invoke("attr", "data-testid")
      .then((testId) => {
        const productId = testId?.replace("product-card-", "");
        cy.wrap(productId).as("productId");

        cy.get(`[data-testid="product-card-${productId}"]`)
          .find("a")
          .first()
          .click();
      });

    cy.get("@productId").then((productId) => {
      cy.url().should("include", `/products/${productId}`);
      cy.log("Successfully loaded product detail page");
    });

    cy.go("back");
    cy.url().should("not.include", "/products/");
    cy.get('[data-testid^="product-card-"]').should("have.length.at.least", 1);
    cy.log("Successfully navigated back to product list.");

    cy.get("@productId").then((productId) => {
      cy.get(`[data-testid="product-card-${productId}"]`).click();
      cy.url().should("include", `/products/${productId}`);
      cy.log("Successfully re-navigated to product detail page.");
    });
  });

  it("should display different content when locale changes (if switcher exists)", function () {
    // Get initial text of the first product card
    let initialCardText: string;
    cy.get('[data-testid^="product-card-"]')
      .first()
      .invoke("text")
      .then((text) => {
        initialCardText = text;
        cy.log("Initial card text captured.");
      });

    cy.get("body").then(($body) => {
      const langButton = $body.find(
        'button:contains("English"), button:contains("EN")'
      );
      if (langButton.length > 0) {
        cy.wrap(langButton).first().click();
        cy.contains("button", "فارسی").should("be.visible");
        cy.contains("button", "فارسی").click();

        cy.url().should("include", "/fa/");

        // Verify the text of the first card is different after locale switch
        cy.get('[data-testid^="product-card-"]')
          .first()
          .invoke("text")
          .then((newCardText) => {
            expect(newCardText).to.not.equal(initialCardText);
            cy.log("Locale switched and first card text content changed.");
          });
      } else {
        cy.log(
          "Language switcher not found, skipping locale change verification."
        );
      }
    });
  });
});
