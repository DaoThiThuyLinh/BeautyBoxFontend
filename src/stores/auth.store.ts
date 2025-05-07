import request from '@/plugin/request'
import { apiAuth } from '@/services'
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'

import type { IBodyLogin, IUser } from '@/types/auth.types'

import { useBaseStore } from './base.store'

export const useAuthStore = defineStore('auth', () => {
  const access_token = Cookies.get('access_token') || ''
  const accessToken = ref(access_token)
  const userInfo = ref<IUser>({} as IUser)
  const roleName = ref('')
  const { getCart } = useBaseStore()
  const isAdmin = computed(() => {
    return roleName.value === 'ROLE_ADMIN'
  })

  const isLoggedIn = computed(() => {
    return !!accessToken.value
  })
  const login = async (body: IBodyLogin) => {
    try {
      const { data } = await apiAuth.login(body)
      roleName.value = data.roleName
      accessToken.value = data.tokenContent
      Cookies.set('access_token', accessToken.value, { expires: 3 })
      request.defaults.headers.common['Authorization'] = `Bearer ${accessToken.value}`
      await Promise.all([getCart(), getUserInfo()])
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const logout = async () => {
    try {
      await apiAuth.logout()
      accessToken.value = ''
      Cookies.set('access_token', '')
      request.defaults.headers.common['Authorization'] = ''
      if (window.location.pathname !== '/') {
        location.href = '/'
      }
      ElNotification({
        title: 'Success',
        message: 'Đăng xuất thành công',
        type: 'success'
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const setBearerToken = (token: string) => {
    Cookies.set('access_token', token, { expires: 3 })
    accessToken.value = token
    request.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  const getUserInfo = async () => {
    try {
      const { data } = await apiAuth.getUserInfo()
      roleName.value = data.roleName
      userInfo.value = data
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    accessToken,
    isLoggedIn,
    login,
    logout,
    setBearerToken,
    getUserInfo,
    userInfo,
    isAdmin,
    roleName
  }
})
