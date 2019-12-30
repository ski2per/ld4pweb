import httpCli from '@/assets/js/http'

const state = {
  groups: [],
  groupTree: [],
}

const getters = {}

const actions = {
  loadGroups({commit}) {
    console.log('[store/groups.js: loadGroups()]')
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_URL}/api/v1/groups`)
      .then(response => {
        commit('LOAD_GROUPS', response.data)
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
  loadGroupTree({commit}) {
    console.log('[store/groups.js: loadGroupTree()]')
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_URL}/api/v1/groups/tree`)
      .then(response => {
        commit('LOAD_GROUP_TREE', response.data)
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
  add2Group({commit}, data) {
    return new Promise((resolve, reject) => {
      httpCli.put(`${process.env.VUE_APP_API_URL}/api/v1/groups/${data.pgroup}/${data.group}/${data.uid}`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  deleteGroup({commit}, item) {
    return new Promise((resolve, reject) => {
      httpCli.delete(`${process.env.VUE_APP_API_URL}/api/v1/users/${item.uid}`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
}

const mutations = {
  LOAD_GROUP_TREE(state, tree){
    state.groupTree = tree
  },
  LOAD_GROUPS(state, groups){
    state.groups = groups
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}