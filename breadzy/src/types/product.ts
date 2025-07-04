export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  image: string;
  ishot?: boolean;
  createdAt: string;
  gallery?: string[];
}
