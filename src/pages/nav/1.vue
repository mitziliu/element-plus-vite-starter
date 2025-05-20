<script lang="ts" setup>
import { ref } from 'vue'

interface OrderItem {
  orderNo: string
  supplier: string
  materialNo: string
  quantity: number
  deliveryDate: string
  status: '待核准' | '已核准' | '生產中' | '運輸中' | '延遲' | '已完成'
  remark: string
}

const orderList = ref<OrderItem[]>([
  {
    orderNo: 'PO-20250305-001',
    supplier: '鼎新電子',
    materialNo: 'IC-001',
    quantity: 1000,
    deliveryDate: '2025-03-25',
    status: '待核准',
    remark: '急件',
  },
  {
    orderNo: 'PO-20250304-015',
    supplier: '宏碁科技',
    materialNo: 'LCD-002',
    quantity: 500,
    deliveryDate: '2025-03-18',
    status: '已核准',
    remark: '',
  },
  {
    orderNo: 'PO-20250301-008',
    supplier: '廣達電腦',
    materialNo: 'PSU-003',
    quantity: 200,
    deliveryDate: '2025-03-12',
    status: '生產中',
    remark: '',
  },
  {
    orderNo: 'PO-20250228-022',
    supplier: '金寶電子',
    materialNo: 'IC-004',
    quantity: 3000,
    deliveryDate: '2025-03-10',
    status: '運輸中',
    remark: '',
  },
  {
    orderNo: 'PO-20250225-019',
    supplier: '仁寶電腦',
    materialNo: 'SSD-005',
    quantity: 800,
    deliveryDate: '2025-03-05',
    status: '延遲',
    remark: '缺料',
  },
  {
    orderNo: 'PO-20250220-012',
    supplier: '鼎新電子',
    materialNo: 'IC-006',
    quantity: 1500,
    deliveryDate: '2025-03-01',
    status: '已完成',
    remark: '',
  },
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(368)

function getStatusType(status: OrderItem['status']) {
  const statusMap: Record<OrderItem['status'], string> = {
    待核准: 'warning',
    已核准: 'info',
    生產中: 'primary',
    運輸中: 'success',
    延遲: 'danger',
    已完成: 'success',
  }
  return statusMap[status]
}
</script>

<template>
  <div class="p-6">
    <el-table :data="orderList" style="width: 100%" class="order-table">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="orderNo" label="採購單號" min-width="120">
        <template #default="{ row }">
          <span class="text-blue-600 font-medium">{{ row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="supplier" label="供應商名稱" min-width="120" />
      <el-table-column prop="materialNo" label="料號" min-width="120" />
      <el-table-column prop="quantity" label="數量" min-width="100" />
      <el-table-column prop="deliveryDate" label="預計交期" min-width="120" />
      <el-table-column prop="status" label="狀態" min-width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" size="small">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="備註" min-width="150" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small">
            查看
          </el-button>
          <el-button v-if="row.status === '待核准'" link type="success" size="small">
            核准
          </el-button>
          <el-button v-if="row.status === '待核准'" link type="danger" size="small">
            拒絕
          </el-button>
          <el-button v-if="row.status === '已核准'" link type="warning" size="small">
            追蹤
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        顯示 <span class="font-medium">1</span> 到 <span class="font-medium">{{ orderList.length }}</span> 共 <span
          class="font-medium"
        >368</span> 條結果
      </div>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next"
      />
    </div>
  </div>
</template>

<style scoped>
.order-table {
  --el-table-border-color: #e5e7eb;
  --el-table-header-bg-color: #f9fafb;
}

.order-table :deep(.el-table__header) {
  background-color: var(--el-table-header-bg-color);
}

.order-table :deep(.el-table__header th) {
  background-color: var(--el-table-header-bg-color);
  color: #374151;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.order-table :deep(.el-table__row:hover) {
  background-color: #f9fafb;
}

.order-table :deep(.el-table__cell) {
  padding: 1rem 1.5rem;
}
</style>
