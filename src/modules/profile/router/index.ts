import type { RouteRecordRaw } from 'vue-router'

const TheLayout = () => import('@/components/layout/TheLayout.vue')

const ProfileRouter: RouteRecordRaw[] = [
  {
    path: '/profile',
    component: TheLayout,
    children: [
      {
        path: ':userId',
        component: () => import('../view/ProfileView.vue'),
        name: 'Profile',
        meta: {
          auth: true
        }
      }
    ]
  }
]

export default ProfileRouter
