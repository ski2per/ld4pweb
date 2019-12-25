import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import user from './user'

// const http = axios.create()

axios.interceptors.request.use(function (config) {
// http.interceptors.request.use(function (config) {
  // Do something before request is sent
  const token = localStorage.getItem('token')
  if(token) {
    config.headers.common['Authorization'] = `Bearer ${token}`
    // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

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
  auth_request(state){
    state.status = 'loading'
  },
  auth_success(state, authData){
    state.status = 'success'
    state.token = authData.token
    state.user = authData.user
    state.admin = authData.admin
  },
  auth_error(state){
    state.status = 'error'
  },
  logout(state){
    state.status = ''
    state.token = ''
    state.admin = false
  },
  show_info(state, info){
    state.info = info.msg
    state.infoColor = info.color 
  }
}

const getters = {
  isLoggedIn: state => !!state.token,
  isAdmin: state => state.admin,
  whoAmI: state => state.user,
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
      commit('auth_request')
      axios.post(`${process.env.VUE_APP_API_URL}/api/v1/auth/login`, userdata)
      // http.post(`${process.env.VUE_APP_API_URL}/api/v1/auth/login`, userdata)
      // http({url: `${process.env.VUE_APP_API_URL}/api/v1/auth/login`, data: userdata, method: 'POST' })
      .then(response => {
        console.log(response.data)
        const token = response.data.access_token
        const user = userdata.get('username')
        const admin = response.data.admin
        localStorage.setItem('token', token)
        localStorage.setItem('user', user)
        localStorage.setItem('admin', admin)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        // Commit 'auth_success' mutations
        const authData = {
          token: token,
          user: user,
          admin: admin,
        }
        commit('auth_success', authData)
        resolve(response)
      })
      .catch(error => {
        var error_msg = ""
        if(error.response && error.response.status == 401) {
          error_msg = "Wrong username or password"
        } else {
          error_msg = "Unknown error"
        }
        this.dispatch('showInfo', {"msg": error_msg, color: 'error'})

        commit('auth_error')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('admin')
        reject(error)
      })
    })
  },
  logout({commit}){
    return new Promise((resolve, reject) => {
      commit('logout')
      console.log('[logout] localStorage')
      console.log(localStorage)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('admin')
      // delete http.defaults.headers.common['Authorization']
      delete axios.defaults.headers.common['Authorization']
      resolve()
    })
  },
  getUsers({commit}) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.VUE_APP_API_URL}/api/v1/users/`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  createUser({commit}, data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_API_URL}/api/v1/users/${data.uid}`, data)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  deleteUser({commit}, uid) {
    return new Promise((resolve, reject) => {
      axios.delete(`${process.env.VUE_APP_API_URL}/api/v1/users/${uid}`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  getGroups({commit}) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.VUE_APP_API_URL}/api/v1/groups/`)
      // http.get(`${process.env.VUE_APP_API_URL}/api/v1/groups/`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  getGroupTree({commit}) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.VUE_APP_API_URL}/api/v1/groups/tree`)
      // http.get(`${process.env.VUE_APP_API_URL}/api/v1/groups/tree`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  add2Group({commit}, data) {
    return new Promise((resolve, reject) => {
      axios.put(`${process.env.VUE_APP_API_URL}/api/v1/groups/${data.pgroup}/${data.group}/${data.uid}`)
      // http.put(`${process.env.VUE_APP_API_URL}/api/v1/groups/${data.pgroup}/${data.group}/${data.uid}`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  deleteGroup({commit}, item) {
    return new Promise((resolve, reject) => {
      axios.delete(`${process.env.VUE_APP_API_URL}/api/v1/users/${item.uid}`)
      // http.delete(`${process.env.VUE_APP_API_URL}/api/v1/users/${item.uid}`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  getMenu({commit}) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.VUE_APP_API_URL}/api/v1/auth/menu`)
      // http.get(`${process.env.VUE_APP_API_URL}/api/v1/auth/menu`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  showInfo({commit}, info) {
    commit('show_info', info)
  }
}

export default new Vuex.Store({
  modules: {
    user,
  },
  state,
  mutations,
  getters,
  actions,
})
