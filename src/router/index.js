import Vue from 'vue';
import VueRouter from 'vue-router';
import Company from '@/views/Company.vue';
import Home from '@/views/Home.vue';
import Lodging from '@/views/Lodging.vue';
import Login from '@/views/Login';
import Maintenance from '@/views/Maintenance.vue';
import PasswordReset from '@/views/PasswordReset';
import Payments from '@/views/Payments';
import Register from '@/views/Register';
import Report from '@/views/Report.vue';
import Room from '@/views/Room.vue';
import Profile from '@/views/Profile';
Vue.use(VueRouter);

const routes = [
	{
		path: '/lodgings',
		name: 'lodgings',
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
		path: '/rooms/:company',
		name: 'rooms',
		component: Room,
	},
	{
		path: '/companies',
		name: 'companies',
		component: Company,
	},
	{
		path: '/reports',
		name: 'reports',
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
	{
		path: '/passwordReset',
		name: 'passwordReset',
		component: PasswordReset,
	},
	{
		path: '/payments/:company',
		name: 'payments',
		component: Payments,
	},
	{
		path: '/profile',
		name: 'profile',
		component: Profile,
	},
];

const router = new VueRouter({
	routes,
});

export default router;
