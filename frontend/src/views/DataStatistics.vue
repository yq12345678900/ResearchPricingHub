<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElRow, ElCol, ElDatePicker, ElButton, ElSelect, ElOption } from 'element-plus'
import { FilterSection, FilterItem, StatisticsCard, EmptyState } from '@/components'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

// 图表引用
const categoryChartRef = ref<HTMLElement>()
const profitChartRef = ref<HTMLElement>()
const riskChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()

let categoryChart: ECharts | null = null
let profitChart: ECharts | null = null
let riskChart: ECharts | null = null
let trendChart: ECharts | null = null

// 筛选条件
const dateRange = ref<[Date, Date] | null>(null)
const categoryFilter = ref('')

// 类目选项
const categoryOptions = [
  '全部',
  '电子产品',
  '家居用品',
  '服装鞋帽',
  '食品饮料',
  '美妆护肤',
  '母婴用品',
  '运动户外'
]

// 统计数据（从后端API获取）
const statistics = ref({
  totalProducts: 0,
  totalResearch: 0,
  totalPricing: 0,
  avgProfitMargin: 0,
  highRiskCount: 0,
  mediumRiskCount: 0,
  lowRiskCount: 0
})

// 是否有数据
const hasData = ref(false)

// 加载统计数据
const loadStatistics = () => {
  // TODO: 从后端API获取统计数据
  // axios.get('/api/statistics').then(response => {
  //   statistics.value = response.data
  //   hasData.value = true
  // })

  // 暂时设置为空
  statistics.value = {
    totalProducts: 0,
    totalResearch: 0,
    totalPricing: 0,
    avgProfitMargin: 0,
    highRiskCount: 0,
    mediumRiskCount: 0,
    lowRiskCount: 0
  }
  hasData.value = false
}

// 初始化类目分布图
const initCategoryChart = () => {
  if (!categoryChartRef.value) return
  categoryChart = echarts.init(categoryChartRef.value)

  const option = {
    title: {
      text: '产品类目分布',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 500
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [
      {
        name: '产品数量',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c}'
        },
        data: []
      }
    ]
  }

  categoryChart.setOption(option)
}

// 初始化利润率分析图
const initProfitChart = () => {
  if (!profitChartRef.value) return
  profitChart = echarts.init(profitChartRef.value)

  const option = {
    title: {
      text: '利润率分布',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 500
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: [],
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      name: '利润率 (%)',
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: '平均利润率',
        type: 'bar',
        data: [],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 1, color: '#188df0' }
          ]),
          borderRadius: [5, 5, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%'
        }
      }
    ]
  }

  profitChart.setOption(option)
}

// 初始化风险分布图
const initRiskChart = () => {
  if (!riskChartRef.value) return
  riskChart = echarts.init(riskChartRef.value)

  const option = {
    title: {
      text: '风险等级分布',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 500
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [
      {
        name: '风险数量',
        type: 'pie',
        radius: '60%',
        data: [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          formatter: '{b}: {c}'
        }
      }
    ]
  }

  riskChart.setOption(option)
}

// 初始化趋势图
const initTrendChart = () => {
  if (!trendChartRef.value) return
  trendChart = echarts.init(trendChartRef.value)

  const option = {
    title: {
      text: '调研核价趋势',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 500
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['调研数量', '核价数量'],
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 80,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '调研数量',
        type: 'line',
        data: [],
        smooth: true,
        itemStyle: { color: '#409eff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
          ])
        }
      },
      {
        name: '核价数量',
        type: 'line',
        data: [],
        smooth: true,
        itemStyle: { color: '#67c23a' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
            { offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
          ])
        }
      }
    ]
  }

  trendChart.setOption(option)
}

// 应用筛选
const applyFilters = () => {
  // TODO: 根据筛选条件重新加载数据
  console.log('应用筛选', { dateRange: dateRange.value, category: categoryFilter.value })
  loadStatistics()
}

// 重置筛选
const resetFilters = () => {
  dateRange.value = null
  categoryFilter.value = ''
  applyFilters()
}

// 窗口大小变化时重新渲染图表
const handleResize = () => {
  categoryChart?.resize()
  profitChart?.resize()
  riskChart?.resize()
  trendChart?.resize()
}

onMounted(() => {
  loadStatistics()
  initCategoryChart()
  initProfitChart()
  initRiskChart()
  initTrendChart()

  window.addEventListener('resize', handleResize)
})
</script>

<template>
  <div class="data-statistics-page">
    <!-- 筛选区域 -->
    <FilterSection title="数据筛选" @apply="applyFilters" @reset="resetFilters">
      <ElRow :gutter="20">
        <ElCol :span="8">
          <FilterItem label="时间范围:">
            <ElDatePicker
              v-model="dateRange"
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
          <FilterItem label="产品类目:">
            <ElSelect v-model="categoryFilter" placeholder="选择类目" clearable>
              <ElOption v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
            </ElSelect>
          </FilterItem>
        </ElCol>
      </ElRow>
    </FilterSection>

    <!-- 暂无数据提示 -->
    <EmptyState v-if="!hasData" description="暂无数据，请先录入调研或核价信息" />

    <template v-else>
      <!-- 统计卡片 -->
      <ElRow :gutter="20" class="stats-row">
        <ElCol :span="6">
          <StatisticsCard title="产品总数" :value="statistics.totalProducts" />
        </ElCol>
        <ElCol :span="6">
          <StatisticsCard title="调研总数" :value="statistics.totalResearch" />
        </ElCol>
        <ElCol :span="6">
          <StatisticsCard title="核价总数" :value="statistics.totalPricing" />
        </ElCol>
        <ElCol :span="6">
          <StatisticsCard title="平均利润率" :value="statistics.avgProfitMargin" :precision="2" suffix="%" />
        </ElCol>
      </ElRow>

      <!-- 风险统计 -->
      <ElRow :gutter="20" class="risk-stats-row">
        <ElCol :span="8">
          <div class="risk-stat-item high-risk">
            <div class="risk-stat-label">高风险</div>
            <div class="risk-stat-value">{{ statistics.highRiskCount }}</div>
          </div>
        </ElCol>
        <ElCol :span="8">
          <div class="risk-stat-item medium-risk">
            <div class="risk-stat-label">中风险</div>
            <div class="risk-stat-value">{{ statistics.mediumRiskCount }}</div>
          </div>
        </ElCol>
        <ElCol :span="8">
          <div class="risk-stat-item low-risk">
            <div class="risk-stat-label">低风险</div>
            <div class="risk-stat-value">{{ statistics.lowRiskCount }}</div>
          </div>
        </ElCol>
      </ElRow>

      <!-- 图表区域 -->
      <ElRow :gutter="20" class="charts-row">
        <ElCol :span="12">
          <ElCard shadow="hover">
            <div ref="categoryChartRef" class="chart-container"></div>
          </ElCard>
        </ElCol>
        <ElCol :span="12">
          <ElCard shadow="hover">
            <div ref="profitChartRef" class="chart-container"></div>
          </ElCard>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20" class="charts-row">
        <ElCol :span="12">
          <ElCard shadow="hover">
            <div ref="riskChartRef" class="chart-container"></div>
          </ElCard>
        </ElCol>
        <ElCol :span="12">
          <ElCard shadow="hover">
            <div ref="trendChartRef" class="chart-container"></div>
          </ElCard>
        </ElCol>
      </ElRow>
    </template>
  </div>
</template>

<style scoped>
.data-statistics-page {
  padding: 0;
}

.stats-row {
  margin-bottom: 20px;
}

.risk-stats-row {
  margin-bottom: 20px;
}

.risk-stat-item {
  text-align: center;
  padding: 15px 0;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.3s;
}

.risk-stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.risk-stat-label {
  font-size: 14px;
  margin-bottom: 8px;
}

.risk-stat-value {
  font-size: 36px;
  font-weight: bold;
}

.risk-stat-item.high-risk .risk-stat-label,
.risk-stat-item.high-risk .risk-stat-value {
  color: #f56c6c;
}

.risk-stat-item.medium-risk .risk-stat-label,
.risk-stat-item.medium-risk .risk-stat-value {
  color: #e6a23c;
}

.risk-stat-item.low-risk .risk-stat-label,
.risk-stat-item.low-risk .risk-stat-value {
  color: #67c23a;
}

.charts-row {
  margin-bottom: 20px;
}

.chart-container {
  width: 100%;
  height: 400px;
}
</style>
