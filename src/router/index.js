import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Mantenimiento from '../views/Mantenimiento.vue';
import Hosts from '../views/Hosts.vue';

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
    path: '/hospedaje',
    name: 'hospedaje',
    component: Hosts
  }
]

const router = new VueRouter({
  routes
})

export default router
