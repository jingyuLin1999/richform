import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
    {
        path: '/form-design',
        name: 'richform',
        component: () => import('@/pages/richform')
    },
    {
        path: '/',
        name: 'form-design',
        component: () => import('@/pages/form-design')
    }
]

const router = new VueRouter({
    // mode: 'history',
    routes
})

export default router