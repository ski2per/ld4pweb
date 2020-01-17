import Vue from 'vue'
import httpCli from '@/assets/js/http'
import { stat } from 'fs'
import { transcode } from 'buffer'

const getDefaultState = () => {
  return {
    // Group及GeoupTree使用数组来保存
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
  },
  getIndexByUid: (state) => (data) => {
    // data = {
    //   members: [],
    //   member: "member's uid"
    // }
    return data.members.map(function(x){return x.uid}).indexOf(data.member)
  },
  subgroupMembers: (state, getters) => (data) => {
    // data = {
    //   group: 'group name',
    //   subgroup: 'subgroup name'
    // }
    let groupIdx = getters.getIndexByOU(data.group)
    let targetGroup = state.groups[groupIdx]
    let subgroupIdx = getters.getIndexByCN({subgroups: targetGroup.subgroups, cn: data.subgroup})
    return targetGroup.subgroups[subgroupIdx].members
  }
}

const actions = {
  resetState({commit}) {
    commit('RESET_STATE')
  },

  // ====================================
  //Actions for group
  // ====================================
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

  // ====================================
  // Actions for subgroup
  // ====================================
  loadSubgroup({commit}, groupName) {
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/groups/${groupName}`)
      .then(response => {
        commit('SET_SUBGROUPS', {group: groupName, subgroups: response.data})
        resolve(response)
      })
      .catch(error => {
        console.log(error.response)
        reject(error)
      })
    })
  },
  loadSubgroupMembers({commit}, payload) {
    httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/groups/${payload.group}/${payload.subgroup}/member`)
    .then(response => {
      let dataPack = {
        ...payload,
        members: response.data
      }
      commit('SET_SUBGROUP_MEMBERS', dataPack)
    })
    .catch(error => {
      // Bug fix: 如果该组在memberOf插件之前有一些残留用户，进行通知提示
      //          用户需要手动删除
      if(error.response && error.response.status == 404) {
        this.dispatch('notify', {msg: "该组有残留用户(F12)", color: "error"}, { root: true })
      }
      console.log(error.response)
    })

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
  },
  deleteSubgroupMember({commit}, data) {
    // data = {
    //   group: "group name",
    //   subgroup: "subgroup name",
    //   member: "member uid"
    // }
    commit('DELETE_SUBGROUP_MEMBER', data)
    httpCli.delete(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/groups/${data.group}/${data.subgroup}/${data.member}`) 
    .then(response => {
      console.log(response.data.detail)
      // this.dispatch('notify', {msg: response.data.detail, color: "success"}, { root: true })
    })
    .catch(error => {console.log(error)})
  },
  addSubgroupMember({commit}, data) {
    // data = {
    //   group: "group name",
    //   subgroup: "subgroup name",
    //   members: [Object, Object]
    // }
    commit('ADD_SUBGROUP_MEMBER', data)
    // WILL refactor in later release
    // MAYBE add batch addition API
    data.members.forEach((item, index) => {
      httpCli.put(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/groups/${data.group}/${data.subgroup}/${item.uid}`) 
      .then(response => {
        console.log(response.data.detail)
      })
      .catch(error => {console.log(error)})
    })
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
  SET_SUBGROUP_MEMBERS(state, payload) {
    // payload = {
    //   group: "group name",
    //   subgroup: "subgroup name",
    //   members: []
    // }
    let groupIdx = this.getters['grp/getIndexByOU'](payload.group)
    let targetGroup = state.groups[groupIdx]
    let subgroupIdx = this.getters['grp/getIndexByCN']({subgroups: targetGroup.subgroups, cn: payload.subgroup})
    targetGroup.subgroups[subgroupIdx].members = payload.members
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
  },
  ADD_SUBGROUP_MEMBER(state, payload) {
    let groupIdx = this.getters['grp/getIndexByOU'](payload.group)
    let data = {
      subgroups: state.groups[groupIdx].subgroups,
      cn: payload.subgroup
    }
    let subgroupIdx = this.getters['grp/getIndexByCN'](data)
    let targetArr = state.groups[groupIdx].subgroups[subgroupIdx].members
    let newArr = targetArr.concat(payload.members)
    state.groups[groupIdx].subgroups[subgroupIdx].members = newArr
  },
  DELETE_SUBGROUP_MEMBER(state, payload) {
    // data = {
    //   group: "group name",
    //   subgroup: "subgroup name",
    //   member: "member uid"
    // }
    let members = this.getters['grp/subgroupMembers'](payload)
    let memberIdx = this.getters['grp/getIndexByUid']({members: members, member: payload.member})
    members.splice(memberIdx, 1)

  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}