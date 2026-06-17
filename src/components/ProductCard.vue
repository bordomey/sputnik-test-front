<script setup lang="ts">
import type { Product } from '../types';

defineProps<{ product: Product }>();

function formatPrice(raw: string): string {
  const match = raw.match(/([\d.]+)\s*(.+)/);
  if (!match) return `от ${raw}`;
  const num = Math.round(parseFloat(match[1]));
  const currency = match[2].trim();
  return `от ${num.toLocaleString('ru-RU')} ${currency}`;
}
</script>

<template>
  <article class="card">
    <img :src="product.image_big" :alt="product.title" class="card__image" />
    <div class="card__body">
      <div class="card__rating">
        <span class="card__star">★</span>
        <span class="card__rating-value">{{ product.customers_review_rating }}</span>
        <span class="card__reviews">({{ product.reviews }})</span>
      </div>
      <h3 class="card__title">{{ product.title }}</h3>
      <p class="card__price">{{ formatPrice(product.price) }}</p>
      <p class="card__price-label">за экскурсию</p>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
}

.card__image {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  display: block;
}

.card__body {
  padding: 10px 0 0;
  text-align: left;
}

.card__rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
  font-size: 0.875rem;
}

.card__star {
  color: #f5c518;
  line-height: 1;
}

.card__rating-value {
  font-weight: 500;
  color: #111;
}

.card__reviews {
  color: #6b7280;
}

.card__title {
  margin: 0 0 6px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111;
  line-height: 1.4;
}

.card__price {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111;
}

.card__price-label {
  margin: 2px 0 0;
  font-size: 0.75rem;
  color: #9ca3af;
}
</style>
