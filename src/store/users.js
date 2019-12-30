import httpCli from '@/assets/js/http'

const state = {
  users: [],
}

const getters = {}

const actions = {
  loadUsers({commit}) {
    console.log('[store/user.js] action: loadUsers()')
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_URL}/api/v1/users/`)
      .then(response => {
        console.log('[user.js: loadUsers()]')
        commit('LOAD_USERS', response.data)
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
  updatePassword({commit}, password) {
    console.log("user action")
    return new Promise((resolve, reject) => {
      httpCli.put(`${process.env.VUE_APP_API_URL}/api/v1/users/password`, password)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  getMyInfo({commit}) {
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_URL}/api/v1/users/me`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
}

const mutations = {
  LOAD_USERS(state, users){
    state.users = users
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}