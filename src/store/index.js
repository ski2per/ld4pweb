import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: '',
    info: '',
  },

  mutations: {
    auth_request(state){
      state.status = 'loading'
    },
    auth_success(state, token, user){
      state.status = 'success'
      state.token = token
      state.user = user
    },
    auth_error(state){
      state.status = 'error'
    },
    logout(state){
      state.status = ''
      state.token = ''
    },
    show_info(state, msg){
      state.info = msg
    }
  },
  actions: {
    login({commit}, userdata){
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({url: 'http://localhost:8000/api/v1/auth/login', data: userdata, method: 'POST' })
        // axios({url: 'http://172.16.66.6:8000/api/v1/auth/login', data: userdata, method: 'POST' })
        .then(resp => {
          console.log(resp)
          const token = resp.data.access_token
          const user = userdata.get('username')
          console.log(token)
          console.log(user)
          localStorage.setItem('token', token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          commit('auth_success', token, user)
          resolve(resp)
        })
        .catch(err => {
          var error_msg = ""
          if(err.response) {
            if (err.response.status == 401) {
              // this.$store.dispatch('showInfo', "Wrong username or password")
              error_msg = "Wrong username or password"
            }
          } else {
            // this.$store.dispatch('showInfo', "Unknown error")
            error_msg = "Unknown error"
          }
          this.dispatch('showInfo', error_msg)

          commit('auth_error')
          localStorage.removeItem('token')
          reject(err)
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
    showInfo({commit}, msg) {
      console.log('[showInfo] dispatched')
      console.log(msg)
      commit('show_info', msg)
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    isInfo: state => !!state.info,
    getInfo: state => state.info
  }
})
