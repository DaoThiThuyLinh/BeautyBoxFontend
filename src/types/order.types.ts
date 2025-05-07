import type { IQuery } from './component.types'

export interface IOrder {
  id: string
  totalAmount: number
  notes: string | null
  paymentType: string
  status: string
  orderCode: string | null
  commune: string
  district: string
  province: string
  detailAddress: string
  recipientName: string
  recipientPhoneNumber: string
  userId: string
  orderTime: string
  orderItemsResponse: IOrderItem[]
  statusOrder?: string
}

export interface IOrderItem {
  id: string
  quantity: number
  productId: string
  productName: string
  description: string
  productDetailId: string
  productDetailName: string
  price: number
  discount: number
  imageUrl: string
  newPrice: number
}

export interface IParamsOrder extends IQuery {
  s: string
  userId?: string
  status: string
}

export interface IOrderResponse {
  content: IOrder[]
  pageIndex: number
  pageSize: number
  totalElements: number
  totalPages: number
  sortBy: {
    property: string
    direction: string
  }
}

export type IOrderTabValue =
  | 'ALL'
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'WAITING_FOR_PAYMENT'
