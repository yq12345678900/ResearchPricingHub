<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number | null | undefined
  precision?: number
  showSuffix?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  precision: 2,
  showSuffix: true
})

const formattedValue = computed(() => {
  if (props.value === null || props.value === undefined) {
    return '-'
  }
  return props.value.toFixed(props.precision)
})

const colorClass = computed(() => {
  if (props.value === null || props.value === undefined) {
    return ''
  }
  if (props.value >= 100) return 'profit-high'
  if (props.value >= 70) return 'profit-medium'
  if (props.value >= 50) return 'profit-low'
  return 'profit-negative'
})
</script>

<template>
  <span :class="['profit-rate-display', colorClass]">
    {{ formattedValue }}<span v-if="showSuffix && value !== null && value !== undefined">%</span>
  </span>
</template>

<style scoped>
.profit-rate-display {
  font-weight: 500;
  font-family: 'Consolas', 'Monaco', monospace;
}

.profit-high {
  color: #67c23a;
}

.profit-medium {
  color: #e6a23c;
}

.profit-low {
  color: #f56c6c;
}

.profit-negative {
  color: #f56c6c;
}
</style>
