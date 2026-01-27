<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'
import { ElCard, ElButton } from 'element-plus'

interface Props {
  title?: string
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '筛选条件',
  showActions: true
})

const emit = defineEmits<{
  apply: []
  reset: []
}>()

const slots = useSlots()

const hasContent = computed(() => !!slots.default)
</script>

<template>
  <ElCard class="filter-section" shadow="hover">
    <template #header>
      <h2>{{ title }}</h2>
    </template>

    <div class="filter-content" v-if="hasContent">
      <slot></slot>
    </div>

    <div v-if="showActions" class="action-buttons">
      <ElButton type="primary" @click="emit('apply')">应用筛选</ElButton>
      <ElButton @click="emit('reset')">重置</ElButton>
      <slot name="extra-actions"></slot>
    </div>
  </ElCard>
</template>

<style scoped>
.filter-section {
  margin-bottom: 20px;
}

.filter-section h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.filter-content {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}
</style>
