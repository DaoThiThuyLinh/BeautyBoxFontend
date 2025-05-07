import type { RouteRecordRaw } from 'vue-router'

const TheLayout = () => import('@/components/layout/TheLayout.vue')

const OrderRouter: RouteRecordRaw[] = [
  {
    path: '/order',
    component: TheLayout,
    children: [
      {
        path: 'product',
        component: () => import('../view/OrderView.vue'),
        name: 'Order',
        meta: {
          auth: true
        }
      }
    ]
  }
]

export default OrderRouter
