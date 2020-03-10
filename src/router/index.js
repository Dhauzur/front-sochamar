import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const Place = () => import('@/views/Place.vue');
const Home = () => import('@/views/Home.vue');
const Lodgings = () => import('@/components/lodgings/Lodging.vue');
const Management = () => import('@/views/Management.vue');
const Login = () => import('@/views/Login');
const Maintenance = () => import('@/views/Maintenance.vue');
const PasswordReset = () => import('@/views/PasswordReset');
const Payments = () => import('@/views/Payments');
const Register = () => import('@/views/Register');
const Report = () => import('@/views/Report.vue');
const Periods = () => import('@/views/Periods.vue');
const Profile = () => import('@/views/Profile');
const Persons = () => import('@/views/Persons');

const routes = [
	{
		path: '/home',
		name: 'home',
		component: Home,
		alias: '/',
		meta: { title: 'Inicio', layout: 'layout' },
	},
	{
		path: '/mantenimiento',
		name: 'mantenimiento',
		component: Maintenance,
		meta: { title: 'Mantenimiento', layout: 'layout' },
	},
	{
		path: '/reports',
		name: 'reports',
		component: Report,
		meta: { title: 'Informes', layout: 'layout' },
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
		meta: { title: 'Recuperar contraseña' },
	},
	{
		path: '/profile',
		name: 'profile',
		component: Profile,
		meta: { title: 'Perfil', layout: 'layout' },
	},
	{
		path: '/management',
		component: Management,
		children: [
			{
				path: 'lodgings',
				name: 'lodgings',
				component: Lodgings,
				meta: { title: 'Administrar', subtitle: 'Hospedajes', layout: 'layout' },
			},
			{
				path: 'places',
				name: 'places',
				component: Place,
				meta: { title: 'Administrar', subtitle: 'Lugares', layout: 'layout' },
			},
			{
				path: 'periods/:placeId',
				name: 'periods',
				component: Periods,
				meta: { title: 'Administrar', subtitle: 'Turnos' },
			},
			{
				path: 'payments/:place',
				name: 'payments',
				component: Payments,
				meta: { title: 'Administrar', subtitle: 'Pagos', layout: 'layout' },
			},
			{
				path: 'persons',
				name: 'persons',
				component: Persons,
				meta: { title: 'Administrar', subtitle: 'Personas', layout: 'layout' },
			},
		],
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
