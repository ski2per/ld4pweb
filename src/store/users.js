import Vue from 'vue'
import httpCli from '@/assets/js/http'

const CURRENT_ORIGIN = window.location.origin

const getDefaultState = () => {
  return {
    users: [],
    me: Object,
  }
}

const state = getDefaultState()

const getters = {
  allUsers: (state) =>(filter) => {
    if (filter) {
      return state.users.filter(user => user.objectClass.length == 5)
    } else {
      return state.users
    }
  },

  getIndexByUid: (state) => (uid) => {
    return state.users.map(function(x){ return x.uid}).indexOf(uid)
  },
}

const actions = {
  resetState({commit}) {
    commit('RESET_STATE')
  },
  // 同步全员用户账号
  syncUsers({commit}) {
    httpCli.get(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/util/syncuser`)
    .then(response => {
      if (response && response.status == 200) {
        this.dispatch('notify', {msg: '同步全员成功', color: "success"}, { root: true })
        let payload = {
          group: process.env.VUE_APP_DEFAULT_GROUP_NAME,
          subgroup: process.env.VUE_APP_ALL_SUBGROUP_NAME,
          // members: []
        }
        // commit('grp/SET_SUBGROUP_MEMBERS', payload, {root: true})
        this.dispatch('grp/loadSubgroupMembers', payload)
      }
    })
    .catch(error =>{
      console.log(error)
      console.log(error.response)
      this.dispatch('notify', {msg: '同步全员发生异常', color: "error"}, { root: true })
    })
  },
  loadUsers({commit}) {
    return new Promise((resolve, reject) => {
      httpCli.get(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/users/`)
      .then(response => {
        commit('SET_USERS', response.data)
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
  loadMyInfo({commit}) {
    httpCli.get(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/users/me`)
    .then(response => {
      if(response && response.status == 200) {
        console.info(`[Invoke API] GET: /users/me, http code: ${response.status}`)
        commit('SET_ME', response.data)
      }
    })
    .catch(error => {console.log(error)})
  },
  // 创建用户Action, 先调用后台API创建用户成功之后，
  // 将返回的用户字典提交给state
  createUser({commit}, data) {
    httpCli.post(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/users/${data.uid}`, data)
    .then(response => {
      console.info(`[Invoke API] POST: /users/{user}, http code: ${response.status}`)
      if (response && response.status == 200) {
        commit('CREATE_USER', response.data)
        this.dispatch('notify', {msg: `${data.cn} 创建成功`, color: "success"}, { root: true })
      } else {
        console.log('hehe')
        console.log(response.status)
      }
    })
    .catch(error => { 
      console.log(error) 
      console.log(error.response)
      switch(error.response.status) {
        case 462:
          this.dispatch('notify', {msg: `${data.uid} 已经存在`, color: "error"}, { root: true })
          break;
        default:
          break;
      }
    })
  },
  updateUser({commit}, data) {
    commit('UPDATE_USER', data)
    httpCli.put(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/users/${data.uid}`, data)
    .then(response => { 
      console.info(`[Invoke API] PUT: /users/{user}, http code: ${response.status}`)
      if (response && response.status == 200) {
        this.dispatch('notify', {msg: response.data.detail, color: "success"}, { root: true })
      }
    })
    .catch(error => { 
      this.dispatch('notify', {msg: "更新用户时发生错误", color: "error"}, { root: true })
      console.log(error)
    })
  },
  deleteUser({commit}, uid) {
    commit('DELETE_USER', uid)
    httpCli.delete(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/users/${uid}`)
    .then(response => {
      console.info(`[Invoke API] DELETE: /users/{user}, http code: ${response.status}`)
      if(response && response.status == 200) {
        this.dispatch('notify', {msg: response.data.detail, color: "success"}, { root: true })
      }
    })
    .catch(error => {
      console.log(error)
    })
  },
  updatePassword({commit}, password) {
    return new Promise((resolve, reject) => {
      httpCli.put(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/users/password`, password)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  resetPassword({commit}, uid) {
    // 直接调用后端API，但不更改Vuex state，
    // state中的密码Hash暂无卵用
    httpCli.put(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/users/${uid}/password/reset`)
    .then(response => {
      if(response && response.status == 200) {
        this.dispatch('notify', {msg: response.data.detail, color: "success"}, { root: true })
      }
    })
    .catch(error => {
      this.dispatch('notify', {msg: "重置密码时发生错误", color: "error"}, { root: true })
      console.log(error)
    })
  },
  lockUser({commit}, uid) {
    commit('LOCK_USER', uid)
    httpCli.put(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/users/${uid}/lock`)
    .then(response => {
      if(response && response.status == 200) {
        this.dispatch('notify', {msg: response.data.detail, color: "success"}, { root: true })
      }
    })
    .catch(error => {
      this.dispatch('notify', {msg: "锁定用户时发生错误", color: "error"}, { root: true })
      console.log(error)
    })
  },
  unlockUser({commit}, uid) {
    commit('UNLOCK_USER', uid)
    httpCli.put(`${CURRENT_ORIGIN}/${process.env.VUE_APP_API_PATH}/users/${uid}/unlock`)
    .then(response => {
      if(response && response.status == 200) {
        this.dispatch('notify', {msg: response.data.detail, color: "success"}, { root: true })
      }
    })
    .catch(error => {
      this.dispatch('notify', {msg: "解锁用户时发生错误", color: "error"}, { root: true })
      console.log(error)
    })
  }
}

const mutations = {
  RESET_STATE (state) {
    Object.assign(state, getDefaultState())
  },
  SET_USERS(state, users){
    state.users = users
  },
  SET_ME(state, me) {
    state.me = me
  },
  CREATE_USER(state, user) {
    state.users.push(user)
  },
  UPDATE_USER(state, user) {
    let idx = this.getters['usr/getIndexByUid'](user.uid)
    let target = state.users[idx]
    if(user.admin) {
      // Assign admin permission to user
      // no need to update 'enabledService' array
      // target.domainGlobalAdmin = 'yes'
      Vue.set(target, 'domainGlobalAdmin', 'yes')
    } else {
      if(target.domainGlobalAdmin) {
        // This means user is admin before,
        // remove user's admin permission
        Vue.delete(target, 'domainGlobalAdmin')
      }
    }
    target.cn = user.cn
    target.displayName = user.cn
    target.sn = user.sn
    target.givenName = user.givenName
    state.users.splice(idx, 1, target)
  },
  DELETE_USER(state, uid) {
    let idx = this.getters['usr/getIndexByUid'](uid)
    state.users.splice(idx, 1)
  },
  LOCK_USER(state, uid) {
    let idx = this.getters['usr/getIndexByUid'](uid)
    let target = state.users[idx]
    target.accountStatus = "inactive"
    state.users.splice(idx, 1, target)
  },
  UNLOCK_USER(state, uid) {
    let idx = this.getters['usr/getIndexByUid'](uid)
    let target = state.users[idx]
    target.accountStatus = "active"
    state.users.splice(idx, 1, target)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}