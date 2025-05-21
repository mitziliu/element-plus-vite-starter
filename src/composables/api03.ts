import type { AxiosError } from 'axios'
import axios from 'axios'

// 建立 axios 實例
const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.104:3010/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 共用錯誤處理函式
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    const status = axiosError.response?.status

    switch (status) {
      case 400:
        throw new Error('請求參數錯誤')
      case 401:
        throw new Error('未授權')
      case 403:
        throw new Error('禁止訪問')
      case 404:
        throw new Error('資源不存在')
      case 500:
        throw new Error('伺服器內部錯誤')
      default:
        throw new Error('未知錯誤')
    }
  }
  throw error
}

// 獲取採購訂單列表
interface GetPurchaseOrdersParams {
  keyword?: string
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  page?: number
  pageSize?: number
}

interface GetPurchaseOrdersResponse {
  Code: number
  ExecutionTime: string
  Message: string
  Data: {
    data: Array<{
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
    }>
    total: number
  }
}

export async function getPurchaseOrdersApi(params: GetPurchaseOrdersParams = {}): Promise<GetPurchaseOrdersResponse> {
  try {
    const response = await axiosInstance.get<GetPurchaseOrdersResponse>('/purchase-orders', { params })
    return response.data
  }
  catch (error) {
    return handleApiError(error)
  }
}

// 生成隨機測試資料
interface GenerateRandomPurchaseOrdersParams {
  count?: number
}

interface GenerateRandomPurchaseOrdersResponse {
  Code: number
  ExecutionTime: string
  Message: string
  Data: Array<{
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
  }>
}

export async function generateRandomPurchaseOrdersApi(params: GenerateRandomPurchaseOrdersParams = { count: 10 }): Promise<GenerateRandomPurchaseOrdersResponse> {
  try {
    const response = await axiosInstance.post<GenerateRandomPurchaseOrdersResponse>(
      '/purchase-orders/generate-random',
      params,
    )
    return response.data
  }
  catch (error) {
    return handleApiError(error)
  }
}
