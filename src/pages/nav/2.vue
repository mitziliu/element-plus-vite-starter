<script lang="ts" setup>
import type { TagProps } from 'element-plus'
import { ref } from 'vue'

interface PurchaseOrder {
  id: string
  orderNumber: string
  supplierName: string
  supplierCode: string
  materialNumber: string
  materialDescription: string
  quantity: number
  unit: string
  expectedDeliveryDate: string
  status: 'PENDING' | 'APPROVED' | 'IN_PRODUCTION' | 'IN_TRANSIT' | 'COMPLETED' | 'DELAYED'
  remarks: string
  createdAt: string
  updatedAt: string
}

// 分頁相關
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(2)

// 假資料
const purchaseOrders = ref<PurchaseOrder[]>([
  {
    id: '1',
    orderNumber: 'PO-20250305-001',
    supplierName: '鼎新電子',
    supplierCode: 'S001',
    materialNumber: 'IC001',
    materialDescription: '測試料號 IC001',
    quantity: 100,
    unit: 'PCS',
    expectedDeliveryDate: '2025-03-25',
    status: 'PENDING',
    remarks: '測試資料',
    createdAt: '2025-03-05',
    updatedAt: '2025-03-05',
  },
  {
    id: '2',
    orderNumber: 'PO-20250304-015',
    supplierName: '宏碁科技',
    supplierCode: 'S002',
    materialNumber: 'DIS001',
    materialDescription: '測試料號 DIS001',
    quantity: 50,
    unit: 'SET',
    expectedDeliveryDate: '2025-03-18',
    status: 'APPROVED',
    remarks: '測試資料',
    createdAt: '2025-03-04',
    updatedAt: '2025-03-04',
  },
])

// 格式化日期
function formatDate(date: string) {
  return date.split('T')[0]
}

// 取得狀態類型
function getStatusType(status: PurchaseOrder['status']): TagProps['type'] {
  const statusMap: Record<PurchaseOrder['status'], TagProps['type']> = {
    PENDING: 'warning',
    APPROVED: 'primary',
    IN_PRODUCTION: 'info',
    IN_TRANSIT: 'success',
    COMPLETED: 'success',
    DELAYED: 'danger',
  }
  return statusMap[status]
}

// 取得狀態文字
function getStatusText(status: PurchaseOrder['status']): string {
  const statusMap: Record<PurchaseOrder['status'], string> = {
    PENDING: '待核准',
    APPROVED: '已核准',
    IN_PRODUCTION: '生產中',
    IN_TRANSIT: '運輸中',
    COMPLETED: '已完成',
    DELAYED: '延遲',
  }
  return statusMap[status]
}
</script>

<template>
  <div class="mb-6 overflow-hidden rounded-lg bg-white shadow-sm">
    <div class="overflow-x-auto">
      <el-table :data="purchaseOrders" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="orderNumber" label="訂單編號" min-width="120">
          <template #default="{ row }">
            <span class="text-sm text-blue-600 font-medium">{{ row.orderNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="創建日期" min-width="100">
          <template #default="{ row }">
            <span class="text-sm text-gray-900">{{ formatDate(row.createdAt) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供應商" min-width="120">
          <template #default="{ row }">
            <span class="text-sm text-gray-900">{{ row.supplierName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="materialNumber" label="料號" min-width="120">
          <template #default="{ row }">
            <span class="text-sm text-gray-900">{{ row.materialNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="數量" min-width="100">
          <template #default="{ row }">
            <span class="text-sm text-gray-900">{{ row.quantity }} {{ row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expectedDeliveryDate" label="交貨日期" min-width="120">
          <template #default="{ row }">
            <span class="text-sm text-gray-900">{{ formatDate(row.expectedDeliveryDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="狀態" min-width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small">
              查看
            </el-button>
            <el-button v-if="row.status === 'PENDING'" link type="success" size="small">
              核准
            </el-button>
            <el-button v-if="row.status === 'PENDING'" link type="danger" size="small">
              拒絕
            </el-button>
            <el-button v-if="row.status === 'APPROVED'" link type="warning" size="small">
              追蹤
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex items-center justify-between border-t px-6 py-4">
      <div>
        <p class="text-sm text-gray-700">
          顯示 <span class="font-medium">1</span> 到 <span class="font-medium">{{ purchaseOrders.length }}</span> 共 <span
            class="font-medium"
          >{{ purchaseOrders.length }}</span> 條結果
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 30, 50]"
          layout="prev, pager, next"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-table) {
  --el-table-border-color: #e5e7eb;
  --el-table-header-bg-color: #f9fafb;
}

:deep(.el-table th) {
  background-color: var(--el-table-header-bg-color);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  color: #6b7280;
  letter-spacing: 0.05em;
}

:deep(.el-table td) {
  padding: 1rem 1.5rem;
}

:deep(.el-button--small) {
  font-size: 0.875rem;
  margin-left: 0.5rem;
}

:deep(.el-pagination) {
  margin-top: 0;
}
</style>
