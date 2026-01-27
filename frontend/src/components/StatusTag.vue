<script setup lang="ts">
import { computed } from 'vue'
import { ElTag } from 'element-plus'

type TagType = 'success' | 'warning' | 'info' | 'danger' | 'primary'
type StatusLevel = 'excellent' | 'good' | 'average' | 'poor'

interface Props {
  status: StatusLevel | string
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: ''
})

const statusMap: Record<StatusLevel, { type: TagType; label: string }> = {
  excellent: { type: 'success', label: '优' },
  good: { type: 'primary', label: '良' },
  average: { type: 'warning', label: '中' },
  poor: { type: 'danger', label: '差' }
}

const tagType = computed(() => {
  if (Object.keys(statusMap).includes(props.status)) {
    return statusMap[props.status as StatusLevel].type
  }
  return 'info' as TagType
})

const displayText = computed(() => {
  if (props.text) return props.text
  if (Object.keys(statusMap).includes(props.status)) {
    return statusMap[props.status as StatusLevel].label
  }
  return props.status
})
</script>

<template>
  <ElTag :type="tagType">
    {{ displayText }}
  </ElTag>
</template>
