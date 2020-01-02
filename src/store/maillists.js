import httpCli from '@/assets/js/http'

const state = {
  maillists: [],
}

const getters = {}

const actions = {
  loadMaillists({commit}) {
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_URL}/api/v1/maillists/`)
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
    return new Promise((resolve, reject) => {
      httpCli.post(`${process.env.VUE_APP_API_URL}/api/v1/maillists/${data.mail}`, data)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  deleteMaillist({commit}, maillist) {
    return new Promise((resolve, reject) => {
      httpCli.delete(`${process.env.VUE_APP_API_URL}/api/v1/maillists/${maillist}`)
      .then(response => { resolve(response) })
      .catch(error => { reject(error) })
    })
  },
  updateMaillist({commit}, data) {
    return new Promise((resolve, response) => {
      httpCli.put(`${process.env.VUE_APP_API_URL}/api/v1/maillists/${data.maillist}`, data)
      .then(response => { resolve(response) })
      .catch(error => { reject(error) })
    })
  },
  addUser2Maillist({commit}, data) {
    return new Promise((resolve, reject) => {
      httpCli.put(`${process.env.VUE_APP_API_URL}/api/v1/maillists/${data.maillist}/${data.uid}`)
      .then(response => { resolve(response) })
      .catch(error => { reject(error) })
    })
  },
  removeUserFromMaillist({commit}, data) {
    return new Promise((resolve, reject) => {
      httpCli.delete(`${process.env.VUE_APP_API_URL}/api/v1/maillists/${data.maillist}/${data.uid}`)
      .then(response => { resolve(response) })
      .catch(error => { reject(error) })
    })

  },
  loadMaillistMember({commit}, maillist) {
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