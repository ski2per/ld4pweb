import httpCli from '@/assets/js/http'
import { stat } from 'fs'

const getDefaultState = () => {
  return {
    users: [],
    me: Object,
  }
}

const state = getDefaultState()

const getters = {
  allUsers: state => {
    return state.users
  },
  getIndexByUid: (state) => (uid) => {
    return state.users.map(function(x){ return x.uid}).indexOf(uid)
  }
}

const actions = {
  resetState({commit}) {
    commit('RESET_STATE')
  },
  loadUsers({commit}) {
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/`)
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
    httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/me`)
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
    console.log(['user.js: createddUser'])
    console.log(data)
    httpCli.post(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/${data.uid}`, data)
    .then(response => {
      console.info(`[Invoke API] POST: /users/{user}, http code: ${response.status}`)
      if (response && response.status == 200) {
        commit('CREATE_USER', response.data)
        this.dispatch('notify', {msg: `${data.cn} 创建成功`, color: "success"}, { root: true })
      }
    })
    .catch(error => { console.log(error) })
  },
  updateUser({commit}, data) {
    console.log(['user.js: updateddUser'])
    console.log(data)
    commit('UPDATE_USER', data)
    httpCli.put(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/${data.uid}`, data)
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
    httpCli.delete(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/${uid}`)
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
      httpCli.put(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/password`, password)
      .then(response => {resolve(response)})
      .catch(error => {reject(error)})
    })
  },
  resetPassword({commit}, uid) {
    // 直接调用后端API，但不更改Vuex state，
    // state中的密码Hash暂无卵用
    httpCli.put(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/${uid}/password/reset`)
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
    httpCli.put(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/${uid}/lock`)
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
    httpCli.put(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/users/${uid}/unlock`)
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