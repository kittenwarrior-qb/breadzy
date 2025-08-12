export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  isHot?: boolean;
  createdAt: string;
}
