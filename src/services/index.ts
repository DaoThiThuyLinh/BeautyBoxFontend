import AdminService from './admin'
import AuthService from './auth'
import BlogsService from './blogs'
import CartService from './cart'
import HomeService from './home'
import OrderService from './order'
import ParamService from './param'
import ProfileService from './profile'
import ReviewService from './review'
import WarehouseService from './warehouse'

export const apiHome: HomeService = new HomeService()
export const apiAuth: AuthService = new AuthService()
export const apiAdmin: AdminService = new AdminService()
export const apiBlogs: BlogsService = new BlogsService()
export const apiCart: CartService = new CartService()
export const apiParams: ParamService = new ParamService()
export const apiOrder: OrderService = new OrderService()
export const apiProfile: ProfileService = new ProfileService()
export const apiWarehouse: WarehouseService = new WarehouseService()
export const apiReview: ReviewService = new ReviewService()
