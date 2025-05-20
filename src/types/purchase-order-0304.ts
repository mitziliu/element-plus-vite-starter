export type PurchaseOrderStatus =
  | 'PENDING' // 待核准
  | 'APPROVED' // 已核准
  | 'IN_PRODUCTION' // 生產中
  | 'IN_TRANSIT' // 運輸中
  | 'DELAYED' // 延遲
  | 'COMPLETED' // 已完成

export interface PurchaseOrder {
  id: string
  orderNumber: string
  supplierName: string
  supplierCode: string
  materialNumber: string
  materialDescription: string
  quantity: number
  unit: string
  expectedDeliveryDate: string
  status: PurchaseOrderStatus
  remarks: string
  createdAt: string
  updatedAt: string
}
