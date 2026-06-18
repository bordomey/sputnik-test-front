export interface ProductHost {
  name: string;
  photo: string;
  review_rating: number;
}

export interface Product {
  id: number;
  title: string;
  price: string;
  activity_type: string;
  image_big: string;
  customers_review_rating: number;
  reviews: number;
  city_id: number;
  duration: string;
  short_info: string;
  host: ProductHost;
}

export interface City {
  id: number;
  name: string;
}
