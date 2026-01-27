<script setup lang="ts">
import { useSlots } from 'vue'
import { ElCard } from 'element-plus'

interface Props {
  title?: string
  shadow?: 'always' | 'hover' | 'never'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  shadow: 'hover',
  loading: false
})

const slots = useSlots()
</script>

<template>
  <ElCard :shadow="shadow" class="data-list-card" v-loading="loading">
    <template #header v-if="title">
      <div class="card-header">
        <h2>{{ title }}</h2>
        <slot name="header-extra"></slot>
      </div>
    </template>

    <div class="card-content">
      <slot></slot>
    </div>
  </ElCard>
</template>

<style scoped>
.data-list-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.card-content {
  width: 100%;
  overflow-x: auto;
}
</style>
