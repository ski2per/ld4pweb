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
    path: '/aboutme',
    name: 'aboutme',
    component: About,
    meta: {
      requiresAuth: true
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
      requiresAuth: true
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
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    console.log(`isLoggedIn: ${store.getters.isLoggedIn}`)
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login')
  } else {
    console.log('no auth required')
    next()
  }
})

export default router
