<script setup lang="ts">
import type { Product } from '../types';
import ProductCard from './ProductCard.vue';

defineProps<{ products: Product[] }>();
defineEmits<{ reset: [] }>();
</script>

<template>
  <div v-if="products.length === 0" class="empty-state">
    <p class="empty-state__text">Поиск не дал результатов</p>
    <button type="button" class="empty-state__reset" @click="$emit('reset')">
      Сбросить фильтры
    </button>
  </div>

  <div v-else class="product-grid">
    <ProductCard v-for="p in products" :key="p.id" :product="p" />
  </div>
</template>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 80px 0;
}

.empty-state__text {
  margin: 0;
  font-size: 1rem;
  color: #374151;
}

.empty-state__reset {
  padding: 12px 28px;
  background: #00b4d8;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.9375rem;
  cursor: pointer;
}

.empty-state__reset:hover {
  background: #0096b7;
}
</style>
