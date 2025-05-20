import type { PurchaseOrderEntity } from '~/types/purchase-order'
import axios from 'axios'

// 建立 axios 實例
const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.104:3010/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// API 回應的通用型別
interface ApiResponse<T> {
  Code: number
  ExecutionTime: string
  Message: string
  Data: T
}

// 獲取採購訂單列表的參數型別
interface GetPurchaseOrdersParams {
  keyword?: string
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  page?: number
  pageSize?: number
}

// 獲取採購訂單列表的回應型別
interface GetPurchaseOrdersResponse {
  data: PurchaseOrderEntity[]
  total: number
}

// 生成隨機採購訂單的參數型別
interface GenerateRandomPurchaseOrdersParams {
  count?: number
}

/**
 * 獲取採購訂單列表
 * @param params 查詢參數
 * @returns 採購訂單列表和總數
 */
export async function getPurchaseOrders(params: GetPurchaseOrdersParams = {}) {
  try {
    const response = await axiosInstance.get<ApiResponse<GetPurchaseOrdersResponse>>('/purchase-orders', {
      params: {
        keyword: params.keyword,
        sortBy: params.sortBy || 'expectedDeliveryDate',
        sortOrder: params.sortOrder || 'ASC',
        page: params.page || 1,
        pageSize: params.pageSize || 10,
      },
    })
    return response.data
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 400:
          console.error('請求參數錯誤：', error.response.data.Message)
          break
        case 401:
          console.error('未授權：', error.response.data.Message)
          break
        case 403:
          console.error('禁止訪問：', error.response.data.Message)
          break
        case 404:
          console.error('資源不存在：', error.response.data.Message)
          break
        case 500:
          console.error('伺服器內部錯誤：', error.response.data.Message)
          break
        default:
          console.error('未知錯誤：', error.message)
      }
    }
    throw error
  }
}

/**
 * 生成隨機採購訂單
 * @param params 生成參數
 * @returns 生成的採購訂單列表
 */
export async function generateRandomPurchaseOrders(params: GenerateRandomPurchaseOrdersParams = {}) {
  try {
    const response = await axiosInstance.post<ApiResponse<PurchaseOrderEntity[]>>(
      '/purchase-orders/generate-random',
      {
        count: params.count || 10,
      },
    )
    return response.data
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 400:
          console.error('請求參數錯誤：', error.response.data.Message)
          break
        case 401:
          console.error('未授權：', error.response.data.Message)
          break
        case 403:
          console.error('禁止訪問：', error.response.data.Message)
          break
        case 404:
          console.error('資源不存在：', error.response.data.Message)
          break
        case 500:
          console.error('伺服器內部錯誤：', error.response.data.Message)
          break
        default:
          console.error('未知錯誤：', error.message)
      }
    }
    throw error
  }
}
