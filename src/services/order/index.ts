import request from '@/plugin/request'

import type { IOrderResponse } from '@/types/order.types'
import type { IResponse } from '@/types/responese.types'

import formatParams from '@/utils/formatParams'

export default class OrderService {
  prefix = 'order'
  async createOrder(body: Record<string, any>): Promise<IResponse<object>> {
    try {
      const rs = await request.post(`${this.prefix}`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getOrder(params: Record<string, any>): Promise<IResponse<IOrderResponse>> {
    try {
      const rs = await request.get(`${this.prefix}`, { params: formatParams(params) })
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async updateStatusOrder(body: Record<string, any>): Promise<IResponse<object>> {
    try {
      const rs = await request.put(`/admin-api/${this.prefix}`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async cancelOrder(params: Record<string, any>): Promise<IResponse<object>> {
    try {
      const rs = await request.delete(`${this.prefix}`, { params: formatParams(params) })
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async payAgain(params: { orderId: string }): Promise<IResponse<object>> {
    try {
      const rs = await request.post(`${this.prefix}/pay-again`, {}, { params: formatParams(params) })
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
