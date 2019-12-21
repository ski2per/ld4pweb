import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    isAdmin: false,
    user: '',
    info: '',
    infoColor: '',
  },

  mutations: {
    auth_request(state){
      state.status = 'loading'
    },
    auth_success(state, authData){
      state.status = 'success'
      state.token = authData.token
      state.user = authData.user
      state.isAdmin = authData.admin
    },
    auth_error(state){
      state.status = 'error'
    },
    logout(state){
      state.status = ''
      state.token = ''
      state.isAdmin = false
    },
    show_info(state, info){
      state.info = info.msg
      state.infoColor = info.color 
    }
  },
  actions: {
    login({commit}, userdata){
      return new Promise((resolve, reject) => {
        console.log(process.env.VUE_APP_API_URL)
        commit('auth_request')
        axios({url: `${process.env.VUE_APP_API_URL}/api/v1/auth/login`, data: userdata, method: 'POST' })
        .then(response => {
          const token = response.data.access_token
          const isAdmin = response.data.admin
          const user = userdata.get('username')
          localStorage.setItem('token', token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

          // Commit 'auth_success' mutations
          const authData = {
            token: token,
            user: user,
            admin: isAdmin,
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
          reject(error)
        })
      })
    },
    logout({commit}){
      return new Promise((resolve, reject) => {
        commit('logout')
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    },
    showInfo({commit}, info) {
      commit('show_info', info)
    }
  },
  getters: {
    isAdmin: state => state.isAdmin,
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    isInfo: state => !!state.info,
    getInfo: state => state.info,
    getInfoColor: state => state.infoColor
  }
})
