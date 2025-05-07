import request from '@/plugin/request'

import type { IResponse } from '@/types/responese.types'
import type { IWarehouseRes } from '@/types/warehouse.types'

import formatParams from '@/utils/formatParams'

export default class WarehouseService {
  prefix = 'admin-api/warehouse'
  async addWarehouse(body: Record<string, any>): Promise<IResponse<object>> {
    try {
      const rs = await request.post(`${this.prefix}`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getWarehouseList(params: Record<string, any>): Promise<IResponse<IWarehouseRes>> {
    try {
      const rs = await request.get(`${this.prefix}`, { params: formatParams(params) })
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async editWarehouse(body: Record<string, any>): Promise<IResponse<object>> {
    try {
      const rs = await request.put(`${this.prefix}`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
