export interface ProductRes {
  status: string;
  request_id: string;
  parameters: ProductParameters;
  data: ProductData;
}

export interface ProductParameters {
  category_id: string;
  country: string;
  sort_by: string;
  page: number;
  is_prime: boolean;
}

export interface ProductData {
  total_products: number;
  country: string;
  domain: string;
  products: Product[];
}

export interface Product {
  asin: string;
  product_title: string;
  product_price: string;
  product_original_price: string | null;
  currency: string;
  product_star_rating: string;
  product_num_ratings: number;
  product_url: string;
  product_photo: string;
  product_num_offers: number;
  product_minimum_offer_price: string;
  is_best_seller: boolean;
  is_amazon_choice: boolean;
  is_prime: boolean;
  climate_pledge_friendly: boolean;
  sales_volume: string;
  delivery: string;
  has_variations: boolean;
  product_badge: string;
}

export interface ProductAdapterRes{
  id:number;
  title: string;
  price: string;
  currency:string
  isPrime: boolean;
}