<script setup lang="ts">
import { computed } from 'vue'
import { ElCard, ElStatistic } from 'element-plus'

interface Props {
  title: string
  value: number
  precision?: number
  prefix?: string
  suffix?: string
  color?: string
  shadow?: 'always' | 'hover' | 'never'
}

const props = withDefaults(defineProps<Props>(), {
  precision: 0,
  prefix: '',
  suffix: '',
  color: '',
  shadow: 'hover'
})

const cardStyle = computed(() => ({
  color: props.color || undefined
}))
</script>

<template>
  <ElCard :shadow="shadow" :class="['statistics-card', color ? `text-${color}` : '']">
    <ElStatistic
      :title="title"
      :value="value"
      :precision="precision"
      :prefix="prefix"
      :suffix="suffix"
    />
  </ElCard>
</template>

<style scoped>
.statistics-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.statistics-card:hover {
  transform: translateY(-2px);
}

.text-red {
  color: #f56c6c;
}

.text-orange {
  color: #e6a23c;
}

.text-green {
  color: #67c23a;
}

.text-blue {
  color: #409eff;
}
</style>
