import httpCli from '@/assets/js/http'

const state = {
  maillists: [],
}

const getters = {}

const actions = {
  loadMaillists({commit}) {
    console.log('[store/maillists.js: loadMaillists()]')
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_URL}/api/v1/maillists`)
      .then(response => {
        commit('LOAD_MAILLISTS', response.data)
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
  createMaillist({commit}, data) {
    console.log('[store/maillists.js: createMaillist()]')
    return new Promise((resolve, reject) => {
      httpCli.post(`${process.env.VUE_APP_API_URL}/api/v1/maillists/${data.mail}`, data)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  deleteMaillist({commit}, mail) {
    console.log('[store/maillists.js: deleteMaillist()]')

    return new Promise((resolve, reject) => {
      httpCli.delete(`${process.env.VUE_APP_API_URL}/api/v1/maillists/${mail}`)
      .then(response => { resolve(response) })
      .catch(error => { reject(error) })
    })
  },
}

const mutations = {
  LOAD_MAILLISTS(state, maillists){
    state.maillists = maillists 
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}