import requestSub from '@/plugin/requestSub'
import axios from 'axios'

import type { RsBlog } from '@/types/home.types'

export default class HomeService {
  prefix = 'client/blogs'

  async getBlogNews(): Promise<RsBlog> {
    try {
      const rs = await requestSub.get(
        `${this.prefix}?s=%7B"%24and"%3A%5B%7B"%24or"%3A%5B%7B"categoryIds"%3A%7B"%24contL"%3A"1000557069"%7D%7D%2C%7B"status"%3A%7B"%24eq"%3A"active"%7D%7D%5D%7D%5D%7D&sort=createdAt%2CDESC&limit=3`
      )
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getBlogReviews(): Promise<RsBlog> {
    try {
      const rs = await requestSub.get(
        `${this.prefix}?s=%7B%22%24and%22%3A%5B%7B%22%24or%22%3A%5B%7B%22categoryIds%22%3A%7B%22%24contL%22%3A%221000560570%22%7D%7D%2C%7B%22status%22%3A%7B%22%24eq%22%3A%22active%22%7D%7D%5D%7D%5D%7D&sort=createdAt%2CDESC&limit=3`
      )
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getBlogSkins(): Promise<RsBlog> {
    try {
      const rs = await requestSub.get(
        `${this.prefix}?s=%7B%22%24and%22%3A%5B%7B%22%24or%22%3A%5B%7B%22categoryIds%22%3A%7B%22%24contL%22%3A%221000560569%22%7D%7D%2C%7B%22status%22%3A%7B%22%24eq%22%3A%22active%22%7D%7D%5D%7D%5D%7D&sort=createdAt%2CDESC&limit=3`
      )
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getBlogEvents(): Promise<RsBlog> {
    try {
      const rs = await requestSub.get(
        `${this.prefix}?s=%7B%22%24and%22%3A%5B%7B%22%24or%22%3A%5B%7B%22categoryIds%22%3A%7B%22%24contL%22%3A%221000641891%22%7D%7D%2C%7B%22status%22%3A%7B%22%24eq%22%3A%22active%22%7D%7D%5D%7D%5D%7D&sort=createdAt%2CDESC&limit=3`
      )
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getBlogHealth(): Promise<RsBlog> {
    try {
      const rs = await requestSub.get(
        `${this.prefix}?s=%7B%22%24and%22%3A%5B%7B%22%24or%22%3A%5B%7B%22categoryIds%22%3A%7B%22%24contL%22%3A%221000560572%22%7D%7D%2C%7B%22status%22%3A%7B%22%24eq%22%3A%22active%22%7D%7D%5D%7D%5D%7D&sort=createdAt%2CDESC&limit=3`
      )
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getBeautyBox(): Promise<any> {
    try {
      const rs = await axios.get('https://souvenir-shop-server.onrender.com/api/v1/products/beautybox')
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
