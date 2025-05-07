import type { RouteRecordRaw } from 'vue-router'

const TheLayout = () => import('@/components/layout/admin/TheLayout.vue')

const AdminRouter: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: TheLayout,
    children: [
      {
        path: '',
        component: () => import('@/modules/admin/view/AdminView.vue'),
        name: 'Admin',
        meta: {
          auth: true
        }
      },
      {
        path: 'dashboard',
        component: () => import('@/modules/admin/view/DashBoardView.vue'),
        name: 'Dashboards',
        meta: {
          auth: true,
          title: 'Thống kê'
        }
      },
      {
        path: 'products',
        component: () => import('@/modules/admin/view/ProductsView.vue'),
        name: 'Products',
        meta: {
          auth: true,
          title: 'Sản phẩm'
        }
      },
      {
        path: 'orders',
        component: () => import('@/modules/admin/view/OrderView.vue'),
        name: 'Orders',
        meta: {
          auth: true,
          title: 'Đơn hàng'
        }
      },
      {
        path: 'warehouse',
        children: [
          {
            path: '',
            component: () => import('@/modules/admin/view/WarehouseView.vue'),
            name: 'Warehouse',
            meta: { auth: true, title: 'Kho hàng' }
          },
          {
            path: ':productId',
            component: () => import('@/modules/admin/components/WarehouseProductDetail.vue'),
            name: 'WarehouseProductDetail',
            meta: { auth: true, title: 'Quản lý sản phẩm kho' }
          },
          {
            path: ':productId/:productDetailId',
            component: () => import('@/modules/admin/components/WarehouseProductView.vue'),
            name: 'WarehouseProduct',
            meta: { auth: true, title: 'Nhập hàng' }
          }
        ]
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            component: () => import('@/modules/admin/view/UserView.vue'),
            name: 'Users',
            meta: {
              auth: true,
              title: 'Người dùng'
            }
          },
          {
            path: ':userId',
            component: () => import('@/modules/admin/components/OrderByUser.vue'),
            name: 'OrderByUser',
            meta: {
              auth: true,
              title: 'Đơn hàng của người dùng'
            }
          }
        ]
      }
    ]
  }
]

export default AdminRouter
