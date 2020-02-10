import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Maintenance from '../views/Maintenance.vue';
import Lodging from '../views/Lodging.vue';
import Room from '../views/Room.vue';
import Company from '../views/Company.vue';
import Report from '../views/Report.vue';
import Login from '../views/Login';
import Register from '../views/Register';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'hospedaje',
		component: Lodging,
	},
	{
		path: '/home',
		name: 'home',
		component: Home,
	},
	{
		path: '/mantenimiento',
		name: 'mantenimiento',
		component: Maintenance,
	},
	{
		path: '/habitaciones',
		name: 'habitaciones',
		component: Room,
	},
	{
		path: '/compañias',
		name: 'compañias',
		component: Company,
	},
	{
		path: '/informe',
		name: 'informe',
		component: Report,
	},
	{
		path: '/login',
		name: 'login',
		component: Login,
	},
	{
		path: '/register',
		name: 'register',
		component: Register,
	},
];

const router = new VueRouter({
	routes,
});

export default router;
