import { Product, SupportedLocale } from "@/types/product";
import "@testing-library/jest-dom";

const mockProduct: Product = {
  id: "1",
  name: { en: "Test Product", fa: "محصول تستی" },
  description: { en: "Description", fa: "توضیحات" },
  price: { en: 100, fa: 10000 },
  currency: { en: "USD", fa: "تومان" },
  tags: { en: ["test", "example"], fa: ["تست", "مثال"] },
  dateAdded: "2023-01-01T00:00:00.000Z",
  imageUrlLocal: "/images/local.jpg",
  imageUrlCdn: "http://cdn.example.com/image.jpg",
};

describe("formatProductDisplayData", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should format data correctly for English locale", async () => {
    process.env.NEXT_PUBLIC_USE_CLOUDINARY_CDN = "false";
    const { formatProductDisplayData } = await import(
      "./formatProductDisplayData"
    );
    const locale: SupportedLocale = "en";
    const result = formatProductDisplayData(mockProduct, locale);
    expect(result.formattedDate).toBe("January 1, 2023");
    expect(result.formattedPrice).toBe("100 USD");
    expect(result.imageSrc).toBe(mockProduct.imageUrlLocal);
  });

  it("should format data correctly for Farsi locale", async () => {
    process.env.NEXT_PUBLIC_USE_CLOUDINARY_CDN = "false";
    const { formatProductDisplayData } = await import(
      "./formatProductDisplayData"
    );
    const locale: SupportedLocale = "fa";
    const result = formatProductDisplayData(mockProduct, locale);
    expect(result.formattedDate).toBe("۱۱ دی ۱۴۰۱");
    expect(result.formattedPrice).toBe("۱۰٬۰۰۰ تومان");
    expect(result.imageSrc).toBe(mockProduct.imageUrlLocal);
  });

  it("should use CDN image source when enabled", async () => {
    process.env.NEXT_PUBLIC_USE_CLOUDINARY_CDN = "true";
    const { formatProductDisplayData } = await import(
      "./formatProductDisplayData"
    );
    const locale: SupportedLocale = "en";
    const result = formatProductDisplayData(mockProduct, locale);
    expect(result.imageSrc).toBe(mockProduct.imageUrlCdn);
  });
});
