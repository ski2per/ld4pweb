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