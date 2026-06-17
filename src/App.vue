<script setup lang="ts">
import { computed, ref } from 'vue';
import logoUrl from './assets/Logo-sputnik.svg';
import { useProducts } from './composables/useProducts';
import { useCities } from './composables/useCities';
import SearchInput from './components/SearchInput.vue';
import CityDropdown from './components/CityDropdown.vue';
import ProductList from './components/ProductList.vue';

const searchQuery = ref('');
const selectedCityId = ref<number | null>(null);

const { filteredProducts, loading } = useProducts(searchQuery, selectedCityId);

const hasFilters = computed(() => searchQuery.value.trim() !== '' || selectedCityId.value !== null);
const { cities } = useCities();

function resetFilters() {
  searchQuery.value = '';
  selectedCityId.value = null;
}
</script>

<template>
  <div class="app">
    <header class="header">
      <img :src="logoUrl" alt="Sputnik" class="logo" />
    </header>

    <main class="main">
      <h1 class="page-title">Экскурсии по всему миру</h1>

      <div class="filters">
        <SearchInput v-model="searchQuery" />
        <CityDropdown v-model="selectedCityId" :cities="cities" />
      </div>

      <template v-if="hasFilters">
        <div v-if="loading" class="loading">Загрузка...</div>
        <ProductList v-else :products="filteredProducts" @reset="resetFilters" />
      </template>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: center;
  padding: 24px 20px 0;
}

.logo {
  height: 24px;
  display: block;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 40px 60px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #111;
  text-align: center;
  margin-bottom: 32px;
}

.filters {
  display: flex;
  gap: 16px;
  max-width: 580px;
  margin: 0 auto 40px;
}

.loading {
  text-align: center;
  color: #9ca3af;
  padding: 60px 0;
  font-size: 0.9375rem;
}
</style>
