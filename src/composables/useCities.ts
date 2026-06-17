import { onMounted, ref } from 'vue';
import { fetchCities } from '../api';
import type { City } from '../types';

export function useCities() {
  const cities = ref<City[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  onMounted(async () => {
    loading.value = true;
    try {
      cities.value = await fetchCities();
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  });

  return { cities, loading, error };
}
