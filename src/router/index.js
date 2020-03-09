import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const Home = () => import('@/views/Home.vue');
const Login = () => import('@/views/Login');
const Maintenance = () => import('@/views/Maintenance.vue');
const PasswordReset = () => import('@/views/PasswordReset');
const Payments = () => import('@/views/Payments');
const Register = () => import('@/views/Register');
const Report = () => import('@/views/Report.vue');
const Periods = () => import('@/views/Periods.vue');
const Profile = () => import('@/views/Profile');
const Management = () => import('@/views/Management');

const routes = [
	{
		path: '/management',
		name: 'management',
		component: Management,
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
		path: '/periods/:placeId',
		name: 'periods',
		component: Periods,
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
		path: '/payments/:place',
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
