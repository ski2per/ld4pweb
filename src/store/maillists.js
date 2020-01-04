import httpCli from '@/assets/js/http'

const state = {
  maillists: Object,
}

const getters = {
  // return values in "maillists"
  maillistArr: state => {
    return Object.values(state.maillists)
  },
  maillistMember: (state) => (maillist) => {
    // "members" 跟RESTful API返回值要匹配
    return state.maillists[maillist].members
  },
}

const actions = {
  loadMaillists({commit}) {
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/`)
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
      httpCli.post(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${data.mail}`, data)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  deleteMaillist({commit}, maillist) {
    return new Promise((resolve, reject) => {
      httpCli.delete(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${maillist}`)
      .then(response => { resolve(response) })
      .catch(error => { reject(error) })
    })
  },
  updateMaillist({commit}, data) {
    return new Promise((resolve, response) => {
      httpCli.put(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${data.maillist}`, data)
      .then(response => { resolve(response) })
      .catch(error => { reject(error) })
    })
  },
  addUser2Maillist({commit}, data) {
    return new Promise((resolve, reject) => {
      httpCli.put(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${data.maillist}/${data.uid}`)
      .then(response => { resolve(response) })
      .catch(error => { reject(error) })
    })
  },
  removeUserFromMaillist({commit}, data) {
    return new Promise((resolve, reject) => {
      httpCli.delete(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${data.maillist}/${data.uid}`)
      .then(response => { resolve(response) })
      .catch(error => { reject(error) })
    })

  },
  loadMaillistMember({commit}, maillist) {
    console.log(maillist)
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${maillist}/member`)
      .then(response => {
        console.log(response.data)
        commit('SET_MAILLIST_MEMBER', {maillist: maillist, members: response.data})

        resolve(response)
      })
      .catch(error => { reject(error) })
    })
  },
}

const mutations = {
  LOAD_MAILLISTS(state, maillists){
    state.maillists = maillists 
  },
  SET_MAILLIST_MEMBER(state, data) {
    // "members"要跟RESTful API匹配
    state.maillists[data.maillist].members = data.members
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}