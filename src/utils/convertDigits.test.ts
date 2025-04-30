import { toFarsiDigits, toEnglishDigits } from "./convertDigits";

describe("Digit Conversion Utilities", () => {
  describe("toFarsiDigits", () => {
    it("should convert English digits string to Farsi", () => {
      expect(toFarsiDigits("1234567890")).toBe("۱۲۳۴۵۶۷۸۹۰");
    });

    it("should convert English digits number to Farsi", () => {
      expect(toFarsiDigits(987)).toBe("۹۸۷");
    });

    it("should handle mixed strings", () => {
      expect(toFarsiDigits("Test 123 Test")).toBe("Test ۱۲۳ Test");
    });

    it("should return empty string for empty input", () => {
      expect(toFarsiDigits("")).toBe("");
    });
  });

  describe("toEnglishDigits", () => {
    it("should convert Farsi digits string to English", () => {
      expect(toEnglishDigits("۱۲۳۴۵۶۷۸۹۰")).toBe("1234567890");
    });

    it("should convert Farsi digits number (as string) to English", () => {
      expect(toEnglishDigits("۹۸۷")).toBe("987");
    });

    it("should handle mixed strings", () => {
      expect(toEnglishDigits("تست ۱۲۳ تست")).toBe("تست 123 تست");
    });

    it("should return empty string for empty input", () => {
      expect(toEnglishDigits("")).toBe("");
    });

    it("should leave English digits unchanged", () => {
      expect(toEnglishDigits("12345")).toBe("12345");
    });
  });
});
