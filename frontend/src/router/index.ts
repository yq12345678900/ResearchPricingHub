import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/research-entry'
  },
  {
    path: '/research-entry',
    name: 'ResearchEntry',
    component: () => import('../views/ResearchEntry.vue'),
    meta: { title: '调研录入', keepAlive: true }
  },
  {
    path: '/research-board',
    name: 'ResearchBoard',
    component: () => import('../views/ResearchBoard.vue'),
    meta: { title: '调研看板', keepAlive: true }
  },
  {
    path: '/pricing-entry',
    name: 'PricingEntry',
    component: () => import('../views/PricingEntry.vue'),
    meta: { title: '核价信息录入', keepAlive: true }
  },
  {
    path: '/pricing-board',
    name: 'PricingBoard',
    component: () => import('../views/PricingBoard.vue'),
    meta: { title: '核价看板', keepAlive: true }
  },
  {
    path: '/risk-board',
    name: 'RiskBoard',
    component: () => import('../views/RiskBoard.vue'),
    meta: { title: '风险看板', keepAlive: true }
  },
  {
    path: '/data-statistics',
    name: 'DataStatistics',
    component: () => import('../views/DataStatistics.vue'),
    meta: { title: '数据统计', keepAlive: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || '调研核价中心'} - 调研核价管理`
  next()
})

export default router
