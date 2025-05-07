import request from '@/plugin/request'

import type { ICart } from '@/types/cart.types'
import type { IResponse } from '@/types/responese.types'

export default class CartService {
  async addToCart(body: Record<string, any>): Promise<IResponse<object>> {
    try {
      const rs = await request.post(`/cart`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getCart(): Promise<IResponse<ICart[]>> {
    try {
      const rs = await request.get(`/cart`)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async removeCart(id: string): Promise<IResponse<object>> {
    try {
      const rs = await request.delete(`/cart/${id}`)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async deleteCart(id: string): Promise<IResponse<object>> {
    try {
      const rs = await request.delete(`/cart/${id}`)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
