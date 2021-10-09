import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const constRouter = [
    {
        path: '/form-design',
        name: 'richform',
        component: () => import('@/pages/richform')
    },
    {
        path: '/',
        name: 'form-design',
        component: () => import('@/pages/form-design')
    },
    {
        path: '/deep-values',
        name: 'deep-values',
        component: () => import('@/pages/deep-values')
    }
]

const router = new Router({
    // mode: 'history',
    routes: constRouter
})

export default router