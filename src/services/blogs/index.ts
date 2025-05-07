import requestSub from '@/plugin/requestSub'

import type { RsBlog } from '@/types/home.types'

export default class BlogsService {
  prefix = 'client'
  async getBlogs(params: Record<string, any>): Promise<RsBlog> {
    try {
      const rs = await requestSub.get(`${this.prefix}/blogs`, { params })
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getBlogDetail(params: Record<string, any>): Promise<RsBlog> {
    try {
      const rs = await requestSub.get(
        `https://beautybox.com.vn/_next/data/6Nmq5kijS7Th1j3BUnUMH/vi/blogs/${params.id}/${params.slug}.json`,
        { params }
      )
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
