export const fetchProductDetails = async (productId: string) => {
  try {
    const response = await fetch(`/api/products/${productId}`);
    if (!response.ok) {
      console.warn(`Product not found: ${productId}`);
      return null;
    }
    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
};
