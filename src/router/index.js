import Vue from 'vue'
import VueRouter from 'vue-router'
import About from '../views/AboutMe.vue'
import User from '../views/User.vue'
import Group from '../views/Group.vue'
import store from '../store'
import Login from '@/views/Login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    redirect: '/user',
    requiresAuth: true,
    requiresAdmin: true,
  },
  {
    path: '/aboutme',
    name: 'aboutme',
    component: About,
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    }
  },
  //{
  //  path: '/user',
  //  name: 'user',
  //  component: User,
  //  meta: {
  //    requiresAuth: true
  //  }
  //},
  {
    path: '/group',
    name: 'group',
    component: Group,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    }
  },
  {
    path: '/user',
    name: 'user',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "user" */ '../views/User.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  console.log('[router]')
  console.log(to.fullPath)
  console.log(localStorage)
  console.log(`isLoggedIn: ${store.getters.isLoggedIn}`)
  console.log(`whoami: ${store.getters.whoAmI}`)
  // 'to.matched' is a list
  // some() method tests whether at least one element pass the test of
  // 'record => record.meta.requriesAuth' function
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if(!store.getters.isLoggedIn) {
      next('/login')
    } else {
      // Check page permission
      // console.log(to)
      // console.log(`Current route: ${to.fullPath}`)
      // console.log(`Current route requires admin: ${to.meta.requiresAdmin}`)
      if(to.meta.requiresAdmin) {
        if(!store.getters.isAdmin) {
          next('/aboutme')
        } else {
          next()
        }
      } else {
        next()
      }
    }
  } else {
    // Route no auth required goes here
    console.log('no auth required')
    next()
  }
})

export default router
