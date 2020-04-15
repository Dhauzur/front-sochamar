import Vue from 'vue';
import VueRouter from 'vue-router';
import { isAuthenticated, setToken } from '@/service/auth';
Vue.use(VueRouter);

const Home = () => import('@/views/Home.vue');
const Management = () => import('@/views/Management.vue');
const Auth = () => import('@/views/Auth');
const PasswordReset = () => import('@/views/PasswordReset');
const Report = () => import('@/views/Report.vue');
const Profile = () => import('@/views/Profile');

const routes = [
	{
		path: '/home',
		name: 'home',
		component: Home,
		alias: '/',
		meta: { title: 'Inicio', layout: 'layout' },
		beforeEnter: (to, from, next) => {
			if (!isAuthenticated()) {
				let oauthJWT = to.query.token;
				if (oauthJWT) {
					router.replace({ query: null });
					setToken(oauthJWT);
				}
			}
			next();
		},
	},
	{
		path: '/management',
		name: 'management',
		component: Management,
		meta: { title: 'Administración', layout: 'layout' },
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
		path: '/auth',
		name: 'auth',
		component: Auth,
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

router.beforeEach((to, from, next) => {
	if (to.name === 'home') {
		next();
	} else if (to.name !== 'auth' && !isAuthenticated()) {
		next({ name: 'auth' });
	} else {
		next();
	}
});

export default router;
