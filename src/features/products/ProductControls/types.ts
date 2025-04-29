export type ProductControlsProps = {
  initialSort: string;
  initialPageSize: number;
  translations: {
    sortBy: string;
    productsPerPage: string;
    sortNewest: string;
    sortOldest: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
  };
};
