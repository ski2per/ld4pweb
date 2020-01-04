import httpCli from '@/assets/js/http'

const state = {
  maillists: Object,
}

const getters = {
  // return values in "maillists"
  maillistArr: state => {

    return Object.values(state.maillists)
  },
  maillistMember: (state) => (mlst) => {
    // "members" 跟RESTful API返回值要匹配
    // How to use:
    // this.$store.getters['lm/maillistMember'](this.maillistName)
    return state.maillists[mlst].members
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
    commit('UPDATE_MAILLIST', data)
    httpCli.put(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${data.maillist}`, data)
    .then(response => { 
      if (response && response.status == 200) {
        this.dispatch('notify', {msg: `${data.cn} 已更新 `, color: "success"}, { root: true })
      }
    })
    .catch(error => { console.log(error) })
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
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${maillist}/member`)
      .then(response => {
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
    // data = {
    //   maillist: "xxx_group",
    //   members: [],
    // }
    // "members"要跟RESTful API匹配
    state.maillists[data.maillist].members = data.members
  },
  UPDATE_MAILLIST(state, data) {
    // data = {
    //   maillist: "xxx_group",
    //   cn: "xxx_group cn",
    // }
    // only update "cn"
    state.maillists[data.maillist].cn = data.cn
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}