<script lang="ts" setup>
import type { PurchaseOrder, PurchaseOrderStatus } from '~/types/purchase-order'
import { computed, ref } from 'vue'
import { mockPurchaseOrders } from '~/assets/mocks/mock-purchase-orders'

// 分頁相關狀態
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(mockPurchaseOrders.length)

// 訂單資料
const purchaseOrders = ref<PurchaseOrder[]>(mockPurchaseOrders)

// 分頁後的資料
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return purchaseOrders.value.slice(start, end)
})

// 分頁事件處理
function handleSizeChange(val: number) {
  pageSize.value = val
  currentPage.value = 1
}

function handleCurrentChange(val: number) {
  currentPage.value = val
}

// 狀態相關輔助函數
function getStatusType(status: PurchaseOrderStatus): 'warning' | 'primary' | 'success' | 'danger' {
  const statusMap: Record<PurchaseOrderStatus, 'warning' | 'primary' | 'success' | 'danger'> = {
    PENDING: 'warning',
    PROCESSING: 'primary',
    COMPLETED: 'success',
    CANCELLED: 'danger',
  }
  return statusMap[status]
}

function getStatusText(status: PurchaseOrderStatus): string {
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
  <div class="mb-6 overflow-hidden rounded-lg bg-white shadow-sm">
    <el-table
      :data="paginatedData"
      style="width: 100%"
      :default-sort="{ prop: 'expectedDeliveryDate', order: 'ascending' }"
    >
      <el-table-column type="index" width="50" />
      <el-table-column type="selection" width="55" />
      <el-table-column prop="orderNumber" label="訂單編號" min-width="120">
        <template #default="{ row }">
          <span class="text-blue-600">{{ row.orderNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="創建日期" min-width="100">
        <template #default="{ row }">
          {{ new Date(row.createdAt).toLocaleDateString() }}
        </template>
      </el-table-column>
      <el-table-column prop="supplierName" label="供應商" min-width="120" />
      <el-table-column prop="materialDescription" label="產品類別" min-width="120" />
      <el-table-column prop="amount" label="訂單金額" min-width="120">
        <template #default="{ row }">
          ¥{{ row.amount.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column
        prop="expectedDeliveryDate"
        label="交貨日期"
        min-width="100"
        sortable
      />
      <el-table-column prop="status" label="狀態" min-width="100">
        <template #default="{ row }">
          <el-tag
            :type="getStatusType(row.status)"
            effect="light"
            size="small"
            class="rounded-full"
          >
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150" align="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small">
            查看
          </el-button>
          <el-button
            v-if="row.status === 'PENDING'"
            link
            type="success"
            size="small"
            class="ml-2"
          >
            核准
          </el-button>
          <el-button
            v-if="row.status === 'PENDING'"
            link
            type="danger"
            size="small"
            class="ml-2"
          >
            拒絕
          </el-button>
          <el-button
            v-if="row.status === 'PROCESSING'"
            link
            type="warning"
            size="small"
            class="ml-2"
          >
            追蹤
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex items-center justify-between border-t px-6 py-4">
      <div>
        <span class="text-sm text-gray-700">
          顯示 <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> 到
          <span class="font-medium">{{ Math.min(currentPage * pageSize, total) }}</span> 共
          <span class="font-medium">{{ total }}</span> 條結果
        </span>
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
