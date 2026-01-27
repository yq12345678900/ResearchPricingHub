<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElRow, ElCol, ElSelect, ElOption, ElDatePicker, ElInput, ElTable, ElTableColumn, ElTag, ElInputNumber } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { StatisticsCard, FilterSection, FilterItem, DataListCard, PriceDisplay, ProfitRateDisplay, StatusTag } from '@/components'

// 调研数据接口
interface ResearchItem {
  id: number
  productName: string
  productCategory: string
  researchDate: string
  marketPrice: number
  costPrice: number
  supplier: string
  moq: number
  leadTime: number
  quality: string
  profitMargin: number
}

const loading = ref(false)
const researchData = ref<ResearchItem[]>([])

// 筛选条件
const filterCategory = ref('')
const filterSupplier = ref('')
const filterDateRange = ref<[Date, Date] | null>(null)
const searchKeyword = ref('')

// 类目选项
const categoryOptions = [
  '电子产品',
  '家居用品',
  '服装鞋帽',
  '食品饮料',
  '美妆护肤',
  '母婴用品',
  '运动户外',
  '图书文具',
  '其他'
]

// 供应商选项
const supplierOptions = [
  '供应商A',
  '供应商B',
  '供应商C',
  '供应商D',
  '其他'
]

// 过滤后的数据
const filteredData = computed(() => {
  let filtered = [...researchData.value]

  if (filterCategory.value) {
    filtered = filtered.filter(item => item.productCategory === filterCategory.value)
  }

  if (filterSupplier.value) {
    filtered = filtered.filter(item => item.supplier === filterSupplier.value)
  }

  if (filterDateRange.value) {
    const [start, end] = filterDateRange.value
    filtered = filtered.filter(item => {
      const date = new Date(item.researchDate)
      return date >= start && date <= end
    })
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.productName.toLowerCase().includes(keyword) ||
      item.supplier.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 统计数据
const statistics = computed(() => {
  const data = filteredData.value
  const totalCount = data.length

  if (data.length === 0) {
    return {
      totalCount: 0,
      avgMarketPrice: 0,
      avgCostPrice: 0,
      avgProfitMargin: 0,
      highQualityCount: 0
    }
  }

  const totalMarketPrice = data.reduce((sum, item) => sum + item.marketPrice, 0)
  const totalCostPrice = data.reduce((sum, item) => sum + item.costPrice, 0)
  const avgMarketPrice = totalMarketPrice / data.length
  const avgCostPrice = totalCostPrice / data.length
  const avgProfitMargin = ((avgMarketPrice - avgCostPrice) / avgCostPrice) * 100
  const highQualityCount = data.filter(item => item.quality === '优').length

  return {
    totalCount,
    avgMarketPrice,
    avgCostPrice,
    avgProfitMargin,
    highQualityCount
  }
})

// 数据加载（从后端API获取）
const loadData = () => {
  loading.value = true
  // TODO: 从后端API获取数据
  // axios.get('/api/research').then(response => {
  //   researchData.value = response.data
  //   loading.value = false
  // })

  // 暂时设置为空数组
  researchData.value = []
  loading.value = false
}

// 重置筛选
const resetFilters = () => {
  filterCategory.value = ''
  filterSupplier.value = ''
  filterDateRange.value = null
  searchKeyword.value = ''
}

// 格式化日期
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

// 质量等级映射
const qualityMap: Record<string, 'excellent' | 'good' | 'average' | 'poor'> = {
  '优': 'excellent',
  '良': 'good',
  '中': 'average',
  '差': 'poor'
}

const getQualityLevel = (quality: string) => {
  return qualityMap[quality] || 'average'
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="research-board-page">
    <!-- 统计卡片 -->
    <ElRow :gutter="20" class="stats-row">
      <ElCol :span="6">
        <StatisticsCard title="调研总数" :value="statistics.totalCount" />
      </ElCol>
      <ElCol :span="6">
        <StatisticsCard title="平均市场价格" :value="statistics.avgMarketPrice" :precision="2" prefix="¥" />
      </ElCol>
      <ElCol :span="6">
        <StatisticsCard title="平均成本价格" :value="statistics.avgCostPrice" :precision="2" prefix="¥" />
      </ElCol>
      <ElCol :span="6">
        <StatisticsCard title="优质产品数" :value="statistics.highQualityCount" />
      </ElCol>
    </ElRow>

    <!-- 筛选区域 -->
    <FilterSection @apply="() => {}" @reset="resetFilters">
      <ElRow :gutter="20">
        <ElCol :span="6">
          <FilterItem label="产品类目:">
            <ElSelect v-model="filterCategory" placeholder="选择类目" clearable>
              <ElOption v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
            </ElSelect>
          </FilterItem>
        </ElCol>
        <ElCol :span="6">
          <FilterItem label="供应商:">
            <ElSelect v-model="filterSupplier" placeholder="选择供应商" clearable>
              <ElOption v-for="item in supplierOptions" :key="item" :label="item" :value="item" />
            </ElSelect>
          </FilterItem>
        </ElCol>
        <ElCol :span="8">
          <FilterItem label="日期范围:">
            <ElDatePicker
              v-model="filterDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="flex: 1"
            />
          </FilterItem>
        </ElCol>
        <ElCol :span="4">
          <ElInput v-model="searchKeyword" placeholder="搜索产品/供应商" clearable>
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </ElInput>
        </ElCol>
      </ElRow>
    </FilterSection>

    <!-- 数据表格 -->
    <DataListCard title="调研数据" :loading="loading">
      <ElTable :data="filteredData" stripe border style="width: 100%">
        <ElTableColumn type="index" label="序号" width="60" />
        <ElTableColumn prop="productName" label="产品名称" min-width="150" show-overflow-tooltip />
        <ElTableColumn prop="productCategory" label="产品类目" width="120">
          <template #default="{ row }">
            <ElTag>{{ row.productCategory }}</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="researchDate" label="调研日期" width="120">
          <template #default="{ row }">{{ formatDate(row.researchDate) }}</template>
        </ElTableColumn>
        <ElTableColumn prop="marketPrice" label="市场价格" width="120" align="right">
          <template #default="{ row }">
            <PriceDisplay :value="row.marketPrice" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="costPrice" label="成本价格" width="120" align="right">
          <template #default="{ row }">
            <PriceDisplay :value="row.costPrice" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="profitMargin" label="利润率" width="100" align="right">
          <template #default="{ row }">
            <ProfitRateDisplay :value="row.profitMargin" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="supplier" label="供应商" width="120" />
        <ElTableColumn prop="moq" label="MOQ" width="100" align="right">
          <template #default="{ row }">{{ row.moq || '-' }}</template>
        </ElTableColumn>
        <ElTableColumn prop="leadTime" label="交货周期(天)" width="130" align="right">
          <template #default="{ row }">{{ row.leadTime || '-' }}</template>
        </ElTableColumn>
        <ElTableColumn prop="quality" label="质量" width="80">
          <template #default="{ row }">
            <StatusTag :status="getQualityLevel(row.quality)" />
          </template>
        </ElTableColumn>
      </ElTable>
    </DataListCard>
  </div>
</template>

<style scoped>
.research-board-page {
  padding: 0;
}

.stats-row {
  margin-bottom: 20px;
}
</style>
