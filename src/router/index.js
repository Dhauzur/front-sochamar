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
import PasswordReset from '../views/PasswordReset';
import Profile from '../views/Profile';

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
		path: '/rooms',
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
		path: '/profile',
		name: 'profile',
		component: Profile,
	},
];

const router = new VueRouter({
	routes,
});

export default router;
