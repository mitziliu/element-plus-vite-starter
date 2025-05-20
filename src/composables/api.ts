import axios from 'axios'

// API 基礎設定
const BASE_URL = 'http://192.168.1.104:3010'

// 建立 axios 實例
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// API 回應介面
interface ApiResponse<T> {
  Code: number
  ExecutionTime: string
  Message: string
  Data: T
}

// 採購訂單介面
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
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
  remarks: string
  createdAt: string
  updatedAt: string
}

// 分頁回應介面
interface PaginatedResponse {
  data: PurchaseOrder[]
  total: number
}

// 錯誤處理函式
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    switch (status) {
      case 400:
        console.error('請求參數錯誤')
        break
      case 401:
        console.error('未授權')
        break
      case 403:
        console.error('禁止訪問')
        break
      case 404:
        console.error('資源不存在')
        break
      case 500:
        console.error('伺服器內部錯誤')
        break
      default:
        console.error('未知錯誤')
    }
  }
  else {
    console.error('發生未預期的錯誤')
  }
  throw error
}

// 獲取採購訂單列表
export async function getPurchaseOrders(params?: {
  keyword?: string
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  page?: number
  pageSize?: number
}) {
  try {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse>>('/purchase-orders', {
      params,
    })
    return response.data
  }
  catch (error) {
    handleApiError(error)
  }
}

// 生成隨機測試資料
export async function generateRandomPurchaseOrders(count: number = 10) {
  try {
    const response = await axiosInstance.post<ApiResponse<PurchaseOrder[]>>('/purchase-orders/generate-random', {
      count,
    })
    return response.data
  }
  catch (error) {
    handleApiError(error)
  }
}
