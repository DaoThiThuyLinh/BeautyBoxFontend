import type { IQuery } from './component.types'

export interface IQueryUsers extends IQuery {
  value: string
  orderBy: string
}

export interface IUserRes {
  pageIndex: number
  pageSize: number
  totalElements: number
  totalPages: number
  sortBy: {
    property: string
    direction: string
  }
  content: IUser[]
}

export interface IUser {
  id: string
  name: string
  email: string
  phone: string
  gender: string
  roleName: string
  totalRevenue: number
  totalOrder: number
  createdAt: string
}
