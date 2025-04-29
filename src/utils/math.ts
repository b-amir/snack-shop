const PRECISION_FACTOR = 10_000;

export function safeMultiply(num1: number, num2: number): number {
  // Scale -> Multiply -> Round -> Unscale
  const result = Math.round(num1 * PRECISION_FACTOR * num2);
  return result / PRECISION_FACTOR;
}

export function safeAdd(num1: number, num2: number): number {
  // Scale -> Add -> Round -> Unscale
  const scaledNum1 = Math.round(num1 * PRECISION_FACTOR);
  const scaledNum2 = Math.round(num2 * PRECISION_FACTOR);
  return (scaledNum1 + scaledNum2) / PRECISION_FACTOR;
}

export function round(num: number, decimalPlaces: number = 2): number {
  const factor = 10 ** decimalPlaces;
  return Math.round(num * factor) / factor;
}
