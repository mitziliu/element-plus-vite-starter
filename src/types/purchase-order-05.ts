export type PurchaseOrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'

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
