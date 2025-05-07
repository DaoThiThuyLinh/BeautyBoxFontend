export interface IWarehouseReq {
  entryDate: string
  entryPrice: string
  entryPhoneNumber: string
  entryPlace: string
  entryQuantity: string
  productDetailId: string
}

export interface IWarehouseRes {
  content: IWarehouse[]
  sortBy: {
    direction: string
    property: string
  }
  pageIndex: number
  pageSize: number
  totalElements: number
  totalPages: number
}

export interface IWarehouse {
  entryDate: string
  entryPhoneNumber: string
  entryPlace: string
  entryPrice: number | string
  entryQuantity: number | string
  id: string
}
