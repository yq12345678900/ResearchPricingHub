<script setup lang="ts">
import { ref } from 'vue'
import { ElCard, ElForm, ElFormItem, ElInput, ElInputNumber, ElButton, ElSelect, ElOption, ElDatePicker, ElMessage, ElTable, ElTableColumn, ElTag } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 表单数据类型
interface ResearchData {
  productName: string
  productCategory: string
  researchDate: string
  marketPrice: number | null
  costPrice: number | null
  supplier: string
  moq: number | null
  leadTime: number | null
  quality: string
  remarks: string
}

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = ref<ResearchData>({
  productName: '',
  productCategory: '',
  researchDate: '',
  marketPrice: null,
  costPrice: null,
  supplier: '',
  moq: null,
  leadTime: null,
  quality: '',
  remarks: ''
})

// 已保存的调研记录列表
const researchList = ref<ResearchData[]>([])

// 表单验证规则
const rules: FormRules<ResearchData> = {
  productName: [
    { required: true, message: '请输入产品名称', trigger: 'blur' }
  ],
  productCategory: [
    { required: true, message: '请选择产品类目', trigger: 'change' }
  ],
  researchDate: [
    { required: true, message: '请选择调研日期', trigger: 'change' }
  ],
  marketPrice: [
    { required: true, message: '请输入市场价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '市场价格不能小于0', trigger: 'blur' }
  ],
  costPrice: [
    { required: true, message: '请输入成本价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '成本价格不能小于0', trigger: 'blur' }
  ]
}

// 产品类目选项
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

// 质量等级选项
const qualityOptions = [
  '优',
  '良',
  '中',
  '差'
]

// 提交表单
const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate((valid) => {
    if (valid) {
      // 添加到列表
      researchList.value.unshift({ ...formData.value })
      ElMessage.success('调研信息录入成功')
      // 重置表单
      formEl.resetFields()
    }
  })
}

// 重置表单
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

// 删除记录
const handleDelete = (index: number) => {
  researchList.value.splice(index, 1)
  ElMessage.success('删除成功')
}

// 计算利润率
const calculateProfitMargin = (marketPrice: number | null, costPrice: number | null) => {
  if (marketPrice && costPrice && costPrice > 0) {
    return (((marketPrice - costPrice) / costPrice) * 100).toFixed(2) + '%'
  }
  return '-'
}
</script>

<template>
  <div class="research-entry-page">
    <ElCard class="form-card" shadow="hover">
      <template #header>
        <h2>调研信息录入</h2>
      </template>

      <ElForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="产品名称" prop="productName">
              <ElInput v-model="formData.productName" placeholder="请输入产品名称" clearable />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="产品类目" prop="productCategory">
              <ElSelect v-model="formData.productCategory" placeholder="请选择产品类目" clearable>
                <ElOption
                  v-for="item in categoryOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="调研日期" prop="researchDate">
              <ElDatePicker
                v-model="formData.researchDate"
                type="date"
                placeholder="请选择调研日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="供应商" prop="supplier">
              <ElSelect v-model="formData.supplier" placeholder="请选择供应商" clearable>
                <ElOption
                  v-for="item in supplierOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="市场价格" prop="marketPrice">
              <ElInputNumber
                v-model="formData.marketPrice"
                :min="0"
                :precision="2"
                :controls="false"
                placeholder="请输入市场价格"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="成本价格" prop="costPrice">
              <ElInputNumber
                v-model="formData.costPrice"
                :min="0"
                :precision="2"
                :controls="false"
                placeholder="请输入成本价格"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="最小起订量" prop="moq">
              <ElInputNumber
                v-model="formData.moq"
                :min="1"
                :precision="0"
                :controls="false"
                placeholder="请输入最小起订量"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="交货周期(天)" prop="leadTime">
              <ElInputNumber
                v-model="formData.leadTime"
                :min="1"
                :precision="0"
                :controls="false"
                placeholder="请输入交货周期"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="质量等级" prop="quality">
              <ElSelect v-model="formData.quality" placeholder="请选择质量等级" clearable>
                <ElOption
                  v-for="item in qualityOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElFormItem label="备注" prop="remarks">
          <ElInput
            v-model="formData.remarks"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
            clearable
          />
        </ElFormItem>

        <ElFormItem>
          <ElButton type="primary" @click="handleSubmit(formRef)">提交</ElButton>
          <ElButton @click="handleReset(formRef)">重置</ElButton>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <!-- 已录入记录列表 -->
    <ElCard v-if="researchList.length > 0" class="list-card" shadow="hover">
      <template #header>
        <h2>已录入记录</h2>
      </template>

      <ElTable :data="researchList" stripe border style="width: 100%">
        <ElTableColumn type="index" label="序号" width="60" />
        <ElTableColumn prop="productName" label="产品名称" min-width="150" />
        <ElTableColumn prop="productCategory" label="产品类目" width="120">
          <template #default="{ row }">
            <ElTag>{{ row.productCategory }}</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="researchDate" label="调研日期" width="120" />
        <ElTableColumn prop="marketPrice" label="市场价格" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.marketPrice?.toFixed(2) }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="costPrice" label="成本价格" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.costPrice?.toFixed(2) }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="利润率" width="100" align="right">
          <template #default="{ row }">
            {{ calculateProfitMargin(row.marketPrice, row.costPrice) }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="supplier" label="供应商" width="120" />
        <ElTableColumn prop="moq" label="MOQ" width="100" align="right" />
        <ElTableColumn prop="quality" label="质量" width="80">
          <template #default="{ row }">
            <ElTag :type="row.quality === '优' ? 'success' : row.quality === '良' ? 'primary' : row.quality === '中' ? 'warning' : 'danger'">
              {{ row.quality || '-' }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="80" fixed="right">
          <template #default="{ $index }">
            <ElButton type="danger" link @click="handleDelete($index)">删除</ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElCard>
  </div>
</template>

<style scoped>
.research-entry-page {
  padding: 0;
}

.form-card {
  margin-bottom: 20px;
}

.form-card h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.list-card {
  margin-bottom: 20px;
}

.list-card h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
