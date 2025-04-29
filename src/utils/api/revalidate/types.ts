export type RevalidateBody = {
  event: string;
  productId: string;
  changedLocales?: string[];
};

export type ValidatedData = {
  event: string;
  productId: string;
  localesToRevalidate: string[];
};
