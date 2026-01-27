<script setup lang="ts">
import { useSlots } from 'vue'

interface Props {
  label?: string
  labelWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  labelWidth: '80px'
})

const slots = useSlots()
</script>

<template>
  <div class="filter-item">
    <label v-if="label" :style="{ minWidth: labelWidth }">{{ label }}</label>
    <div class="filter-item-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  width: 100%;
}

.filter-item label {
  white-space: nowrap;
  font-weight: 500;
}

.filter-item-content {
  flex: 1;
  min-width: 0;
}
</style>
