<script lang="ts" setup>
import type { TagProps } from 'element-plus'
import type { PurchaseOrderEntity, PurchaseOrderStatus } from '~/types/purchase-order'
import { computed, onMounted, ref } from 'vue'
import { getPurchaseOrders } from '~/composables/api01'

// 分頁相關狀態
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)
const purchaseOrders = ref<PurchaseOrderEntity[]>([])

// 計算當前頁的數據
const paginatedData = computed(() => {
  return purchaseOrders.value
})

// 分頁事件處理
async function handleSizeChange(val: number) {
  pageSize.value = val
  currentPage.value = 1
  await fetchPurchaseOrders()
}

async function handleCurrentChange(val: number) {
  currentPage.value = val
  await fetchPurchaseOrders()
}

// 獲取採購訂單資料
async function fetchPurchaseOrders() {
  loading.value = true
  error.value = null

  try {
    const response = await getPurchaseOrders({
      page: currentPage.value,
      pageSize: pageSize.value,
      sortBy: 'expectedDeliveryDate',
      sortOrder: 'ASC',
    })

    purchaseOrders.value = response.Data.data
    total.value = response.Data.total
  }
  catch (err) {
    error.value = '獲取採購訂單資料失敗'
    console.error('獲取採購訂單資料失敗：', err)
  }
  finally {
    loading.value = false
  }
}

// 狀態相關函數
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
    PENDING: '待處理',
    PROCESSING: '處理中',
    COMPLETED: '已完成',
    CANCELLED: '已取消',
  }
  return statusMap[status]
}

// 在組件掛載時獲取資料
onMounted(() => {
  fetchPurchaseOrders()
})
</script>

<template>
  <div class="mb-6 overflow-hidden rounded-lg bg-white shadow-sm">
    <div class="overflow-x-auto">
      <el-table
        v-loading="loading"
        :data="paginatedData"
        style="width: 100%"
        border
        :default-sort="{ prop: 'expectedDeliveryDate', order: 'ascending' }"
      >
        <el-table-column type="index" width="60" label="序號" />
        <el-table-column type="selection" width="55" />
        <el-table-column prop="orderNumber" label="採購單號" min-width="120">
          <template #default="{ row }">
            <span class="text-sm text-blue-600 font-medium">{{ row.orderNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供應商名稱" min-width="120">
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
            <span class="text-sm text-gray-900">{{ row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="單位" min-width="80">
          <template #default="{ row }">
            <span class="text-sm text-gray-900">{{ row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expectedDeliveryDate" label="預計交期" min-width="120" sortable>
          <template #default="{ row }">
            <span class="text-sm text-gray-900">{{ row.expectedDeliveryDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="狀態" min-width="100">
          <template #default="{ row }">
            <el-tag
              :type="getStatusType(row.status)"
              size="small"
              class="rounded-full px-2 py-1 text-xs font-semibold"
            >
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="備註" min-width="120">
          <template #default="{ row }">
            <span class="text-sm text-gray-900">{{ row.remarks }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" class="mr-2">
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
            <el-button
              v-if="row.status === 'PROCESSING'"
              link
              type="warning"
              size="small"
            >
              追蹤
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
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
