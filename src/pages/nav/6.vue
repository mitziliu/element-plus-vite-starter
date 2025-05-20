<script lang="ts" setup>
import type { TagProps } from 'element-plus'
import { computed, ref } from 'vue'
import { mockPurchaseOrders, type PurchaseOrderStatus } from '~/types/purchase-order-06'

// 分頁相關
const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => mockPurchaseOrders.length)

// 分頁後的資料
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return mockPurchaseOrders.slice(start, end)
})

// 分頁事件處理
function handleSizeChange(val: number) {
  pageSize.value = val
  currentPage.value = 1
}

function handleCurrentChange(val: number) {
  currentPage.value = val
}

// 狀態相關
function getStatusType(status: PurchaseOrderStatus): TagProps['type'] {
  const statusMap: Record<PurchaseOrderStatus, TagProps['type']> = {
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

// 日期格式化
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
</script>

<template>
  <div class="mb-6 overflow-hidden rounded-lg bg-white shadow-sm">
    <div class="overflow-x-auto">
      <el-table :data="paginatedData" style="width: 100%" border>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="orderNumber" label="訂單編號" min-width="120">
          <template #default="{ row }">
            <span class="text-blue-600">{{ row.orderNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="創建日期" min-width="100">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供應商" min-width="120" />
        <el-table-column prop="materialNumber" label="料號" min-width="100" />
        <el-table-column prop="quantity" label="數量" min-width="100">
          <template #default="{ row }">
            {{ row.quantity }} {{ row.unit }}
          </template>
        </el-table-column>
        <el-table-column prop="expectedDeliveryDate" label="交貨日期" min-width="100" />
        <el-table-column prop="status" label="狀態" min-width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
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
            <el-button v-if="row.status === 'PROCESSING'" link type="primary" size="small">
              追蹤
            </el-button>
            <el-button v-if="row.status === 'PROCESSING'" link type="warning" size="small">
              催促
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex items-center justify-between border-t px-6 py-4">
      <div>
        <p class="text-sm text-gray-700">
          顯示 <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> 到
          <span class="font-medium">{{ Math.min(currentPage * pageSize, total) }}</span> 共
          <span class="font-medium">{{ total }}</span> 條結果
        </p>
      </div>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
