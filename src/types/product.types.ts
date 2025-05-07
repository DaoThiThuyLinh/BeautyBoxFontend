import type { IQuery } from './component.types'

export interface IDataproduct {
  pageIndex: number
  pageSize: number
  totalElements: number
  totalPages: number
  sortBy: {
    property: string
    direction: string
  }
  content: IProductParent[]
}

export interface IProductParent {
  id: string
  name: string
  description: string
  categoryId: string
  categoryName: string
  brandId: string
  brandName: string
  brandImgUrl: string
  images: IImagesProduct[]
  details: IProductChildren[]
  totalSold: number
  reviewsResponse: IReviewsResponse
}

export interface IReviewsResponse {
  averageRating: number
  totalNumRating: number
  reviews: IReview[]
  details: {
    '1': number
    '2': number
    '3': number
    '4': number
    '5': number
  }
}

export interface IParamsProduct extends IQuery {
  orderBy: string
  value: string
  sortDirection?: 'acs' | 'desc'
  category: string
  brand: string
  minPrice: string | number
  maxPrice: string | number
}

export interface IProductChildren {
  id: string
  name: string
  price: number
  status: string
  discount: number
  stock: number
  image: string
  newPrice: number
  totalSold: number
  description: string
}

export interface IFilterProduct extends IQuery {
  value: string
  category: string
  brand: string
  orderBy: string
}

export interface IImagesProduct {
  id: string
  image: string
}

export interface IReview {
  id: string
  userName: string
  createdDate: string
  rating: number
  comment: string
  replies: IReviewReply[]
}
export interface IReviewReply {
  id: string
  userName: string
  createdDate: string
  comment: string
}
