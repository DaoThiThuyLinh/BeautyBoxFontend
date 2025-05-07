import request from '@/plugin/request'

import type { IAddress } from '@/types/profile.types'
import type { IResponse } from '@/types/responese.types'

export default class ProfileService {
  async addAddress(body: Record<string, any>): Promise<IResponse<object>> {
    try {
      const rs = await request.post(`/address`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getAddress(): Promise<IResponse<IAddress[]>> {
    try {
      const rs = await request.get(`/address`)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async deleteAddress(id: string): Promise<IResponse<object>> {
    try {
      const rs = await request.delete(`/address/${id}`)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async setDefaultAddress(id: string): Promise<IResponse<object>> {
    try {
      const rs = await request.put(`/address/change-default/${id}`)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
