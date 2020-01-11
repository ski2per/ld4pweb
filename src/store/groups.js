import Vue from 'vue'
import httpCli from '@/assets/js/http'

const getDefaultState = () => {
  return {
    groups: [],
    groupTree: [],
  }
}

const state = getDefaultState()

const getters = {
  getIndexByOu: (state) => (ou) => {
    return state.groups.map(function(x){ return x.ou}).indexOf(ou)
  },
}

const actions = {
  resetState({commit}) {
    commit('RESET_STATE')
  },
  loadGroups({commit}) {
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/groups/`)
      .then(response => {
        commit('SET_GROUPS', response.data)
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
        commit('SET_GROUP_TREE', response.data)
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
  loadSubgroup({commit}, groupName) {
    httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/groups/${groupName}`)
    .then(response => {
      commit('SET_SUBGROUPS', {group: groupName, subgroups: response.data})
    })
    .catch(error => { console.log(error) })
  },
  createGroup({commit}, data) {
    commit('CREATE_GROUP', data)
  },
  preCreateGroup({commit}, data) {
    commit('PRE_CREATE_GROUP', data)
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
  SET_GROUP_TREE(state, tree){
    state.groupTree = tree
  },
  SET_GROUPS(state, groups){
    state.groups = groups
  },
  SET_SUBGROUPS(state, data) {
    // data = {
    //   group: "group name",
    //   subgroups: []
    // }
    let idx = this.getters['grp/getIndexByOu'](data.group)
    let target = state.groups[idx]
    Vue.set(target, 'subgroups', data.subgroups)
  },
  PRE_CREATE_GROUP(state, data) {
    state.groups.push(data)
  },
  CREATE_GROUP(state, data) {
    delete data.edited

    let idx = this.getters['grp/getIndexByOu'](data.ou)
    let target = state.groups[idx]
    // Merge data
    let newGroup = {
      ...target,
      ...data
    }
    state.groups.splice(idx, 1, newGroup)
  },
  UPDATE_GROUP(state, data) {
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}