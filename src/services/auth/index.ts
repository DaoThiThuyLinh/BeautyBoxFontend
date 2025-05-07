import request from '@/plugin/request'

import type { IBodyLogin, IBodyRegister, IUser, IUserLogined } from '@/types/auth.types'
import type { IResponse } from '@/types/responese.types'

import formatParams from '@/utils/formatParams'

export default class AuthService {
  prefix = 'public-api'

  async register(body: IBodyRegister): Promise<IResponse<object>> {
    try {
      const rs = await request.post(`${this.prefix}/register`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async login(body: IBodyLogin): Promise<IResponse<IUserLogined>> {
    try {
      const rs = await request.post(`${this.prefix}/login`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async logout(): Promise<IResponse<object>> {
    try {
      const rs = await request.post(`/sign-out`)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getUserInfo(): Promise<IResponse<IUser>> {
    try {
      const rs = await request.get(`/user`)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async changePassword(body: { password: string; passwordConfirm: string }): Promise<IResponse<object>> {
    try {
      const rs = await request.post(`/change-password`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getOtp(params: Record<string, any>): Promise<IResponse<object>> {
    try {
      const rs = await request.post(`${this.prefix}/get-otp`, {}, { params: formatParams(params) })
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async verifyOtp(params: Record<string, any>): Promise<IResponse<object>> {
    try {
      const rs = await request.post(`${this.prefix}/verify-otp`, {}, { params: formatParams(params) })
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async forgotPassword(body: Record<string, any>): Promise<IResponse<object>> {
    try {
      const rs = await request.post(`${this.prefix}/change-password`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
