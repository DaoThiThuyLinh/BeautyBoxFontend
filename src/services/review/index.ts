import request from '@/plugin/request'

import type { IResponse } from '@/types/responese.types'

export default class ReviewService {
  prefix = 'review'
  async addReview(body: Record<string, any>): Promise<IResponse<object>> {
    try {
      const rs = await request.post(`${this.prefix}`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async replyReview(body: Record<string, any>): Promise<IResponse<object>> {
    try {
      const rs = await request.post(`/admin-api/${this.prefix}/reply`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
