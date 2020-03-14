import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const Home = () => import('@/views/Home.vue');
const Management = () => import('@/views/Management.vue');
const Login = () => import('@/views/Login');
const PasswordReset = () => import('@/views/PasswordReset');
const Register = () => import('@/views/Register');
const Report = () => import('@/views/Report.vue');
const Profile = () => import('@/views/Profile');

const routes = [
	{
		path: '/home',
		name: 'home',
		component: Home,
		alias: '/',
		meta: { title: 'Inicio', layout: 'layout' },
	},
	{
		path: '/management',
		name: 'management',
		component: Management,
		meta: { title: 'Administrar hospedajes', layout: 'layout' },
	},
	{
		path: '/reports',
		name: 'reports',
		component: Report,
		meta: { title: 'Informes', layout: 'layout' },
	},
	{
		path: '/passwordReset',
		name: 'passwordReset',
		component: PasswordReset,
		meta: { title: 'Recuperar contraseña' },
	},
	{
		path: '/profile',
		name: 'profile',
		component: Profile,
		meta: { title: 'Perfil', layout: 'layout' },
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
		path: '*',
		name: '404',
		component: require('@/views/404.vue').default, // load sync
	},
];

const router = new VueRouter({
	routes,
});

export default router;
