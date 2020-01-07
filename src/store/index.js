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
  notificationText: '',
  notificationColor: '',
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
  AUTH_ERROR(state) {
    state.status = 'error'
  },
  LOGOUT(state) {
    state.status = ''
    state.token = ''
    state.admin = false
  },
  NOTIFY(state, data){
    // data = {
    //   msg: "yo, check it out",
    //   color: "success"
    // }
    state.notificationText = data.msg
    state.notificationColor = data.color 
  }
}

const getters = {
  isLoggedIn: state => !!state.token,
  isAdmin: state => state.admin,
  whoAmI: state => state.currentUser,
  authStatus: state => state.status,
  showNoti: state => !!state.notificationText,
  getNotiText: state => state.notificationText,
  getNotiColor: state => state.notificationColor,
}

const actions = {
  login({commit}, userdata){
    return new Promise((resolve, reject) => {
      commit('AUTH_REQUEST')
      httpCli.post(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/auth/login`, userdata)
      .then(response => {
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
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('admin')
      delete httpCli.defaults.headers.common['Authorization']
      this.dispatch('usr/resetState')
      this.dispatch('grp/resetState')
      this.dispatch('mlst/resetState')
      resolve()
    })
  },
  getMenu({commit}) {
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/common/menu`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  notify({commit}, data) {
    commit('NOTIFY', data)
  },
}

export default new Vuex.Store({
  modules: {
    usr: users,
    grp: groups,
    mlst: maillists,
  },
  state,
  mutations,
  getters,
  actions,
})
