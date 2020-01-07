import httpCli from '@/assets/js/http'

const state = {
  users: [],
  me: Object,
}

const getters = {}

const actions = {
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
    return new Promise((resolve, reject) => {
      httpCli.post(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/${data.uid}`, data)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
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
  SET_USERS(state, users){
    state.users = users
  },
  SET_ME(state, me) {
    state.me = me
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}