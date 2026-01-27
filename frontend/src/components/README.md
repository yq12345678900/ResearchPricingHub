# 公共组件说明

## 组件列表

### 1. StatisticsCard.vue
统计卡片组件，用于展示数字统计信息。

**Props:**
- `title`: 标题
- `value`: 数值
- `precision`: 小数精度，默认 0
- `prefix`: 前缀（如 ¥）
- `suffix`: 后缀（如 %）
- `color`: 颜色主题（red/orange/green/blue）
- `shadow`: 阴影效果（always/hover/never）

**使用示例:**
```vue
<StatisticsCard
  title="调研总数"
  :value="156"
  prefix="¥"
/>
```

### 2. PriceDisplay.vue
价格格式化显示组件。

**Props:**
- `value`: 价格数值
- `precision`: 小数精度，默认 2
- `showSymbol`: 是否显示货币符号，默认 true
- `symbol`: 货币符号，默认 '¥'
- `highlight`: 是否高亮显示，默认 false

**使用示例:**
```vue
<PriceDisplay :value="299.99" />
<PriceDisplay :value="180" highlight />
```

### 3. StatusTag.vue
状态标签组件，用于展示质量等级等状态。

**Props:**
- `status`: 状态类型（excellent/good/average/poor）或自定义字符串
- `text`: 自定义显示文本（可选）

**使用示例:**
```vue
<StatusTag status="excellent" /> <!-- 优 -->
<StatusTag status="good" /> <!-- 良 -->
<StatusTag status="custom" text="自定义" />
```

### 4. ProfitRateDisplay.vue
利润率显示组件，根据数值自动显示不同颜色。

**Props:**
- `value`: 利润率数值
- `precision`: 小数精度，默认 2
- `showSuffix`: 是否显示 % 符号，默认 true

**颜色规则:**
- >= 100%: 绿色
- >= 70%: 橙色
- >= 50%: 红色
- < 50%: 红色

**使用示例:**
```vue
<ProfitRateDisplay :value="85.5" />
```

### 5. FilterSection.vue
筛选区域组件，包含标题和操作按钮。

**Props:**
- `title`: 标题，默认 "筛选条件"
- `showActions`: 是否显示操作按钮，默认 true

**Events:**
- `apply`: 点击应用筛选
- `reset`: 点击重置

**Slots:**
- `default`: 筛选内容
- `extra-actions`: 额外的操作按钮

**使用示例:**
```vue
<FilterSection @apply="handleApply" @reset="handleReset">
  <ElSelect v-model="filter" />
</FilterSection>
```

### 6. DataListCard.vue
数据列表卡片组件。

**Props:**
- `title`: 卡片标题
- `shadow`: 阴影效果（always/hover/never）
- `loading`: 加载状态

**Slots:**
- `header-extra`: 标题右侧内容
- `default`: 卡片内容

**使用示例:**
```vue
<DataListCard title="调研数据" :loading="loading">
  <ElTable :data="data" />
</DataListCard>
```

### 7. FilterItem.vue
筛选项组件，统一的筛选条件布局。

**Props:**
- `label`: 标签文本
- `labelWidth`: 标签宽度，默认 "80px"

**使用示例:**
```vue
<FilterItem label="产品类目:">
  <ElSelect v-model="category" />
</FilterItem>
```

### 8. EmptyState.vue
空状态组件。

**Props:**
- `description`: 描述文本，默认 "暂无数据"
- `imageSize`: 图片大小

**使用示例:**
```vue
<EmptyState description="暂无调研数据" />
```

## 使用方式

### 方式1: 单独导入
```vue
<script setup lang="ts">
import { StatisticsCard, PriceDisplay } from '@/components'
</script>
```

### 方式2: 全局注册（在 main.ts 中）
```typescript
import * as Components from './components'

Object.entries(Components).forEach(([name, component]) => {
  app.component(name, component)
})
```
