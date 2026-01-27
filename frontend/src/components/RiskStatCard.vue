<script setup lang="ts">
import { computed } from 'vue'
import { ElCard } from 'element-plus'

interface Props {
  title: string
  value: number
  type?: 'default' | 'high' | 'medium' | 'low'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default'
})

const cardClass = computed(() => {
  return `risk-stat-card risk-stat-${props.type}`
})

const valueColor = computed(() => {
  switch (props.type) {
    case 'high': return '#f56c6c'
    case 'medium': return '#e6a23c'
    case 'low': return '#67c23a'
    default: return '#303133'
  }
})
</script>

<template>
  <ElCard :class="cardClass" shadow="hover" class="risk-stat-card">
    <div class="stat-item">
      <div class="stat-label">{{ title }}</div>
      <div class="stat-value" :style="{ color: valueColor }">{{ value }}</div>
    </div>
  </ElCard>
</template>

<style scoped>
.risk-stat-card {
  transition: transform 0.3s;
}

.risk-stat-card:hover {
  transform: translateY(-2px);
}

.stat-item {
  text-align: center;
  padding: 10px 0;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  transition: color 0.3s;
}
</style>
