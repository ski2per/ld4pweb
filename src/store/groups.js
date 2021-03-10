import Vue from 'vue'
import httpCli from '@/assets/js/http'

const getDefaultState = () => {
  return {
    // Group及GeoupTree使用数组来保存
    groups: [],
    groupTree: [],
  }
}

const state = getDefaultState()
// const CURRENT_ORIGIN = window.location.origin
const CURRENT_ORIGIN = process.env.VUE_APP_API_HOST

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
      httpCli.get(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/groups/`)
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
      httpCli.get(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/groups/tree`)
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
    httpCli.post(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/groups/${data.ou}`, data)
    .then(response => {
      console.log(response.data)
    })
    .catch(error => { console.log(error) })
  },
  updateGroup({commit}, data) {
    commit('UPDATE_GROUP', data)
    httpCli.put(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/groups/${data.ou}`, data)
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
      httpCli.put(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/groups/${data.pgroup}/${data.group}/${data.uid}`)
      .then(response => {resolve(response)})
      .catch(error => {
        switch(error.response.status) {
          case 466:
            this.dispatch('notify', {msg: `${data.uid} 已经存在`, color: "error"}, { root: true })
            console.log(`${data.uid}已经加入该组`)
            break;
          default:
            break;
        }
        // reject(error)
      })
    })
  },
  deleteGroup({commit}, data) {
    commit('DELETE_GROUP', data)
    httpCli.delete(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/groups/${data.ou}`)
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
      httpCli.get(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/groups/${groupName}`)
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
    httpCli.get(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/groups/${payload.group}/${payload.subgroup}/member`)
    .then(response => {
      let dataPack = {
        ...payload,
        members: response.data
      }
      commit('SET_SUBGROUP_MEMBERS', dataPack)
    })
    .catch(error => {
      console.log(error.response)
    })

  },
  preCreateSubgroup({commit}, groupOU) {
    commit('PRE_CREATE_SUBGROUP', groupOU)
  },
  createSubgroup({commit}, data) {
    let groupName = data.group
    commit('CREATE_SUBGROUP', data)
    let postData = {
      members: [],
      description: data.description
    }
    httpCli.post(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/groups/${groupName}/${data.cn}`, postData)
    .then(response => {
      console.info(`[Invoke API] POST: /groups/{group}/{subgroup}, http code: ${response.status}`)
    })
    .catch(error => { console.log(error) })
  },
  deleteSubgroup({commit}, data) {
    commit('DELETE_SUBGROUP', data)
    httpCli.delete(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/groups/${data.group}/${data.subgroup}`)
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
    httpCli.put(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/groups/${data.group.ou}/${data.subgroup.cn}`, 
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
    httpCli.delete(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/groups/${data.group}/${data.subgroup}/${data.member}`) 
    .then(response => {
      console.log(response.data.detail)
      // this.dispatch('notify', {msg: response.data.detail, color: "success"}, { root: true })
      // Load current user's info(especially for admin)
      this.dispatch('usr/loadMyInfo')
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
      httpCli.put(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/groups/${data.group}/${data.subgroup}/${item.uid}`) 
      .then(response => {
        console.log(response.data.detail)
        // Load current user's info(especially for admin)
        this.dispatch('usr/loadMyInfo')
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
    // state.groups.push(data)
    state.groups.unshift(data)
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
    // let arr = [...target.subgroups]
    // arr.unshift({cn: "", description: "", edited: true})
    // arr.push({cn: "", description: "", edited: true})
    // Vue.set(target, "subgroups", arr)

    target.subgroups.unshift({cn: "", description: "", state: "create"})
  },
  CREATE_SUBGROUP(state, payload) {
    // payload = {
    //   group: "group name",
    //   cn: "subgroup name",
    //   description: "subgroup description"
    // }
    let groupIdx = this.getters['grp/getIndexByOU'](payload.group)
    let target = state.groups[groupIdx]

    // 由于在PRE_CREATE_SUBGROUP中使用了unshift
    // 数组第一个元素为新加元素
    let subgroupIdx = 0

    delete payload.group
    Vue.set(payload, 'members', [])
    target.subgroups.splice(subgroupIdx, 1, payload)
  },
  UPDATE_SUBGROUP_DESC(state, payload) {
    // payload is a whole group object to replace
    let groupIdx = this.getters['grp/getIndexByOU'](payload.ou)
    state.groups.splice(groupIdx, 1, payload)
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