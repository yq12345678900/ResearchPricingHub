<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElRow, ElCol, ElSelect, ElOption, ElInput, ElTable, ElTableColumn, ElTag } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { FilterSection, FilterItem, DataListCard, RiskScoreDisplay, RiskStatCard } from '@/components'

// 风险数据类型
interface RiskItem {
  id: number
  productName: string
  sku: string
  riskType: string
  riskLevel: string
  riskScore: number
  description: string
  impact: string
  suggestion: string
  reportDate: string
}

const loading = ref(false)
const riskData = ref<RiskItem[]>([])

// 筛选条件
const filterRiskLevel = ref('')
const filterRiskType = ref('')
const searchKeyword = ref('')

// 风险等级选项
const riskLevelOptions = [
  { label: '全部', value: '' },
  { label: '高', value: '高' },
  { label: '中', value: '中' },
  { label: '低', value: '低' }
]

// 风险类型选项
const riskTypeOptions = [
  { label: '全部', value: '' },
  { label: '供应链', value: '供应链' },
  { label: '质量', value: '质量' },
  { label: '价格', value: '价格' },
  { label: '交期', value: '交期' },
  { label: '合规', value: '合规' }
]

// 风险类型颜色映射
const riskTypeColors: Record<string, string> = {
  '供应链': '#409eff',
  '质量': '#f56c6c',
  '价格': '#e6a23c',
  '交期': '#67c23a',
  '合规': '#909399'
}

// 过滤后的数据
const filteredData = computed(() => {
  let filtered = [...riskData.value]

  if (filterRiskLevel.value) {
    filtered = filtered.filter(item => item.riskLevel === filterRiskLevel.value)
  }

  if (filterRiskType.value) {
    filtered = filtered.filter(item => item.riskType === filterRiskType.value)
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.productName.toLowerCase().includes(keyword) ||
      item.sku.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 统计数据
const statistics = computed(() => {
  const data = filteredData.value
  return {
    totalCount: data.length,
    highRisk: data.filter(item => item.riskLevel === '高').length,
    mediumRisk: data.filter(item => item.riskLevel === '中').length,
    lowRisk: data.filter(item => item.riskLevel === '低').length
  }
})

// 数据加载（从后端API获取）
const loadData = () => {
  loading.value = true
  // TODO: 从后端API获取数据
  // axios.get('/api/risks').then(response => {
  //   riskData.value = response.data
  //   loading.value = false
  // })

  // 暂时设置为空数组
  riskData.value = []
  loading.value = false
}

// 重置筛选
const resetFilters = () => {
  filterRiskLevel.value = ''
  filterRiskType.value = ''
  searchKeyword.value = ''
}

// 获取风险等级类型
const getRiskLevelType = (level: string) => {
  switch (level) {
    case '高': return 'danger'
    case '中': return 'warning'
    case '低': return 'success'
    default: return 'info'
  }
}

// 获取风险类型标签颜色
const getRiskTypeTagColor = (type: string) => {
  return riskTypeColors[type] || '#909399'
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="risk-board-page">
    <!-- 统计卡片 -->
    <ElRow :gutter="20" class="stats-row">
      <ElCol :span="6">
        <RiskStatCard title="风险总数" :value="statistics.totalCount" />
      </ElCol>
      <ElCol :span="6">
        <RiskStatCard title="高风险" :value="statistics.highRisk" type="high" />
      </ElCol>
      <ElCol :span="6">
        <RiskStatCard title="中风险" :value="statistics.mediumRisk" type="medium" />
      </ElCol>
      <ElCol :span="6">
        <RiskStatCard title="低风险" :value="statistics.lowRisk" type="low" />
      </ElCol>
    </ElRow>

    <!-- 筛选区域 -->
    <FilterSection @apply="() => {}" @reset="resetFilters">
      <ElRow :gutter="20">
        <ElCol :span="6">
          <FilterItem label="风险等级:">
            <ElSelect v-model="filterRiskLevel" placeholder="选择风险等级" clearable>
              <ElOption v-for="item in riskLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
            </ElSelect>
          </FilterItem>
        </ElCol>
        <ElCol :span="6">
          <FilterItem label="风险类型:">
            <ElSelect v-model="filterRiskType" placeholder="选择风险类型" clearable>
              <ElOption v-for="item in riskTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </ElSelect>
          </FilterItem>
        </ElCol>
        <ElCol :span="8">
          <ElInput v-model="searchKeyword" placeholder="搜索产品/SKU/描述" clearable>
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </ElInput>
        </ElCol>
      </ElRow>
    </FilterSection>

    <!-- 数据表格 -->
    <DataListCard title="风险数据" :loading="loading">
      <ElTable :data="filteredData" stripe border style="width: 100%">
        <ElTableColumn type="index" label="序号" width="60" />
        <ElTableColumn prop="productName" label="产品名称" min-width="150" show-overflow-tooltip />
        <ElTableColumn prop="sku" label="SKU" width="120" />
        <ElTableColumn prop="riskType" label="风险类型" width="100">
          <template #default="{ row }">
            <ElTag :style="{ backgroundColor: getRiskTypeTagColor(row.riskType), color: '#fff', border: 'none' }">
              {{ row.riskType }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="riskLevel" label="风险等级" width="100">
          <template #default="{ row }">
            <ElTag :type="getRiskLevelType(row.riskLevel)">{{ row.riskLevel }}</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="riskScore" label="风险评分" width="150">
          <template #default="{ row }">
            <RiskScoreDisplay :value="row.riskScore" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="description" label="风险描述" min-width="200" show-overflow-tooltip />
        <ElTableColumn prop="impact" label="影响范围" min-width="180" show-overflow-tooltip />
        <ElTableColumn prop="suggestion" label="应对建议" min-width="200" show-overflow-tooltip />
        <ElTableColumn prop="reportDate" label="报告日期" width="120" />
      </ElTable>
    </DataListCard>
  </div>
</template>

<style scoped>
.risk-board-page {
  padding: 0;
}

.stats-row {
  margin-bottom: 20px;
}
</style>
