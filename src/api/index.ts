import type { City, Product } from '../types';

const BASE = '/v1';
const AUTH = 'api_key=873fa71c061b0c36d9ad7e47ec3635d9&username=frontend@sputnik8.com';

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/products?${AUTH}`);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json() as Promise<Product[]>;
}

export async function fetchCities(): Promise<City[]> {
  const res = await fetch(`${BASE}/cities?${AUTH}`);
  if (!res.ok) throw new Error(`Failed to fetch cities: ${res.status}`);
  return res.json() as Promise<City[]>;
}
