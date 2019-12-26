import httpCli from '@/assets/js/http'

const state = {}

const getters = {}

const actions = {
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

const mutations = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}