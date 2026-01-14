// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/services/elojob',
      name: 'elojob',
      component: () => import('@/views/ElojobView.vue'),
    },
    // Rota de callback OAuth (Google/Discord retorna aqui)
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('@/views/AuthCallbackView.vue'),
    },
    // Rotas futuras que exigem autenticação
    // {
    //   path: '/dashboard',
    //   name: 'dashboard',
    //   component: () => import('@/views/DashboardView.vue'),
    //   meta: { requiresAuth: true }, // Exige login
    // },
    // {
    //   path: '/orders',
    //   name: 'orders',
    //   component: () => import('@/views/OrdersView.vue'),
    //   meta: { requiresAuth: true }, // Exige login
    // },
    // {
    //   path: '/orders/:id',
    //   name: 'order-detail',
    //   component: () => import('@/views/OrderDetailView.vue'),
    //   meta: { requiresAuth: true }, // Exige login
    // },
    // // Rotas futuras para booster
    // {
    //   path: '/booster/dashboard',
    //   name: 'booster-dashboard',
    //   component: () => import('@/views/BoosterDashboardView.vue'),
    //   meta: {
    //     requiresAuth: true,
    //     requiresRole: 'booster', // 🔒 Só boosters
    //   },
    // },
    // Rota catch-all: redireciona qualquer URL não encontrada para a home
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Se houver uma posição salva (botão voltar do navegador)
    if (savedPosition) {
      return savedPosition
    }
    // Se houver hash na URL (âncoras tipo #home)
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    // Por padrão, sempre vai para o topo
    return { top: 0, behavior: 'smooth' }
  },
})

// ============================================
// GUARDS DE ROTA
// ============================================
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 1️: Verifica se rota exige autenticação
  if (to.meta.requiresAuth) {
    // Tenta validar token (se tiver)
    const isValid = await authStore.checkAuth()

    if (!isValid) {
      // Não autenticado - salva rota desejada e mostra modal
      console.warn('Route requires authentication')

      // TODO: Abrir modal de login
      // ou redirecionar para página de login
      // localStorage.setItem('redirectAfterLogin', to.fullPath)

      next('/') // Por enquanto volta pra home
      return
    }
  }

  // 2: Verifica se rota exige role específica
  if (to.meta.requiresRole) {
    const requiredRole = to.meta.requiresRole as string

    if (authStore.user?.role !== requiredRole) {
      //  Role incorreta
      console.warn(`Route requires role: ${requiredRole}`)
      next('/') // Volta pra home
      return
    }
  }

  // Tudo ok, permite acesso
  next()
})

export default router
