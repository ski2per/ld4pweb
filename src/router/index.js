import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'
import Ted from '@/views/Ted'
import MyBtnPage from '@/views/MyBtnPage'
import Login from '@/views/Login'
import Todo from '@/views/SimpleTodo'
import Foo from '@/views/Foo'

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
  {
    path: '/ted',
    name: 'Ted',
    component: Ted,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/btn',
    name: 'btn',
    component: MyBtnPage,
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
    path: '/foo',
    component: Foo
  }
  //{
  //  path: '/about',
  //  name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  //  component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  //}
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
