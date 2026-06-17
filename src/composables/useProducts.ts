import { computed, onMounted, ref, type Ref } from 'vue';
import { fetchProducts } from '../api';
import type { Product } from '../types';

export function useProducts(searchQuery: Ref<string>, cityId: Ref<number | null>) {
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  onMounted(async () => {
    loading.value = true;
    try {
      products.value = await fetchProducts();
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  });

  const filteredProducts = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    const city = cityId.value;
    return products.value.filter((p) => {
      const matchesQuery = q === '' || p.title.toLowerCase().includes(q);
      const matchesCity = city === null || p.city_id === city;
      return matchesQuery && matchesCity;
    });
  });

  return { filteredProducts, loading, error };
}
