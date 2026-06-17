<script setup lang="ts">
defineProps<{ modelValue: string }>();
defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <div class="search-input">
    <label for="search-field" class="sr-only">Название экскурсии</label>
    <div class="search-input__wrapper">
      <input
        id="search-field"
        type="text"
        class="search-input__field"
        :value="modelValue"
        placeholder="Введите название экскурсии"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <button
        v-if="modelValue"
        type="button"
        class="search-input__clear"
        aria-label="Очистить поиск"
        @click="$emit('update:modelValue', '')"
      >
        ×
      </button>
    </div>
  </div>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.search-input {
  flex: 1;
}

.search-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input__field {
  width: 100%;
  padding: 11px 40px 11px 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.9375rem;
  color: #111;
  outline: none;
  box-sizing: border-box;
  background: #fff;
}

.search-input__field::placeholder {
  color: #9ca3af;
}

.search-input__field:focus {
  border-color: #9ca3af;
}

.search-input__clear {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: #9ca3af;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
}

.search-input__clear:hover {
  color: #6b7280;
}
</style>
