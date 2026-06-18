import type { City, Product } from '../types';

const PRODUCTS_URL = import.meta.env.DEV ? '/v1/products' : '/api/products';
const CITIES_URL = import.meta.env.DEV ? '/v1/cities' : '/api/cities';
const AUTH = 'api_key=873fa71c061b0c36d9ad7e47ec3635d9&username=frontend@sputnik8.com';

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${PRODUCTS_URL}?${AUTH}`);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json() as Promise<Product[]>;
}

export async function fetchCities(): Promise<City[]> {
  const res = await fetch(`${CITIES_URL}?${AUTH}`);
  if (!res.ok) throw new Error(`Failed to fetch cities: ${res.status}`);
  return res.json() as Promise<City[]>;
}
