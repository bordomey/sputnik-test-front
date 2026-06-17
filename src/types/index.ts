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
}

export interface City {
  id: number;
  name: string;
}
