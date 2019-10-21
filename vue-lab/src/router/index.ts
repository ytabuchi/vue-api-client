import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// 1. importに以下を追加します
import Table from '../views/Table.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  // 2. routesに以下を追加します
  {
    path: '/table',
    name: 'table',
    component: Table
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
