import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAppConfig } from '@/stores/app-config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: '关于',
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

router.beforeEach((to, from) => {
  const config = useAppConfig()
  if (!config.isLoggedIn && to.name !== 'login') {
    return { name: 'login' }
  }
  // 返回 false 以取消导航
  return true
})
router.beforeEach(async (to) => {
  // 显示加载条
  window.$loadingbar.start()
})
router.afterEach((to: any, from) => {
  if (to.name === 'not-found') {
    window.$loadingbar.error()
  } else {
    window.$loadingbar.finish()
  }
  const baseTitle = 'Kenko Drive'
  const subTitle: string = to.meta?.title?.trim() || ''
  document.title = subTitle ? `${baseTitle} | ${subTitle}` : baseTitle
})
router.onError((error: any) => {
  window.$loadingbar.error()
  console.log(error)
})
export default router
