<script setup lang="ts">
import { computed } from 'vue'
import { ElProgress } from 'element-plus'

interface Props {
  value: number
  showText?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showText: true
})

const progressColor = computed(() => {
  if (props.value >= 70) return '#f56c6c'
  if (props.value >= 40) return '#e6a23c'
  return '#67c23a'
})

const textColor = computed(() => {
  return progressColor.value
})
</script>

<template>
  <div class="risk-score-display">
    <ElProgress
      :percentage="value"
      :color="progressColor"
      :show-text="false"
      style="flex: 1"
    />
    <span v-if="showText" class="score-text" :style="{ color: textColor }">{{ value }}</span>
  </div>
</template>

<style scoped>
.risk-score-display {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.score-text {
  font-weight: bold;
  min-width: 30px;
  text-align: right;
}
</style>
