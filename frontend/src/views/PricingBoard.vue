<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElRow, ElCol, ElSelect, ElOption, ElDatePicker, ElInput, ElTable, ElTableColumn, ElTag } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { StatisticsCard, FilterSection, FilterItem, DataListCard, PriceDisplay, ProfitRateDisplay } from '@/components'

// 核价数据类型
interface PricingItem {
  id: number
  productName: string
  sku: string
  pricingDate: string
  materialCost: number
  laborCost: number
  manufacturingCost: number
  logisticsCost: number
  totalCost: number
  suggestedPrice: number
  competitorPrice: number
  profitMargin: number
  priceAdvantage: number
}

const loading = ref(false)
const pricingData = ref<PricingItem[]>([])

// 筛选条件
const filterDateRange = ref<[Date, Date] | null>(null)
const priceRange = ref('')
const searchKeyword = ref('')

// 价格范围选项
const priceRangeOptions = [
  { label: '全部', value: '' },
  { label: '0-50元', value: '0-50' },
  { label: '50-100元', value: '50-100' },
  { label: '100-200元', value: '100-200' },
  { label: '200元以上', value: '200-' }
]

// 过滤后的数据
const filteredData = computed(() => {
  let filtered = [...pricingData.value]

  if (filterDateRange.value) {
    const [start, end] = filterDateRange.value
    filtered = filtered.filter(item => {
      const date = new Date(item.pricingDate)
      return date >= start && date <= end
    })
  }

  if (priceRange.value) {
    const [min, max] = priceRange.value.split('-').map(v => v === '' ? Infinity : parseFloat(v))
    filtered = filtered.filter(item => {
      const price = item.suggestedPrice
      return price >= (min === Infinity ? 0 : min) && price <= (max === Infinity ? Infinity : max)
    })
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.productName.toLowerCase().includes(keyword) ||
      item.sku.toLowerCase().includes(keyword)
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
      avgTotalCost: 0,
      avgSuggestedPrice: 0,
      avgProfitMargin: 0
    }
  }

  const avgTotalCost = data.reduce((sum, item) => sum + item.totalCost, 0) / data.length
  const avgSuggestedPrice = data.reduce((sum, item) => sum + item.suggestedPrice, 0) / data.length
  const avgProfitMargin = data.reduce((sum, item) => sum + item.profitMargin, 0) / data.length

  return {
    totalCount,
    avgTotalCost,
    avgSuggestedPrice,
    avgProfitMargin
  }
})

// 数据加载（从后端API获取）
const loadData = () => {
  loading.value = true
  // TODO: 从后端API获取数据
  // axios.get('/api/pricing').then(response => {
  //   pricingData.value = response.data
  //   loading.value = false
  // })

  // 暂时设置为空数组
  pricingData.value = []
  loading.value = false
}

// 重置筛选
const resetFilters = () => {
  filterDateRange.value = null
  priceRange.value = ''
  searchKeyword.value = ''
}

// 获取价格优势标签类型
const getPriceAdvantageType = (advantage: number) => {
  if (advantage >= 10) return 'success'
  if (advantage >= 5) return 'primary'
  return 'warning'
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="pricing-board-page">
    <!-- 统计卡片 -->
    <ElRow :gutter="20" class="stats-row">
      <ElCol :span="6">
        <StatisticsCard title="核价总数" :value="statistics.totalCount" />
      </ElCol>
      <ElCol :span="6">
        <StatisticsCard title="平均总成本" :value="statistics.avgTotalCost" :precision="2" prefix="¥" />
      </ElCol>
      <ElCol :span="6">
        <StatisticsCard title="平均建议售价" :value="statistics.avgSuggestedPrice" :precision="2" prefix="¥" />
      </ElCol>
      <ElCol :span="6">
        <StatisticsCard title="平均利润率" :value="statistics.avgProfitMargin" :precision="2" suffix="%" />
      </ElCol>
    </ElRow>

    <!-- 筛选区域 -->
    <FilterSection @apply="() => {}" @reset="resetFilters">
      <ElRow :gutter="20">
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
        <ElCol :span="6">
          <FilterItem label="价格范围:">
            <ElSelect v-model="priceRange" placeholder="选择价格范围" clearable>
              <ElOption v-for="item in priceRangeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </ElSelect>
          </FilterItem>
        </ElCol>
        <ElCol :span="6">
          <ElInput v-model="searchKeyword" placeholder="搜索产品/SKU" clearable>
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </ElInput>
        </ElCol>
      </ElRow>
    </FilterSection>

    <!-- 数据表格 -->
    <DataListCard title="核价数据" :loading="loading">
      <ElTable :data="filteredData" stripe border style="width: 100%">
        <ElTableColumn type="index" label="序号" width="60" />
        <ElTableColumn prop="productName" label="产品名称" min-width="150" show-overflow-tooltip />
        <ElTableColumn prop="sku" label="SKU" width="120" />
        <ElTableColumn prop="pricingDate" label="核价日期" width="120" />
        <ElTableColumn prop="totalCost" label="总成本" width="100" align="right">
          <template #default="{ row }">
            <PriceDisplay :value="row.totalCost" highlight />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="suggestedPrice" label="建议售价" width="110" align="right">
          <template #default="{ row }">
            <PriceDisplay :value="row.suggestedPrice" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="competitorPrice" label="竞品价格" width="110" align="right">
          <template #default="{ row }">
            <PriceDisplay :value="row.competitorPrice" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="profitMargin" label="利润率" width="100" align="right">
          <template #default="{ row }">
            <ProfitRateDisplay :value="row.profitMargin" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="priceAdvantage" label="价格优势" width="110" align="right">
          <template #default="{ row }">
            <ElTag :type="getPriceAdvantageType(row.priceAdvantage)">
              {{ row.priceAdvantage.toFixed(2) }}%
            </ElTag>
          </template>
        </ElTableColumn>
      </ElTable>
    </DataListCard>
  </div>
</template>

<style scoped>
.pricing-board-page {
  padding: 0;
}

.stats-row {
  margin-bottom: 20px;
}
</style>
