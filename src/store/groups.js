import Vue from 'vue'
import httpCli from '@/assets/js/http'
import { stat } from 'fs'
import { transcode } from 'buffer'

const getDefaultState = () => {
  return {
    groups: [],
    groupTree: [],
  }
}

const state = getDefaultState()

const getters = {
  // For group
  getIndexByOU: (state) => (ou) => {
    return state.groups.map(function(x){ return x.ou}).indexOf(ou)
  },

  // For subgroup
  getIndexByCN: (state) => (data) => {
    // data = {
    //   subgroups: [],
    //   cn: "subgroup cn"
    // }
    return data.subgroups.map(function(x){return x.cn}).indexOf(data.cn)
  }
}

const actions = {
  resetState({commit}) {
    commit('RESET_STATE')
  },

  //Actions for group
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
  preCreateGroup({commit}) {
    commit('PRE_CREATE_GROUP', {ou: "", description: "", edited: true})
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

  //Actions for subgroup
  loadSubgroup({commit}, groupName) {
    httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/groups/${groupName}`)
    .then(response => {
      commit('SET_SUBGROUPS', {group: groupName, subgroups: response.data})
    })
    .catch(error => { console.log(error) })
  },
  preCreateSubgroup({commit}, groupOU) {
    commit('PRE_CREATE_SUBGROUP', groupOU)
  },
  createSubgroup({commit}, data) {
    console.log('[group.js: createSubgroup]')

    let groupName = data.group
    commit('CREATE_SUBGROUP', data)
    let postData = {
      members: [],
      description: data.description
    }
    httpCli.post(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/groups/${groupName}/${data.cn}`, postData)
    .then(response => {
      console.log(response.data)
    })
    .catch(error => { console.log(error) })
  },
  deleteSubgroup({commit}, data) {
    commit('DELETE_SUBGROUP', data)
    httpCli.delete(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/groups/${data.group}/${data.subgroup}`)
    .then(response => {
      this.dispatch('notify', {msg: response.data.detail, color: "success"}, { root: true })
    })
    .catch(error => {console.log(error)})
  },
  updateSubgroupDesc({commit}, data) {
    // data = {
    //   group: group Object,
    //   subgroup: subgroup Object
    // }
    commit('UPDATE_SUBGROUP_DESC', data.group)
    httpCli.put(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/groups/${data.group.ou}/${data.subgroup.cn}`, 
                  {description: data.subgroup.description})
    .then(response => {
      console.log(response.data.detail)
      // this.dispatch('notify', {msg: response.data.detail, color: "success"}, { root: true })
    })
    .catch(error => {console.log(error)})
    console.log(data.subgroup)

  }
}

const mutations = {
  RESET_STATE (state) {
    Object.assign(state, getDefaultState())
  },

  // ====================================
  // Mutations for group
  // ====================================
  SET_GROUP_TREE(state, tree){
    state.groupTree = tree
  },
  SET_GROUPS(state, groups){
    state.groups = groups
  },
  PRE_CREATE_GROUP(state, data) {
    // Can this mutation be canceled?
    state.groups.push(data)
  },
  CREATE_GROUP(state, data) {
    delete data.edited

    let idx = this.getters['grp/getIndexByOU'](data.ou)
    let target = state.groups[idx]
    // Merge data
    let newGroup = {
      ...target,
      ...data
    }
    state.groups.splice(idx, 1, newGroup)
  },
  UPDATE_GROUP(state, payload) {
    // payload is a whole group object
    let idx = this.getters['grp/getIndexByOU'](payload.ou)
    state.groups.splice(idx, 1, payload)
  },
  DELETE_GROUP(state, data) {
    let idx = this.getters['grp/getIndexByOU'](data.ou)
    state.groups.splice(idx, 1)
  },

  // ====================================
  // Mutations for subgroup
  // ====================================
  SET_SUBGROUPS(state, data) {
    // data = {
    //   group: "group name",
    //   subgroups: []
    // }
    let idx = this.getters['grp/getIndexByOU'](data.group)
    let target = state.groups[idx]
    Vue.set(target, 'subgroups', data.subgroups)
  },
  PRE_CREATE_SUBGROUP(state, groupOU) {
    let idx = this.getters['grp/getIndexByOU'](groupOU)
    let target = state.groups[idx]

    // --- DEBUG ---
    // console.log(target.subgroups)
    // let arr = [...target.subgroups]
    // arr.unshift({cn: "", description: "", edited: true})
    // arr.push({cn: "", description: "", edited: true})
    // Vue.set(target, "subgroups", arr)

    // unshift() 导致不能监听Subgroup.vue的自定义addsg事件，暂时未解决
    // Still stuck
    // target.subgroups.unshift({cn: "", description: "", edited: true})
    target.subgroups.push({cn: "", description: "", state: "create"})
  },
  CREATE_SUBGROUP(state, payload) {
    // payload = {
    //   group: "group name",
    //   cn: "subgroup name",
    //   description: "subgroup description"
    // }
    let groupIdx = this.getters['grp/getIndexByOU'](payload.group)
    let target = state.groups[groupIdx]

    // 由于在PRE_CREATE_SUBGROUP中使用了push
    // 默认数组最后一个元素为新加元素
    let subgroupIdx = target.subgroups.length - 1

    delete payload.group
    target.subgroups.splice(subgroupIdx, 1, payload)
  },
  UPDATE_SUBGROUP_DESC(state, payload) {
    // payload is a whole group object
    let groupIdx = this.getters['grp/getIndexByOU'](payload.group)
    state.groups.splice(groupIdx, 1)
  },
  DELETE_SUBGROUP(state, payload) {
    // payload = {
    //   group: "group name",
    //   subgroup: "subgroup name"
    // }
    let groupIdx = this.getters['grp/getIndexByOU'](payload.group)
    let data = {
      subgroups: state.groups[groupIdx].subgroups,
      cn: payload.subgroup
    }
    let subgroupIdx = this.getters['grp/getIndexByCN'](data)
    state.groups[groupIdx].subgroups.splice(subgroupIdx, 1)
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}