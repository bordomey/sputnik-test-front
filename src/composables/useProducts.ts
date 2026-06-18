import { computed, onMounted, ref, type Ref } from 'vue';
import { fetchProducts } from '../api';
import type { Product } from '../types';
import { fuzzyScore, FUZZY_THRESHOLD } from '../utils/fuzzy';

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
    const q = searchQuery.value.trim();
    const city = cityId.value;

    return products.value
      .map((p) => ({ p, score: q ? fuzzyScore(p.title, q) : 1 }))
      .filter(({ p, score }) => {
        const matchesQuery = !q || score >= FUZZY_THRESHOLD;
        const matchesCity = city === null || city === 0 || p.city_id === city;
        return matchesQuery && matchesCity;
      })
      .sort((a, b) => b.score - a.score)
      .map(({ p }) => p);
  });

  return { filteredProducts, loading, error };
}
