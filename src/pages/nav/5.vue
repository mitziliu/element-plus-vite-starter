<script lang="ts" setup>
import type { PurchaseOrder, PurchaseOrderStatus } from '~/types/purchase-order-05'
import { computed, ref } from 'vue'

// 分頁設定
const currentPage = ref(1)
const pageSize = ref(10)

// 假資料
const mockData: PurchaseOrder[] = [
  {
    id: '1',
    orderNumber: 'PO-20250305-001',
    supplierName: '鼎新電子',
    supplierCode: 'S001',
    materialNumber: 'IC001',
    materialDescription: '電子元件',
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
    materialDescription: '顯示設備',
    quantity: 50,
    unit: 'SET',
    expectedDeliveryDate: '2025-03-18',
    status: 'PROCESSING',
    remarks: '測試資料',
    createdAt: '2025-03-04',
    updatedAt: '2025-03-04',
  },
  {
    id: '3',
    orderNumber: 'PO-20250301-008',
    supplierName: '廣達電腦',
    supplierCode: 'S003',
    materialNumber: 'PWR001',
    materialDescription: '電源設備',
    quantity: 200,
    unit: 'PCS',
    expectedDeliveryDate: '2025-03-12',
    status: 'COMPLETED',
    remarks: '測試資料',
    createdAt: '2025-03-01',
    updatedAt: '2025-03-01',
  },
  {
    id: '4',
    orderNumber: 'PO-20250228-022',
    supplierName: '金寶電子',
    supplierCode: 'S004',
    materialNumber: 'IC002',
    materialDescription: '電子元件',
    quantity: 150,
    unit: 'PCS',
    expectedDeliveryDate: '2025-03-10',
    status: 'PROCESSING',
    remarks: '測試資料',
    createdAt: '2025-02-28',
    updatedAt: '2025-02-28',
  },
  {
    id: '5',
    orderNumber: 'PO-20250225-019',
    supplierName: '仁寶電腦',
    supplierCode: 'S005',
    materialNumber: 'STO001',
    materialDescription: '儲存設備',
    quantity: 75,
    unit: 'SET',
    expectedDeliveryDate: '2025-03-05',
    status: 'CANCELLED',
    remarks: '測試資料',
    createdAt: '2025-02-25',
    updatedAt: '2025-02-25',
  },
  {
    id: '6',
    orderNumber: 'PO-20250220-012',
    supplierName: '鼎新電子',
    supplierCode: 'S001',
    materialNumber: 'IC003',
    materialDescription: '電子元件',
    quantity: 300,
    unit: 'PCS',
    expectedDeliveryDate: '2025-03-01',
    status: 'COMPLETED',
    remarks: '測試資料',
    createdAt: '2025-02-20',
    updatedAt: '2025-02-20',
  },
  {
    id: '7',
    orderNumber: 'PO-20250215-007',
    supplierName: '宏碁科技',
    supplierCode: 'S002',
    materialNumber: 'DIS002',
    materialDescription: '顯示設備',
    quantity: 25,
    unit: 'SET',
    expectedDeliveryDate: '2025-02-28',
    status: 'COMPLETED',
    remarks: '測試資料',
    createdAt: '2025-02-15',
    updatedAt: '2025-02-15',
  },
  {
    id: '8',
    orderNumber: 'PO-20250210-033',
    supplierName: '廣達電腦',
    supplierCode: 'S003',
    materialNumber: 'PWR002',
    materialDescription: '電源設備',
    quantity: 180,
    unit: 'PCS',
    expectedDeliveryDate: '2025-02-25',
    status: 'COMPLETED',
    remarks: '測試資料',
    createdAt: '2025-02-10',
    updatedAt: '2025-02-10',
  },
  {
    id: '9',
    orderNumber: 'PO-20250205-026',
    supplierName: '金寶電子',
    supplierCode: 'S004',
    materialNumber: 'IC004',
    materialDescription: '電子元件',
    quantity: 250,
    unit: 'PCS',
    expectedDeliveryDate: '2025-02-20',
    status: 'COMPLETED',
    remarks: '測試資料',
    createdAt: '2025-02-05',
    updatedAt: '2025-02-05',
  },
  {
    id: '10',
    orderNumber: 'PO-20250201-014',
    supplierName: '仁寶電腦',
    supplierCode: 'S005',
    materialNumber: 'STO002',
    materialDescription: '儲存設備',
    quantity: 60,
    unit: 'SET',
    expectedDeliveryDate: '2025-02-15',
    status: 'COMPLETED',
    remarks: '測試資料',
    createdAt: '2025-02-01',
    updatedAt: '2025-02-01',
  },
  {
    id: '11',
    orderNumber: 'PO-20250128-009',
    supplierName: '鼎新電子',
    supplierCode: 'S001',
    materialNumber: 'IC005',
    materialDescription: '電子元件',
    quantity: 400,
    unit: 'PCS',
    expectedDeliveryDate: '2025-02-10',
    status: 'COMPLETED',
    remarks: '測試資料',
    createdAt: '2025-01-28',
    updatedAt: '2025-01-28',
  },
  {
    id: '12',
    orderNumber: 'PO-20250125-017',
    supplierName: '宏碁科技',
    supplierCode: 'S002',
    materialNumber: 'DIS003',
    materialDescription: '顯示設備',
    quantity: 35,
    unit: 'SET',
    expectedDeliveryDate: '2025-02-05',
    status: 'COMPLETED',
    remarks: '測試資料',
    createdAt: '2025-01-25',
    updatedAt: '2025-01-25',
  },
]

// 計算分頁後的資料
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return mockData.slice(start, end)
})

// 狀態相關函數
function getStatusType(status: PurchaseOrderStatus): 'warning' | 'primary' | 'success' | 'danger' {
  const statusMap: Record<PurchaseOrderStatus, 'warning' | 'primary' | 'success' | 'danger'> = {
    PENDING: 'warning',
    PROCESSING: 'primary',
    COMPLETED: 'success',
    CANCELLED: 'danger',
  }
  return statusMap[status]
}

function getStatusText(status: PurchaseOrderStatus) {
  const statusMap: Record<PurchaseOrderStatus, string> = {
    PENDING: '待核准',
    PROCESSING: '處理中',
    COMPLETED: '已完成',
    CANCELLED: '已取消',
  }
  return statusMap[status]
}
</script>

<template>
  <div>
    <el-table
      :data="paginatedData"
      style="width: 100%"
      border
      class="mb-6"
      :default-sort="{ prop: 'expectedDeliveryDate', order: 'descending' }"
    >
      <el-table-column type="index" width="60" label="序號" />
      <el-table-column type="selection" width="55" />
      <el-table-column prop="orderNumber" label="訂單編號" min-width="120">
        <template #default="{ row }">
          <span class="text-blue-600">{{ row.orderNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="創建日期" min-width="100" />
      <el-table-column prop="supplierName" label="供應商" min-width="120" />
      <el-table-column prop="materialDescription" label="產品類別" min-width="120" />
      <el-table-column prop="quantity" label="數量" min-width="100">
        <template #default="{ row }">
          {{ row.quantity }} {{ row.unit }}
        </template>
      </el-table-column>
      <el-table-column prop="expectedDeliveryDate" label="交貨日期" min-width="100" sortable />
      <el-table-column prop="status" label="狀態" min-width="100" sortable>
        <template #default="{ row }">
          <el-tag
            :type="getStatusType(row.status)"
            effect="light"
            size="small"
          >
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            class="mr-2"
          >
            查看
          </el-button>
          <el-button
            v-if="row.status === 'PENDING'"
            link
            type="success"
            size="small"
            class="mr-2"
          >
            核准
          </el-button>
          <el-button
            v-if="row.status === 'PENDING'"
            link
            type="danger"
            size="small"
          >
            拒絕
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex items-center justify-between">
      <span class="text-sm text-gray-700">
        顯示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, mockData.length) }} 共 {{ mockData.length }} 條結果
      </span>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="mockData.length"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next"
      />
    </div>
  </div>
</template>

<style scoped>
.el-table {
  --el-table-border-color: #e5e7eb;
  --el-table-header-bg-color: #f9fafb;
}

.el-table :deep(th) {
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.el-table :deep(td) {
  font-size: 0.875rem;
}

.el-tag {
  border-radius: 9999px;
  padding: 0 0.75rem;
}
</style>
