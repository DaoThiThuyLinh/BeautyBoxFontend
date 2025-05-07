import AdminRouter from './admin/router'
import BlogsRouter from './blogs/router'
import HomeRouter from './home/router'
import OrderRouter from './order/router'
import ProductRouter from './product/router'
import ProfileRouter from './profile/router'

const LIST_ROUTER = [HomeRouter, AdminRouter, BlogsRouter, ProductRouter, OrderRouter, ProfileRouter]

export default LIST_ROUTER
