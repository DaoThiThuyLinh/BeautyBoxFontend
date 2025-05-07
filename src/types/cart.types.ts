export interface ICart {
  createdAt: string
  id: string
  isEnabled: boolean
  messageStatus: string
  productDetail: IProductDetail
  productId: string
  quantity: number
  productName: string
}

export interface IProductDetail {
  description: string
  discount: number
  id: string
  image: string
  name: string
  newPrice: number
  price: number
  status: string
  stock: number
  totalSold: number
}

export interface IProductOrder {
  id?: string
  idParnet: string
  idProduct: string
  quantity: number
  price: number
}
