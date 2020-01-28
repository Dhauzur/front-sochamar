import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Maintenance from '../views/Maintenance.vue';
import Lodging from '../views/Lodging.vue';
import Group from '../views/Group.vue';
import Entity from '../views/Entity.vue';
import Report from '../views/Report.vue';

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
  },
  {
    path: '/grupos',
    name: 'grupos',
    component: Group
  },
  {
    path: '/entidades',
    name: 'entidades',
    component: Entity
  },
  {
    path: '/informe',
    name: 'informe',
    component: Report
  }
]

const router = new VueRouter({
  routes
})

export default router
