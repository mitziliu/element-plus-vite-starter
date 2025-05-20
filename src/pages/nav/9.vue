<script lang="ts" setup>
import type { PurchaseOrder, PurchaseOrderStatus } from '~/types/purchase-order'
import { computed, ref } from 'vue'
import { mockPurchaseOrders } from '~/assets/mocks/mock-purchase-orders'

const purchaseOrders = ref<PurchaseOrder[]>(mockPurchaseOrders)
const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => purchaseOrders.value.length)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return purchaseOrders.value.slice(start, end)
})

function handleSizeChange(val: number) {
  pageSize.value = val
  currentPage.value = 1
}

function handleCurrentChange(val: number) {
  currentPage.value = val
}

function getStatusType(status: PurchaseOrderStatus): 'warning' | 'primary' | 'success' | 'danger' | 'info' {
  const statusMap: Record<PurchaseOrderStatus, 'warning' | 'primary' | 'success' | 'danger' | 'info'> = {
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
    <el-table :data="paginatedData" style="width: 100%" border :default-sort="{ prop: 'expectedDeliveryDate', order: 'ascending' }">
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
      <el-table-column prop="quantity" label="訂單金額" min-width="100">
        <template #default="{ row }">
          ${{ row.quantity.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="expectedDeliveryDate" label="交貨日期" min-width="100" sortable />
      <el-table-column prop="status" label="狀態" min-width="100">
        <template #default="{ row }">
          <el-tag
            :type="getStatusType(row.status)"
            size="small"
            class="rounded-full px-2 py-1"
          >
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="right">
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
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-4 flex items-center justify-between">
      <span class="text-sm text-gray-700">
        顯示 {{ (currentPage - 1) * pageSize + 1 }} 到
        {{ Math.min(currentPage * pageSize, total) }} 共 {{ total }} 條結果
      </span>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
