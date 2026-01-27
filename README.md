# ResearchPricingHub - 调研核价中心

一个用于产品调研、核价管理、风险监控和数据统计的综合管理系统。

## 项目功能模块

### 1. 调研录入
- 产品信息录入
- 供应商信息管理
- 市场价格与成本价格记录
- 质量等级评估
- 最小起订量(MOQ)和交货周期管理

### 2. 调研看板
- 调研数据展示与筛选
- 统计分析（平均价格、利润率等）
- 多维度数据筛选
- 产品质量标签管理

### 3. 核价信息录入
- 成本明细录入（材料、人工、制造、物流）
- SKU管理
- 自动计算总成本
- 建议售价与竞品价格对比

### 4. 核价看板
- 核价数据展示
- 利润率分析
- 价格优势对比
- 多条件筛选

### 5. 风险看板
- 风险等级评估（高/中/低）
- 风险类型分类（供应链、质量、价格、交期、合规）
- 风险评分展示
- 应对建议管理

### 6. 数据统计
- 产品类目分布
- 利润率分析
- 风险分布统计
- 调研核价趋势分析

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI组件库**: Element Plus
- **图表库**: ECharts
- **路由**: Vue Router 4

## 目录结构

```
ResearchPricingHub/
├── frontend/
│   ├── src/
│   │   ├── router/
│   │   │   └── index.ts          # 路由配置
│   │   ├── views/
│   │   │   ├── ResearchEntry.vue     # 调研录入
│   │   │   ├── ResearchBoard.vue     # 调研看板
│   │   │   ├── PricingEntry.vue      # 核价信息录入
│   │   │   ├── PricingBoard.vue      # 核价看板
│   │   │   ├── RiskBoard.vue         # 风险看板
│   │   │   └── DataStatistics.vue    # 数据统计
│   │   ├── App.vue              # 根组件
│   │   ├── main.ts              # 应用入口
│   │   └── vite-env.d.ts        # TypeScript类型声明
│   ├── index.html               # HTML模板
│   ├── package.json             # 项目依赖
│   ├── vite.config.ts           # Vite配置
│   ├── tsconfig.json            # TypeScript配置
│   ├── tsconfig.app.json        # 应用TypeScript配置
│   └── tsconfig.node.json       # Node TypeScript配置
└── README.md                    # 项目说明
```

## 安装和运行

### 安装依赖

```bash
cd frontend
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目说明

本项目是基于 E-commerce-data-system 项目结构创建的调研核价管理系统。主要功能包括：

1. **调研管理**: 记录产品调研信息，包括市场价格、成本价格、供应商信息等
2. **核价管理**: 详细记录产品成本构成，计算利润率，与竞品价格对比
3. **风险监控**: 识别和评估供应链、质量、价格、交期、合规等各类风险
4. **数据统计**: 通过图表展示各类数据的分布和趋势

## 特性

- 响应式布局设计
- 表单数据验证
- 数据筛选和搜索
- 图表可视化展示
- 统计分析功能
- 风险等级评估
