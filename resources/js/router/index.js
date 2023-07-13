import { createRouter, createWebHistory } from 'vue-router'
import store from "../store/index.js";

/* Layouts */
const BaseLayout = () => import('../layouts/BaseLayout.vue' /* webpackChunkName: "resource/js/layouts/baselayout" */)
const AuthenticatedLayout = () => import('../layouts/AuthenticatedLayout.vue' /* webpackChunkName: "resource/js/layouts/AuthenticatedLayout" */)
/* Layouts */

const Login = () => import('../pages/Login.vue' /* webpackChunkName: "resource/js/pages/login" */)
const Register = () => import('../pages/Register.vue' /* webpackChunkName: "resource/js/pages/register" */)
const Dashboard = () => import('../pages/Dashboard.vue' /* webpackChunkName: "resource/js/pages/dashboard" */)
const Logout = () => import('../pages/Logout.vue' /* webpackChunkName: "resource/js/pages/logout" */)


const routes = [
    {
        path: '/',
        component: BaseLayout,
        children: [
            {
                name: 'login',
                path: '',
                component: Login,
                meta: {
                    middleware: 'guest',
                    title: 'Login'
                }
            },
            {
                name: 'register',
                path: '/register',
                component: Register,
                meta: {
                    middleware: 'guest',
                    title: 'Register'
                }
            },
        ]
    },
    {
        path: '/app',
        component: AuthenticatedLayout,
        meta: {
            middleware: 'auth'
        },
        children:[
            {
                name: 'logout',
                path: 'logout',
                component: Logout,
                beforeEnter: async (to, from, next) => {
                    await store.dispatch('auth/logout')
                    next({ name: 'login' })
                }
            },
            {
                name: 'dashboard',
                path: '',
                component: Dashboard,
                meta: {
                    title: 'Dashboard'
                }
            }
        ]
    }
]

let router  = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title}`
    if (to.meta.middleware === 'guest') {
        next()
    } else {
        if (store.state.auth.authenticated) {
            next()
        } else {
            next({ name: 'login' })
        }
    }
})

export default router
