export interface Product {
  id: string;
  name: {
    en: string;
    fa: string;
  };
  price: number;
  imageUrl: string;
  description: {
    en: string;
    fa: string;
  };
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
