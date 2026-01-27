<script setup lang="ts">
import { ref } from 'vue'
import { ElCard, ElForm, ElFormItem, ElInput, ElInputNumber, ElButton, ElSelect, ElOption, ElDatePicker, ElMessage, ElTable, ElTableColumn, ElTag } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 核价数据类型
interface PricingData {
  productName: string
  sku: string
  pricingDate: string
  materialCost: number | null
  laborCost: number | null
  manufacturingCost: number | null
  logisticsCost: number | null
  totalCost: number | null
  suggestedPrice: number | null
  competitorPrice: number | null
  remarks: string
}

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = ref<PricingData>({
  productName: '',
  sku: '',
  pricingDate: '',
  materialCost: null,
  laborCost: null,
  manufacturingCost: null,
  logisticsCost: null,
  totalCost: null,
  suggestedPrice: null,
  competitorPrice: null,
  remarks: ''
})

// 已保存的核价记录列表
const pricingList = ref<PricingData[]>([])

// 表单验证规则
const rules: FormRules<PricingData> = {
  productName: [
    { required: true, message: '请输入产品名称', trigger: 'blur' }
  ],
  sku: [
    { required: true, message: '请输入SKU', trigger: 'blur' }
  ],
  pricingDate: [
    { required: true, message: '请选择核价日期', trigger: 'change' }
  ],
  materialCost: [
    { required: true, message: '请输入材料成本', trigger: 'blur' }
  ],
  laborCost: [
    { required: true, message: '请输入人工成本', trigger: 'blur' }
  ]
}

// 自动计算总成本
const calculateTotalCost = () => {
  const material = formData.value.materialCost || 0
  const labor = formData.value.laborCost || 0
  const manufacturing = formData.value.manufacturingCost || 0
  const logistics = formData.value.logisticsCost || 0
  formData.value.totalCost = material + labor + manufacturing + logistics
}

// 计算利润率
const calculateProfitMargin = (price: number | null, cost: number | null) => {
  if (price && cost && cost > 0) {
    return (((price - cost) / cost) * 100).toFixed(2) + '%'
  }
  return '-'
}

// 提交表单
const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate((valid) => {
    if (valid) {
      calculateTotalCost()
      // 添加到列表
      pricingList.value.unshift({ ...formData.value })
      ElMessage.success('核价信息录入成功')
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
  pricingList.value.splice(index, 1)
  ElMessage.success('删除成功')
}
</script>

<template>
  <div class="pricing-entry-page">
    <ElCard class="form-card" shadow="hover">
      <template #header>
        <h2>核价信息录入</h2>
      </template>

      <ElForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="140px"
        label-position="right"
      >
        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="产品名称" prop="productName">
              <ElInput v-model="formData.productName" placeholder="请输入产品名称" clearable />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="SKU" prop="sku">
              <ElInput v-model="formData.sku" placeholder="请输入SKU" clearable />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="核价日期" prop="pricingDate">
              <ElDatePicker
                v-model="formData.pricingDate"
                type="date"
                placeholder="请选择核价日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElCard class="cost-section" shadow="never">
          <template #header>
            <h3>成本明细</h3>
          </template>

          <ElRow :gutter="20">
            <ElCol :span="12">
              <ElFormItem label="材料成本" prop="materialCost">
                <ElInputNumber
                  v-model="formData.materialCost"
                  :min="0"
                  :precision="2"
                  :controls="false"
                  placeholder="请输入材料成本"
                  style="width: 100%"
                  @change="calculateTotalCost"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="人工成本" prop="laborCost">
                <ElInputNumber
                  v-model="formData.laborCost"
                  :min="0"
                  :precision="2"
                  :controls="false"
                  placeholder="请输入人工成本"
                  style="width: 100%"
                  @change="calculateTotalCost"
                />
              </ElFormItem>
            </ElCol>
          </ElRow>

          <ElRow :gutter="20">
            <ElCol :span="12">
              <ElFormItem label="制造成本" prop="manufacturingCost">
                <ElInputNumber
                  v-model="formData.manufacturingCost"
                  :min="0"
                  :precision="2"
                  :controls="false"
                  placeholder="请输入制造成本"
                  style="width: 100%"
                  @change="calculateTotalCost"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="物流成本" prop="logisticsCost">
                <ElInputNumber
                  v-model="formData.logisticsCost"
                  :min="0"
                  :precision="2"
                  :controls="false"
                  placeholder="请输入物流成本"
                  style="width: 100%"
                  @change="calculateTotalCost"
                />
              </ElFormItem>
            </ElCol>
          </ElRow>

          <ElFormItem label="总成本">
            <ElInputNumber
              v-model="formData.totalCost"
              :precision="2"
              :controls="false"
              disabled
              style="width: 200px"
            />
          </ElFormItem>
        </ElCard>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="建议售价" prop="suggestedPrice">
              <ElInputNumber
                v-model="formData.suggestedPrice"
                :min="0"
                :precision="2"
                :controls="false"
                placeholder="请输入建议售价"
                style="width: 100%"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="竞品价格" prop="competitorPrice">
              <ElInputNumber
                v-model="formData.competitorPrice"
                :min="0"
                :precision="2"
                :controls="false"
                placeholder="请输入竞品价格"
                style="width: 100%"
              />
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
    <ElCard v-if="pricingList.length > 0" class="list-card" shadow="hover">
      <template #header>
        <h2>已录入记录</h2>
      </template>

      <ElTable :data="pricingList" stripe border style="width: 100%">
        <ElTableColumn type="index" label="序号" width="60" />
        <ElTableColumn prop="productName" label="产品名称" min-width="150" />
        <ElTableColumn prop="sku" label="SKU" width="140" />
        <ElTableColumn prop="pricingDate" label="核价日期" width="120" />
        <ElTableColumn prop="materialCost" label="材料成本" width="110" align="right">
          <template #default="{ row }">¥{{ row.materialCost?.toFixed(2) }}</template>
        </ElTableColumn>
        <ElTableColumn prop="laborCost" label="人工成本" width="110" align="right">
          <template #default="{ row }">¥{{ row.laborCost?.toFixed(2) }}</template>
        </ElTableColumn>
        <ElTableColumn prop="totalCost" label="总成本" width="110" align="right">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: bold;">¥{{ row.totalCost?.toFixed(2) }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="suggestedPrice" label="建议售价" width="110" align="right">
          <template #default="{ row }">¥{{ row.suggestedPrice?.toFixed(2) }}</template>
        </ElTableColumn>
        <ElTableColumn prop="competitorPrice" label="竞品价格" width="110" align="right">
          <template #default="{ row }">¥{{ row.competitorPrice?.toFixed(2) }}</template>
        </ElTableColumn>
        <ElTableColumn label="利润率" width="100" align="right">
          <template #default="{ row }">
            {{ calculateProfitMargin(row.suggestedPrice, row.totalCost) }}
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
.pricing-entry-page {
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

.cost-section {
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

.cost-section h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #409eff;
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
