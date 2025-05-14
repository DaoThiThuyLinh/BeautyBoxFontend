import request from '@/plugin/request'

import type { IBrand } from '@/types/brand.types'
import type { ICategory } from '@/types/category.types'
import type { IChart, IValueSummary } from '@/types/dashboard.types'
import type { IDataproduct, IParamsProduct, IProductParent } from '@/types/product.types'
import type { IResponse } from '@/types/responese.types'
import type { IUserRes } from '@/types/user.types'

import formatParams from '@/utils/formatParams'

export default class AdminService {
  prefix = 'admin-api'
  sub_prefix = 'public-api'
  async addCategory(body: { categoryName: string }): Promise<IResponse<null>> {
    try {
      const rs = await request.post(`${this.prefix}/category`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getListCategories(): Promise<IResponse<ICategory[]>> {
    try {
      const rs = await request.get(`${this.sub_prefix}/category`)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async editCategory(body: Record<string, string>): Promise<IResponse<object>> {
    try {
      const rs = await request.put(`${this.prefix}/category`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async deleteCategory(categoryId: string): Promise<IResponse<null>> {
    try {
      const rs = await request.delete(`${this.prefix}/category/${categoryId}`)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async addBranch(body: FormData): Promise<IResponse<object>> {
    try {
      const rs = await request.post(`${this.prefix}/brand`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async editBrand(body: FormData): Promise<IResponse<object>> {
    try {
      const rs = await request.put(`${this.prefix}/brand`, body, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getListBrands(): Promise<IResponse<IBrand[]>> {
    try {
      const rs = await request.get(`${this.sub_prefix}/brand`)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async deleteBrand(brandId: string): Promise<IResponse<null>> {
    try {
      const rs = await request.delete(`${this.prefix}/brand/${brandId}`)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async addProduct(body: FormData): Promise<IResponse<object>> {
    try {
      const rs = await request.post(`${this.prefix}/product`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async editProduct(body: Record<string, string>): Promise<IResponse<object>> {
    try {
      const rs = await request.put(`${this.prefix}/product`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async updateImagesProduct(productId: string, body: FormData): Promise<IResponse<object>> {
    try {
      const rs = await request.post(`${this.prefix}/product/image/${productId}`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getListProducts(params: IParamsProduct): Promise<IResponse<IDataproduct>> {
    try {
      const rs = await request.get(`${this.sub_prefix}/product/filter`, { params: formatParams(params) })
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async deleteProduct(productId: string): Promise<IResponse<object>> {
    try {
      const rs = await request.delete(`${this.prefix}/product/${productId}`)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async deleteProductImage(productImageId: string): Promise<IResponse<object>> {
    try {
      const rs = await request.delete(`${this.prefix}/product/image/${productImageId}`)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async addProductChildren(body: FormData): Promise<IResponse<string>> {
    try {
      const rs = await request.post(`${this.prefix}/product-detail`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getListProductsChildrenById(productId: string): Promise<IResponse<IProductParent>> {
    try {
      const rs = await request.get(`${this.sub_prefix}/product/${productId}`)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async editProductChildren(body: Record<string, string>): Promise<IResponse<object>> {
    try {
      const rs = await request.put(`${this.prefix}/product-detail`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async deleteProductChildren(productDetailId: string): Promise<IResponse<null>> {
    try {
      const rs = await request.delete(`${this.prefix}/product-detail/${productDetailId}`)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async suggestSearch(keyword: string): Promise<string[]> {
    try {
      const rs = await request.get(`${this.sub_prefix}/product/suggest`, { params: { value: keyword } })
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getListUsers(params: Record<string, string>): Promise<IResponse<IUserRes>> {
    try {
      const rs = await request.get(`${this.prefix}/user`, { params: formatParams(params) })
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getSummariesDashbord(): Promise<IResponse<IValueSummary>> {
    try {
      const rs = await request.get(`${this.prefix}/summary`)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getChartRevenueData(params: Record<string, string>): Promise<IResponse<IChart[]>> {
    try {
      const rs = await request.get(`${this.prefix}/revenue-by-time`, { params: formatParams(params) })
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getDataChartOrder(params: Record<string, string>): Promise<IResponse<IChart[]>> {
    try {
      const rs = await request.get(`${this.prefix}/order-by-time`, { params: formatParams(params) })
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getDataChartProfit(params: Record<string, string>): Promise<IResponse<IChart[]>> {
    try {
      const rs = await request.get(`${this.prefix}/profit-by-time`, { params: formatParams(params) })
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
