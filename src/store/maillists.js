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
  addUser2Maillist({commit}, data) {
    console.log('[store/maillists.js: addUser2Maillist()]')
    return new Promise((resolve, reject) => {
      httpCli.put(`${process.env.VUE_APP_API_URL}/api/v1/maillists/${data.maillist}/${data.uid}`)
      .then(response => { resolve(response) })
      .catch(error => { reject(error) })
    })
  },
  loadMaillistMember({commit}, maillist) {
    console.log('[store/maillists.js: addUser2Maillist()]')
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_URL}/api/v1/maillists/${maillist}/member`)
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