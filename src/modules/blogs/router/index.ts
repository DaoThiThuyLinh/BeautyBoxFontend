import type { RouteRecordRaw } from 'vue-router'

const TheLayout = () => import('@/components/layout/TheLayout.vue')

const BlogsRouter: RouteRecordRaw[] = [
  {
    path: '/blogs',
    component: TheLayout,
    children: [
      {
        path: '',
        component: () => import('../view/BlogsView.vue'),
        name: 'Blogs'
      }
    ]
  }
]

export default BlogsRouter
