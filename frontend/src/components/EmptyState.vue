<script setup lang="ts">
import { ElEmpty } from 'element-plus'

interface Props {
  description?: string
  imageSize?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  description: '暂无数据',
  imageSize: 150
})
</script>

<template>
  <div class="empty-state">
    <ElEmpty :description="description" :image-size="imageSize">
      <template #default>
        <slot></slot>
      </template>
    </ElEmpty>
  </div>
</template>

<style scoped>
.empty-state {
  padding: 60px 0;
  display: flex;
  justify-content: center;
}
</style>
