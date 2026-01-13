import { createRouter, createWebHistory } from 'vue-router'
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
    // {
    //   path: '/services/duojob',
    //   name: 'duojob',
    //   component: () => import('@/views/DuojobView.vue'),
    // },
    // {
    //   path: '/services/wins',
    //   name: 'vitorias',
    //   component: () => import('@/views/VitoriasView.vue'),
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

export default router
