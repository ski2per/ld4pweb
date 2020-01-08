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
  },
  getIndexByUid: (state) => (uid) => {
    return state.users.map(function(x){ return x.uid}).indexOf(uid)
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
    httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/me`)
    .then(response => {
      if(response && response.status == 200) {
        console.info(`[Invoke API] GET: /users/me, http code: ${response.status}`)
        commit('SET_ME', response.data)
      }
    })
    .catch(error => {console.log(error)})
  },
  createUser({commit}, data) {
    httpCli.post(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/${data.uid}`, data)
    .then(response => {
      console.info(`[Invoke API] POST: /users/{user}, http code: ${response.status}`)
      if (response && response.status == 200) {
        commit('CREATE_USER', response.data)
        this.dispatch('notify', {msg: `${data.chinese_name} 创建成功`, color: "success"}, { root: true })
      }
    })
    .catch(error => { console.log(error) })
  },
  deleteUser({commit}, uid) {
    commit('DELETE_USER', uid)
    httpCli.delete(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/${uid}`)
    .then(response => {
      console.info(`[Invoke API] DELETE: /users/{user}, http code: ${response.status}`)
      if(response && response.status == 200) {
        this.dispatch('notify', {msg: response.data.detail, color: "success"}, { root: true })
      }

    })
    .catch(error => {console.log(error)})
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
    state.users.push(user)
  },
  DELETE_USER(state, uid) {
    let idx = this.getters['usr/getIndexByUid'](uid)
    state.users.splice(idx, 1)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}