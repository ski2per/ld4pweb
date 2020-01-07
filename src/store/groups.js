import httpCli from '@/assets/js/http'

const getDefaultState = () => {
  return {
    groups: [],
    groupTree: [],
  }
}

const state = getDefaultState()

const getters = {}

const actions = {
  resetState({commit}) {
    commit('RESET_STATE')
  },
  loadGroups({commit}) {
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/groups/`)
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
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/groups/tree`)
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
      httpCli.put(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/groups/${data.pgroup}/${data.group}/${data.uid}`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  deleteGroup({commit}, item) {
    return new Promise((resolve, reject) => {
      httpCli.delete(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/${item.uid}`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
}

const mutations = {
  RESET_STATE (state) {
    Object.assign(state, getDefaultState())
  },
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