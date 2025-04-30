import {
  fetchProducts,
  fetchProductById,
  fetchRelatedProducts,
} from "./productService";
import {
  checkCache,
  fetchProductsAndCache,
  fetchSingleProductAndCache,
  buildApiUrl,
} from "@/utils/services/helpers";
import {
  PRODUCT_LIST_CACHE_TTL,
  PRODUCT_DETAIL_CACHE_TTL,
  RELATED_PRODUCTS_CACHE_TTL,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_ORDER,
  CACHE_KEY_PRODUCT_LIST_PREFIX,
  CACHE_KEY_PRODUCT_DETAIL_PREFIX,
  CACHE_KEY_RELATED_PRODUCTS_PREFIX,
  RELATED_PRODUCTS_DEFAULT_LIMIT,
} from "@/constants";
import { ProductsResponse } from "./types";
import { Product } from "@/types/product";

jest.mock("@/utils/services/helpers", () => ({
  checkCache: jest.fn(),
  fetchProductsAndCache: jest.fn(),
  fetchSingleProductAndCache: jest.fn(),
  buildApiUrl: jest.fn((path, params) => {
    if (params && String(params).length > 0) {
      return `${path}?${params}`;
    }
    return path;
  }),
}));

const mockProduct: Product = {
  id: "p1",
  name: { en: "Prod 1", fa: "م ۱" },
  price: { en: 10, fa: 1000 },
  currency: { en: "USD", fa: "تومان" },
  imageUrlLocal: "/img1.jpg",
  imageUrlCdn: "/cdn1.jpg",
  description: { en: "Desc 1", fa: "ت ۱" },
  dateAdded: "2023-01-01T00:00:00.000Z",
  tags: { en: ["tag1"], fa: ["تگ۱"] },
};

describe("productService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchProducts", () => {
    it("should return cached data if available", async () => {
      const cachedData: ProductsResponse = {
        products: [mockProduct],
        pagination: {
          totalProducts: 1,
          totalPages: 1,
          currentPage: 1,
          limit: DEFAULT_PAGE_SIZE,
        },
      };
      (checkCache as jest.Mock).mockResolvedValueOnce(cachedData);
      const result = await fetchProducts();
      expect(checkCache).toHaveBeenCalledWith(
        `${CACHE_KEY_PRODUCT_LIST_PREFIX}1:${DEFAULT_PAGE_SIZE}:${DEFAULT_SORT_ORDER}`
      );
      expect(fetchProductsAndCache).not.toHaveBeenCalled();
      expect(result).toEqual(cachedData);
    });

    it("should fetch and cache data if not cached", async () => {
      const fetchedData: ProductsResponse = {
        products: [mockProduct],
        pagination: {
          totalProducts: 1,
          totalPages: 1,
          currentPage: 2,
          limit: 10,
        },
      };
      (checkCache as jest.Mock).mockResolvedValueOnce(null);
      (fetchProductsAndCache as jest.Mock).mockResolvedValueOnce(fetchedData);

      const result = await fetchProducts({
        page: 2,
        pageSize: 10,
        sort: "price_asc",
      });

      const expectedCacheKey = `${CACHE_KEY_PRODUCT_LIST_PREFIX}2:10:price_asc`;
      const expectedUrl = `/products?page=2&pageSize=10&sort=price_asc`;

      expect(checkCache).toHaveBeenCalledWith(expectedCacheKey);
      expect(buildApiUrl).toHaveBeenCalledWith(
        "/products",
        expect.any(URLSearchParams)
      );
      expect(fetchProductsAndCache).toHaveBeenCalledWith(
        expectedUrl,
        expectedCacheKey,
        PRODUCT_LIST_CACHE_TTL,
        expect.any(String)
      );
      expect(result).toEqual(fetchedData);
    });

    it("should use default parameters when none are provided", async () => {
      (checkCache as jest.Mock).mockResolvedValueOnce(null);
      await fetchProducts();

      const expectedCacheKey = `${CACHE_KEY_PRODUCT_LIST_PREFIX}1:${DEFAULT_PAGE_SIZE}:${DEFAULT_SORT_ORDER}`;
      const expectedUrl = `/products?page=1&pageSize=${DEFAULT_PAGE_SIZE}&sort=${DEFAULT_SORT_ORDER}`;

      expect(checkCache).toHaveBeenCalledWith(expectedCacheKey);
      expect(buildApiUrl).toHaveBeenCalledWith(
        "/products",
        expect.any(URLSearchParams)
      );
      expect(fetchProductsAndCache).toHaveBeenCalledWith(
        expectedUrl,
        expectedCacheKey,
        PRODUCT_LIST_CACHE_TTL,
        expect.any(String)
      );
    });
  });

  describe("fetchRelatedProducts", () => {
    const params = { productId: "p1", locale: "en" };

    it("should return cached related products if available", async () => {
      const cachedData: Product[] = [mockProduct];
      (checkCache as jest.Mock).mockResolvedValueOnce(cachedData);
      const result = await fetchRelatedProducts(params);
      expect(checkCache).toHaveBeenCalledWith(
        `${CACHE_KEY_RELATED_PRODUCTS_PREFIX}p1:en:${RELATED_PRODUCTS_DEFAULT_LIMIT}`
      );
      expect(fetchProductsAndCache).not.toHaveBeenCalled();
      expect(result).toEqual(cachedData);
    });

    it("should fetch and cache related products if not cached", async () => {
      const fetchedData: Product[] = [mockProduct];
      const limit = 5;
      (checkCache as jest.Mock).mockResolvedValueOnce(null);
      (fetchProductsAndCache as jest.Mock).mockResolvedValueOnce(fetchedData);

      const result = await fetchRelatedProducts({ ...params, limit });

      const expectedCacheKey = `${CACHE_KEY_RELATED_PRODUCTS_PREFIX}p1:en:${limit}`;
      const expectedUrl = `/products/p1/related?locale=en&limit=${limit}`;

      expect(checkCache).toHaveBeenCalledWith(expectedCacheKey);
      expect(buildApiUrl).toHaveBeenCalledWith(
        `/products/${params.productId}/related`,
        expect.any(URLSearchParams)
      );
      expect(fetchProductsAndCache).toHaveBeenCalledWith(
        expectedUrl,
        expectedCacheKey,
        RELATED_PRODUCTS_CACHE_TTL,
        expect.stringContaining(params.productId)
      );
      expect(result).toEqual(fetchedData);
    });
  });

  describe("fetchProductById", () => {
    const productId = "p123";

    it("should return cached product detail if available", async () => {
      const cachedData = { product: mockProduct };
      (checkCache as jest.Mock).mockResolvedValueOnce(cachedData);
      const result = await fetchProductById(productId);
      expect(checkCache).toHaveBeenCalledWith(
        `${CACHE_KEY_PRODUCT_DETAIL_PREFIX}${productId}`
      );
      expect(fetchSingleProductAndCache).not.toHaveBeenCalled();
      expect(result).toEqual(cachedData);
    });

    it("should fetch and cache product detail if not cached", async () => {
      const fetchedData = { product: mockProduct };
      (checkCache as jest.Mock).mockResolvedValueOnce(null);
      (fetchSingleProductAndCache as jest.Mock).mockResolvedValueOnce(
        fetchedData
      );

      const result = await fetchProductById(productId);

      const expectedCacheKey = `${CACHE_KEY_PRODUCT_DETAIL_PREFIX}${productId}`;
      const expectedUrl = `/products/${productId}`;

      expect(checkCache).toHaveBeenCalledWith(expectedCacheKey);
      expect(buildApiUrl).toHaveBeenCalledWith(`/products/${productId}`);
      expect(fetchSingleProductAndCache).toHaveBeenCalledWith(
        expectedUrl,
        expectedCacheKey,
        PRODUCT_DETAIL_CACHE_TTL
      );
      expect(result).toEqual(fetchedData);
    });

    it("should return null and log warning for empty ID", async () => {
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
      const result = await fetchProductById("");
      expect(result).toBeNull();
      expect(checkCache).not.toHaveBeenCalled();
      expect(fetchSingleProductAndCache).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });
});
