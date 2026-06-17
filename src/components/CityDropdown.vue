<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { City } from '../types';

const props = defineProps<{
  cities: City[];
  modelValue: number | null;
}>();
const emit = defineEmits<{ 'update:modelValue': [value: number | null] }>();

const query = ref('');
const isOpen = ref(false);
const activeIndex = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);
const wrapperRef = ref<HTMLDivElement | null>(null);

const selectedCity = computed(() => props.cities.find((c) => c.id === props.modelValue) ?? null);

const displayOptions = computed<Array<{ id: number; name: string }>>(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return [{ id: 0, name: 'Все города' }, ...props.cities];
  return props.cities.filter((c) => c.name.toLowerCase().startsWith(q));
});

// Ghost text follows the currently active item in the list
const ghostSuffix = computed(() => {
  const q = query.value;
  if (!q || !isOpen.value || displayOptions.value.length === 0) return '';
  const active = displayOptions.value[activeIndex.value];
  if (!active || active.id === 0) return '';
  if (active.name.toLowerCase().startsWith(q.toLowerCase())) {
    return active.name.slice(q.length);
  }
  return '';
});

function open() {
  isOpen.value = true;
  activeIndex.value = 0;
}

function close() {
  isOpen.value = false;
  query.value = '';
}

function reset() {
  emit('update:modelValue', null);
  close();
  inputRef.value?.blur();
}

function select(id: number) {
  emit('update:modelValue', id);
  close();
  inputRef.value?.blur();
}

function applyActive() {
  const opt = displayOptions.value[activeIndex.value];
  if (opt) select(opt.id);
}

function onInput(e: Event) {
  query.value = (e.target as HTMLInputElement).value;
  activeIndex.value = 0;
  isOpen.value = true;
  if (!query.value) emit('update:modelValue', null);
}

function onFocus() {
  query.value = '';
  open();
}

function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) {
    if (['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) {
      e.preventDefault();
      open();
    }
    return;
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex.value = Math.min(activeIndex.value + 1, displayOptions.value.length - 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex.value = Math.max(activeIndex.value - 1, 0);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    applyActive();
  } else if (e.key === 'Tab') {
    if (query.value.trim() && displayOptions.value.length > 0) applyActive();
    else close();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    reset();
  }
}

function onClickOutside(e: MouseEvent) {
  if (!wrapperRef.value?.contains(e.target as Node)) close();
}

onMounted(() => document.addEventListener('mousedown', onClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside));
</script>

<template>
  <div ref="wrapperRef" class="dropdown">
    <div class="dropdown__field" :class="{ 'dropdown__field--open': isOpen }">
      <div class="dropdown__ghost" aria-hidden="true">
        <span class="ghost__typed">{{ query }}</span><span class="ghost__suffix">{{ ghostSuffix }}</span>
      </div>

      <input
        ref="inputRef"
        type="text"
        class="dropdown__input"
        :value="query"
        :placeholder="selectedCity?.name ?? 'Выбрать город'"
        autocomplete="off"
        role="combobox"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
        @input="onInput"
        @focus="onFocus"
        @keydown="onKeydown"
      />

      <span
        class="dropdown__chevron"
        :class="{ 'dropdown__chevron--rotated': isOpen }"
        aria-hidden="true"
      >▾</span>
    </div>

    <ul
      v-if="isOpen && displayOptions.length > 0"
      class="dropdown__list"
      role="listbox"
    >
      <li
        v-for="(option, i) in displayOptions"
        :key="option.id"
        role="option"
        class="dropdown__item"
        :class="{
          'dropdown__item--active': i === activeIndex,
          'dropdown__item--selected': option.id === modelValue,
        }"
        :aria-selected="option.id === modelValue"
        @mousedown.prevent="select(option.id)"
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

.dropdown__field {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.dropdown__field--open {
  border-color: #9ca3af;
}

.dropdown__ghost {
  position: absolute;
  inset: 0;
  padding: 11px 40px 11px 16px;
  pointer-events: none;
  display: flex;
  align-items: center;
  font-size: 0.9375rem;
  font-family: inherit;
  overflow: hidden;
  white-space: pre;
  z-index: 0;
}

.ghost__typed {
  visibility: hidden;
  white-space: pre;
}

.ghost__suffix {
  color: #9ca3af;
  white-space: pre;
}

.dropdown__input {
  width: 100%;
  padding: 11px 40px 11px 16px;
  border: none;
  border-radius: 4px;
  font-size: 0.9375rem;
  font-family: inherit;
  background: transparent;
  color: #111;
  outline: none;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
}

.dropdown__input::placeholder {
  color: #9ca3af;
}

.dropdown__chevron {
  position: absolute;
  right: 12px;
  color: #9ca3af;
  font-size: 1rem;
  pointer-events: none;
  z-index: 2;
  transition: transform 0.15s ease;
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
