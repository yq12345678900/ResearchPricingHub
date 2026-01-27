<script setup lang="ts">
import { computed } from 'vue'
import { ElContainer, ElAside, ElMenu, ElMenuItem, ElHeader } from 'element-plus'
import { Edit, DataAnalysis, Money, Warning, Histogram } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const handleMenuSelect = (index: string) => {
  router.push(index)
}

// 判断是否显示返回按钮
const showBackButton = computed(() => {
  return route.meta.showBackButton || false
})

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<template>
  <ElContainer class="app-container">
    <ElAside width="200px" class="sidebar">
      <div class="logo">
        <h2>调研核价中心</h2>
      </div>
      <ElMenu
        :default-active="$route.path"
        class="el-menu-vertical"
        @select="handleMenuSelect"
      >
        <ElMenuItem index="/research-entry">
          <el-icon><Edit /></el-icon>
          <span>调研录入</span>
        </ElMenuItem>
        <ElMenuItem index="/research-board">
          <el-icon><DataAnalysis /></el-icon>
          <span>调研看板</span>
        </ElMenuItem>
        <ElMenuItem index="/pricing-entry">
          <el-icon><Edit /></el-icon>
          <span>核价信息录入</span>
        </ElMenuItem>
        <ElMenuItem index="/pricing-board">
          <el-icon><Money /></el-icon>
          <span>核价看板</span>
        </ElMenuItem>
        <ElMenuItem index="/risk-board">
          <el-icon><Warning /></el-icon>
          <span>风险看板</span>
        </ElMenuItem>
        <ElMenuItem index="/data-statistics">
          <el-icon><Histogram /></el-icon>
          <span>数据统计</span>
        </ElMenuItem>
      </ElMenu>
    </ElAside>
    <ElContainer class="main-container">
      <ElHeader class="header">
        <div class="header-content">
          <div class="header-left">
            <h1>{{ $route.meta.title || '调研核价中心' }}</h1>
          </div>
        </div>
      </ElHeader>
      <ElMain class="main-content">
        <RouterView v-slot="{ Component, route }">
          <KeepAlive :include="['ResearchEntry', 'ResearchBoard', 'PricingEntry', 'PricingBoard', 'RiskBoard', 'DataStatistics']">
            <component :is="Component" :key="route.name" />
          </KeepAlive>
        </RouterView>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 200px;
  background-color: #304156;
  color: #fff;
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: #434a50;
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-track {
  background-color: #304156;
}

.main-container {
  margin-left: 200px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #434a50;
  position: sticky;
  top: 0;
  background-color: #304156;
  z-index: 1;
}

.logo h2 {
  margin: 0;
  color: #fff;
  font-size: 18px;
}

.el-menu-vertical {
  border-right: none;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 999;
  padding: 0 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  overflow: visible;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

#app {
  min-height: 100vh;
}
</style>
