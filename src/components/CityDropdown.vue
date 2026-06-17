<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { City } from '../types';

const props = defineProps<{
  cities: City[];
  modelValue: number | null;
}>();
const emit = defineEmits<{ 'update:modelValue': [value: number | null] }>();

const isOpen = ref(false);
const activeIndex = ref(0);
const triggerRef = ref<HTMLButtonElement | null>(null);
const listRef = ref<HTMLUListElement | null>(null);

// «Все города» — первый пункт для сброса выбора
const options = computed<Array<{ id: number | null; name: string }>>(() => [
  { id: null, name: 'Все города' },
  ...props.cities,
]);

const selectedLabel = computed(
  () => props.cities.find((c) => c.id === props.modelValue)?.name ?? 'Выбрать город',
);

function open() {
  isOpen.value = true;
  activeIndex.value = Math.max(
    options.value.findIndex((o) => o.id === props.modelValue),
    0,
  );
}

function close() {
  isOpen.value = false;
}

function toggle() {
  isOpen.value ? close() : open();
}

function select(id: number | null) {
  emit('update:modelValue', id);
  close();
  triggerRef.value?.focus();
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
    e.preventDefault();
    open();
  }
}

function onListKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex.value = Math.min(activeIndex.value + 1, options.value.length - 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex.value = Math.max(activeIndex.value - 1, 0);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    select(options.value[activeIndex.value]?.id ?? null);
  } else if (e.key === 'Escape' || e.key === 'Tab') {
    close();
    triggerRef.value?.focus();
  }
}

function onClickOutside(e: MouseEvent) {
  const target = e.target as Node;
  if (triggerRef.value?.contains(target) || listRef.value?.contains(target)) return;
  close();
}

onMounted(() => document.addEventListener('mousedown', onClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside));
</script>

<template>
  <div class="dropdown">
    <button
      ref="triggerRef"
      type="button"
      class="dropdown__trigger"
      :class="{ 'dropdown__trigger--open': isOpen }"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <span :class="{ 'dropdown__placeholder': modelValue === null }">{{ selectedLabel }}</span>
      <span class="dropdown__chevron" :class="{ 'dropdown__chevron--rotated': isOpen }">▾</span>
    </button>

    <ul
      v-if="isOpen"
      ref="listRef"
      role="listbox"
      class="dropdown__list"
      tabindex="-1"
      :aria-activedescendant="`dropdown-option-${activeIndex}`"
      @keydown="onListKeydown"
      @vue:mounted="(listRef as HTMLUListElement | null)?.focus()"
    >
      <li
        v-for="(option, i) in options"
        :id="`dropdown-option-${i}`"
        :key="option.id ?? 'all'"
        role="option"
        class="dropdown__item"
        :class="{
          'dropdown__item--active': i === activeIndex,
          'dropdown__item--selected': option.id === modelValue,
        }"
        :aria-selected="option.id === modelValue"
        @click="select(option.id)"
        @mouseenter="activeIndex = i"
      >
        {{ option.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
  flex: 1;
  min-width: 0;
}

.dropdown__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  font-size: 0.9375rem;
  cursor: pointer;
  text-align: left;
  color: #111;
  outline: none;
  box-sizing: border-box;
  overflow: hidden;
}

.dropdown__trigger:focus {
  border-color: #9ca3af;
}

.dropdown__trigger span:first-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.dropdown__placeholder {
  color: #9ca3af;
}

.dropdown__chevron {
  font-size: 1rem;
  color: #9ca3af;
  transition: transform 0.15s ease;
  margin-left: 8px;
  flex-shrink: 0;
}

.dropdown__chevron--rotated {
  transform: rotate(180deg);
}

.dropdown__list {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 240px;
  overflow-y: auto;
  z-index: 100;
  outline: none;
}

.dropdown__item {
  padding: 11px 16px;
  font-size: 0.9375rem;
  cursor: pointer;
  color: #111;
  border-bottom: 1px solid #f3f4f6;
}

.dropdown__item:last-child {
  border-bottom: none;
}

.dropdown__item--active {
  background: #f9fafb;
}

.dropdown__item--selected {
  font-weight: 500;
}
</style>
