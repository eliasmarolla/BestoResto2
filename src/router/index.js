import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Menu from '../views/Menu.vue'
import Pedidos from '../views/Pedidos.vue'

const notFound = {
  template: `
  <div>
    <h2>Error 404 pagina no encontrada</h2>
  </div>
  `
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/menu',
      name: 'menu',
      component: Menu,
    },
    {
      path: '/pedidos',
      name: 'pedidos',
      component: Pedidos,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'error',
      component: notFound,
    }
  ],
})

export default router
