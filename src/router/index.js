import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Mantenimiento from '../views/Mantenimiento.vue';
import Estadias from '../views/Estadias.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/mantenimiento',
    name: 'mantenimiento',
    component: Mantenimiento
  },
  {
    path: '/estadias',
    name: 'estadias',
    component: Estadias
  }
]

const router = new VueRouter({
  routes
})

export default router
