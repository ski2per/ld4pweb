import httpCli from '@/assets/js/http'
import { stat } from 'fs'

const getDefaultState = () => {
  return {
    users: [],
    me: Object,
  }
}

const state = getDefaultState()

const getters = {
  allUsers: state => {
    return state.users
  }
}

const actions = {
  resetState({commit}) {
    commit('RESET_STATE')
  },
  loadUsers({commit}) {
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/`)
      .then(response => {
        commit('SET_USERS', response.data)
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
  loadMyInfo({commit}) {
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/me`)
      .then(response => {
        if(response && response.status == 200) {
          console.info(`[Invoke API] GET: /users/me, http code: ${response.status}`)
          commit('SET_ME', response.data)
        }
        // resolve(response)
      })
      .catch(error => {reject(error)})
    })
  },
  createUser({commit}, data) {
    httpCli.post(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/${data.uid}`, data)
    .then(response => {
      console.info(`[Invoke API] POST: /users/{user}, http code: ${response.status}`)
      if (response && response.status == 200) {
        commit('CREATE_USER', response.data)
      }
    })
    .catch(error => { console.log(error) })
  },
  deleteUser({commit}, uid) {
    return new Promise((resolve, reject) => {
      httpCli.delete(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/${uid}`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  updatePassword({commit}, password) {
    return new Promise((resolve, reject) => {
      httpCli.put(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/password`, password)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
}

const mutations = {
  RESET_STATE (state) {
    Object.assign(state, getDefaultState())
  },
  SET_USERS(state, users){
    state.users = users
  },
  SET_ME(state, me) {
    state.me = me
  },
  CREATE_USER(state, user) {
    // state.users.$set(0, user)
    state.users.push(user)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}