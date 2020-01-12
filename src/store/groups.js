import Vue from 'vue'
import httpCli from '@/assets/js/http'
import { stat } from 'fs'

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
  preCreateGroup({commit}, data) {
    commit('PRE_CREATE_GROUP', data)
  },
  createGroup({commit}, data) {
    commit('CREATE_GROUP', data)
    httpCli.post(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/groups/${data.ou}`, data)
    .then(response => {
      console.log(response.data)
    })
    .catch(error => { console.log(error) })
  },
  updateGroup({commit}, data) {
    commit('UPDATE_GROUP', data)
    httpCli.put(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/groups/${data.ou}`, data)
    .then(response => {
      console.info(`[Invoke API] PUT: /groups/{group}, http code: ${response.status}`)
      this.dispatch('notify', {msg: response.data.detail, color: "success"}, { root: true })
    })
    .catch(error => {
      console.log(error)
    })
  },
  add2Group({commit}, data) {
    return new Promise((resolve, reject) => {
      httpCli.put(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/groups/${data.pgroup}/${data.group}/${data.uid}`)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  deleteGroup({commit}, data) {
    commit('DELETE_GROUP', data)
    httpCli.delete(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/groups/${data.ou}`)
    .then(response => {
      console.info(`[Invoke API] DELETE: /groups/{group}, http code: ${response.status}`)
      this.dispatch('notify', {msg: response.data.detail, color: "success"}, { root: true })
    })
    .catch(error => {
      console.log(error)
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
    let idx = this.getters['grp/getIndexByOu'](data.ou)
    state.groups.splice(idx, 1, data)
  },
  DELETE_GROUP(state, data) {
    let idx = this.getters['grp/getIndexByOu'](data.ou)
    state.groups.splice(idx, 1)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}