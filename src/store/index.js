import Vue from 'vue'
import Vuex from 'vuex'
// import httpCli from 'httpCli'
import httpCli from '@/assets/js/http'
import users from './users'
import groups from './groups'


// const http = httpCli.create()

//httpCli.interceptors.request.use(function (config) {
//// http.interceptors.request.use(function (config) {
//  // Do something before request is sent
//  const token = localStorage.getItem('token')
//  if(token) {
//    config.headers.common['Authorization'] = `Bearer ${token}`
//    // httpCli.defaults.headers.common['Authorization'] = `Bearer ${token}`
//  }
//  return config;
//}, function (error) {
//  // Do something with request error
//  return Promise.reject(error);
//});

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
  SHOW_INFO(state, info){
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
        this.dispatch('showInfo', {"msg": error_msg, color: 'error'})

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
  createUser({commit}, data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      httpCli.post(`${process.env.VUE_APP_API_URL}/api/v1/users/${data.uid}`, data)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  deleteUser({commit}, uid) {
    return new Promise((resolve, reject) => {
      httpCli.delete(`${process.env.VUE_APP_API_URL}/api/v1/users/${uid}`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  add2Group({commit}, data) {
    return new Promise((resolve, reject) => {
      httpCli.put(`${process.env.VUE_APP_API_URL}/api/v1/groups/${data.pgroup}/${data.group}/${data.uid}`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  deleteGroup({commit}, item) {
    return new Promise((resolve, reject) => {
      httpCli.delete(`${process.env.VUE_APP_API_URL}/api/v1/users/${item.uid}`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  getMenu({commit}) {
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_URL}/api/v1/common/menu`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  showInfo({commit}, info) {
    commit('SHOW_INFO', info)
  }
}

export default new Vuex.Store({
  modules: {
    ldapusers: users,
    ldapgroups: groups,
  },
  state,
  mutations,
  getters,
  actions,
})
