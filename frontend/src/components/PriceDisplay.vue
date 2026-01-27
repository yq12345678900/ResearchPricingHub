<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number | null | undefined
  precision?: number
  showSymbol?: boolean
  symbol?: string
  highlight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  precision: 2,
  showSymbol: true,
  symbol: '¥',
  highlight: false
})

const formattedPrice = computed(() => {
  if (props.value === null || props.value === undefined) {
    return '-'
  }
  return props.value.toFixed(props.precision)
})

const displayValue = computed(() => {
  if (props.value === null || props.value === undefined) {
    return '-'
  }
  return `${props.showSymbol ? props.symbol : ''}${formattedPrice.value}`
})
</script>

<template>
  <span :class="['price-display', highlight ? 'price-highlight' : '']">
    {{ displayValue }}
  </span>
</template>

<style scoped>
.price-display {
  font-family: 'Consolas', 'Monaco', monospace;
  font-weight: 500;
}

.price-highlight {
  color: #f56c6c;
  font-weight: bold;
}
</style>
