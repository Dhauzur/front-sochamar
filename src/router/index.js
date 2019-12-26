import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Maintenance from '../views/Maintenance.vue';
import Lodging from '../views/Lodging.vue';

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
    component: Maintenance
  },
  {
    path: '/hospedaje',
    name: 'hospedaje',
    component: Lodging
  }
]

const router = new VueRouter({
  routes
})

export default router
