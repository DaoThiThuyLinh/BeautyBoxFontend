import type { RouteRecordRaw } from 'vue-router'

const TheLayout = () => import('@/components/layout/TheLayout.vue')

const ProductRouter: RouteRecordRaw[] = [
  {
    path: '/product',
    component: TheLayout,
    children: [
      {
        path: ':id',
        component: () => import('../view/ProductDetailView.vue'),
        name: 'ProductDetail'
      }
    ]
  }
]

export default ProductRouter
