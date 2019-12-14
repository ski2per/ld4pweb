import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Group from '../views/Group.vue'
import store from '../store'
import Ted from '@/views/Ted'
import Login from '@/views/Login'
import Todo from '@/views/SimpleTodo'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'home',
    component: Home,
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
    path: '/ted',
    name: 'Ted',
    component: Ted,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/todo',
    name: 'todo',
    component: Todo,
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
    component: () => import(/* webpackChunkName: "user" */ '../views/User.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  console.log('router beforeEach')
  if(to.matched.some(record => record.meta.requiresAuth)) {
    console.log(store.getters.isLoggedIn)
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login')
  } else {
    console.log('no auth requires')
    next()
  }
})

export default router
