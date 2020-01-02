import Vue from 'vue'
import Vuex from 'vuex'
// import httpCli from 'httpCli'
import httpCli from '@/assets/js/http'
import users from './users'
import groups from './groups'
import maillists from './maillists'

Vue.use(Vuex)

const state = {
  status: '',
  token: localStorage.getItem('token') || '',
  currentUser: localStorage.getItem('user') || '',
  admin: localStorage.getItem('admin') || false,
  info: '',
  infoColor: '',
}

const mutations = {
  AUTH_REQUEST(state){
    state.status = 'loading'
  },
  AUTH_SUCCESS(state, authData){
    state.status = 'success'
    state.token = authData.token
    state.currentUser = authData.user
    state.admin = authData.admin
  },
  AUTH_ERROR(state){
    state.status = 'error'
  },
  LOGOUT(state){
    state.status = ''
    state.token = ''
    state.admin = false
  },
  NOTIFY(state, info){
    state.info = info.msg
    state.infoColor = info.color 
  }
}

const getters = {
  isLoggedIn: state => !!state.token,
  isAdmin: state => state.admin,
  whoAmI: state => state.currentUser,
  authStatus: state => state.status,
  isInfo: state => !!state.info,
  getInfo: state => state.info,
  getInfoColor: state => state.infoColor
}

const actions = {
  login({commit}, userdata){
    return new Promise((resolve, reject) => {
      console.log(process.env.VUE_APP_API_URL)
      console.log('[login] localStorage')
      console.log(localStorage)
      commit('AUTH_REQUEST')
      httpCli.post(`${process.env.VUE_APP_API_URL}/api/v1/auth/login`, userdata)
      .then(response => {
        console.log(response.data)
        const token = response.data.access_token
        const user = userdata.get('username')
        const admin = response.data.admin
        localStorage.setItem('token', token)
        localStorage.setItem('user', user)
        localStorage.setItem('admin', admin)
        httpCli.defaults.headers.common['Authorization'] = `Bearer ${token}`

        // Commit 'AUTH_SUCCESS' mutations
        const authData = {
          token: token,
          user: user,
          admin: admin,
        }
        commit('AUTH_SUCCESS', authData)
        resolve(response)
      })
      .catch(error => {
        var error_msg = ""
        if(error.response && error.response.status == 401) {
          error_msg = "用户名或密码错误"
        } else {
          error_msg = "Unknown error"
        }
        this.dispatch('notify', {"msg": error_msg, color: 'error'})

        commit('AUTH_ERROR')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('admin')
        reject(error)
      })
    })
  },
  logout({commit}){
    return new Promise((resolve, reject) => {
      commit('LOGOUT')
      console.log('[logout] localStorage')
      console.log(localStorage)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('admin')
      // delete http.defaults.headers.common['Authorization']
      delete httpCli.defaults.headers.common['Authorization']
      resolve()
    })
  },
  getMenu({commit}) {
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_URL}/api/v1/common/menu`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  notify({commit}, info) {
    commit('NOTIFY', info)
  }
}

export default new Vuex.Store({
  modules: {
    lu: users,
    lg: groups,
    lm: maillists,
  },
  state,
  mutations,
  getters,
  actions,
})
