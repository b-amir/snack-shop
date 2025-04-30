import "@testing-library/jest-dom";

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ items: [] }), // Default mock response
  })
);
