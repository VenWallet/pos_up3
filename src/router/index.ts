import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/historial',
      name: 'historial',
      component: () => import('../views/HistorialView.vue'),
    },
    {
      path: '/pay',
      name: 'pay',
      component: () => import('../views/PayView.vue'),
    },
  ],
})

export default router
