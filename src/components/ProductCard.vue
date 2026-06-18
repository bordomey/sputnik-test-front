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

const TYPE_LABELS: Record<string, string> = {
  tour: 'Экскурсия',
  composite_activity: 'Активность',
};

function formatType(type: string): string {
  return TYPE_LABELS[type] ?? type;
}
</script>

<template>
  <article class="card">
    <div class="card__image-wrapper">
      <img :src="product.image_big" :alt="product.title" class="card__image" />

      <span class="card__duration">{{ product.duration }}</span>

      <div v-if="product.short_info" class="card__overlay">
        <p class="card__short-info">{{ product.short_info }}</p>
      </div>
    </div>

    <div class="card__body">
      <div class="card__rating">
        <span class="card__star">★</span>
        <span class="card__rating-value">{{ product.customers_review_rating }}</span>
        <span class="card__reviews">({{ product.reviews }})</span>
        <span class="card__type">{{ formatType(product.activity_type) }}</span>
      </div>
      <h3 class="card__title">{{ product.title }}</h3>
      <div class="card__price-section">
        <p class="card__price">{{ formatPrice(product.price) }}</p>
        <p class="card__price-label">за экскурсию</p>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
}

/* ── Image ── */
.card__image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 6px;
}

.card__image {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.card:hover .card__image {
  transform: scale(1.05);
}

/* ── Duration badge: hidden when overlay appears ── */
.card__duration {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.52);
  color: #fff;
  font-size: 0.75rem;
  padding: 3px 9px;
  border-radius: 20px;
  backdrop-filter: blur(3px);
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.card:hover .card__duration {
  opacity: 0;
}

/* ── Short info overlay ── */
.card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0) 55%);
  display: flex;
  align-items: flex-end;
  padding: 14px 12px;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.card:hover .card__overlay {
  opacity: 1;
}

.card__short-info {
  margin: 0;
  color: #fff;
  font-size: 0.8125rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Body: flex column so price sticks to bottom ── */
.card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px 4px 4px;
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

.card__type {
  margin-left: auto;
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 7px;
  border-radius: 20px;
  white-space: nowrap;
}

.card__title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111;
  line-height: 1.4;
}

/* Price pinned to bottom regardless of title length */
.card__price-section {
  margin-top: auto;
  padding-top: 8px;
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
