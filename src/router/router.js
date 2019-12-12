import Vue from 'vue'
import Router from 'vue-router'
import store from '@/vuex/store'
import Index from '@/views/IndexPage'
import Ted from '@/views/Ted'
import MyBtnPage from '@/views/MyBtnPage'
import Login from '@/views/Login'
import Todo from '@/views/SimpleTodo'


Vue.use(Router)


const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
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
    }
  ]
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
