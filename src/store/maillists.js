import Vue from 'vue'
import httpCli from '@/assets/js/http'

const getDefaultState = () => {
  return {
    maillists: Object,
    loading: false,
  }
}

// 邮件列表state使用字典(Object)来保存
const state = getDefaultState()

const getters = {
  // return values in "maillists"
  // allMaillists: (state) => () => {
  allMaillists: state => {
    return Object.values(state.maillists)
  },
  maillistMember: (state) => (mlst) => {
    // "members" 跟RESTful API返回值要匹配
    // How to use:
    // this.$store.getters['mlst/maillistMember'](this.maillistName)
    return state.maillists[mlst].members
  },
  isMemberLoading: state => {
    return state.loading
  }
}

const actions = {
  resetState({commit}) {
    commit('RESET_STATE')
  },
  syncMaillist({commit}) {
    httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/util/syncmaillist`)
    .then(response => {
      console.log(response)
      if (response && response.status == 200) {
        this.dispatch('notify', {msg: '同步邮件列表成功', color: "success"}, { root: true })
      }
      this.dispatch('mlst/loadMaillists')
    })
    .catch(error => {
      console.log(error)
      console.log(error.response)
      this.dispatch('notify', {msg: '同步邮件列表发生异常', color: "error"}, { root: true })
    })

  },
  loadMaillists({commit}) {
    return new Promise((resolve, reject) => {
      // Set loading signal
      commit('LOADING');
      httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/`)
      .then(response => {
        commit('LOAD_MAILLISTS', response.data);
        commit('LOADING');
        resolve(response);
      })
      .catch(error => {
        reject(error)
      })
    })
  },
  createMaillist({commit}, data) {
    let maillistName = data.mail + '_group'
    let mlMail = maillistName + '@cetcxl.com'
    let newCN = ""

    // Assign maillist key to CN, if CN not exists
    if (!data.cn ) {
      newCN = maillistName
    } else {
      newCN = data.cn
    }

    let newData = {
      ...data,
      mail: mlMail,
      cn: newCN,
      // members will be created by "addUser2Maillist"
      members: []
    }
    commit("CREATE_MAILLIST", {key: maillistName, data: newData})
    httpCli.post(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${data.mail}`, data)
    .then(response => {
      console.info(`[Invoke API] POST: /maillists/{maillist}, http code: ${response.status}`)
      if (response && response.status == 200) {
        this.dispatch('notify', {msg: response.data.detail, color: "success"}, { root: true })
        // Then try to add members
        if (data.members.length) {
          let payload = {
            maillist: maillistName,
            members: data.members,
          }
          this.dispatch('mlst/addUser2Maillist', payload)
        }
      }
    })
    .catch(error => {console.error(error)})
  },
  deleteMaillist({commit}, maillist) {
    commit("DELETE_MAILLIST", maillist)
      httpCli.delete(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${maillist}`)
      .then(response => {
        if (response && response.status == 200) {
          console.info(`[Invoke API] DELETE: /maillists/{maillist}, http code: ${response.status}`)
          this.dispatch('notify', {msg: response.data.detail, color: "success"}, { root: true })
        }
      })
      .catch(error => { reject(error) })
  },
  updateMaillist({commit}, data) {
    commit('UPDATE_MAILLIST', data)
    httpCli.put(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${data.maillist}`, data)
    .then(response => { 
      if (response && response.status == 200) {
        console.info(`[Invoke API] PUT: /maillists/{maillist}, http code: ${response.status}`)
        this.dispatch('notify', {msg: response.data.detail, color: "success"}, { root: true })
      }
    })
    .catch(error => { console.log(error) })
  },
  addUser2Maillist({commit}, payload) {
    // payload = {
    //   maillist: "xxx",
    //   members: [],
    // }
    commit('SET_MAILLIST_MEMBER', payload)
    payload.members.forEach((item, index) => {
      // Think I will put sleep or something here ;P
      httpCli.put(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${payload.maillist}/${item.uid}`)
      .then(response => {
        if(response && response.status == 200) {
          console.info(`[Invoke API] PUT: /maillists/{maillist}/{user}, http code: ${response.status}`)
          console.log(`Add ${item.uid} to ${payload.maillist} success`)
        }
      })
      // Refactor later
      // 如果出现错误，可能选择删除maillist
      .catch(error => { console.log(error) })
    })
  },
  removeUserFromMaillist({commit}, data) {
    commit('REMOVE_MAILLIST_MEMBER', data)
    httpCli.delete(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${data.maillist}/${data.uid}`)
    .then(response => {
      if (response && response.status == 200) {
        console.info(`[Invoke API] DELETE: /maillists/{maillist}/{user}, http code: ${response.status}`)
        this.dispatch('notify', {msg: response.data.detail, color: "success"}, { root: true })
      }
    })
    .catch(error => { reject(error) })
  },
  loadMaillistMember({commit}, maillist) {
    httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${maillist}/member`)
    .then(response => {
      commit('SET_MAILLIST_MEMBER', {maillist: maillist, members: response.data})
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
  LOADING (state) {
    state.loading = !state.loading
  },
  LOAD_MAILLISTS(state, maillists){
    state.maillists = maillists 
  },
  SET_MAILLIST_MEMBER(state, payload) {
    // payload = {
    //   maillist: "xxx_group",
    //   members: [],
    // }
    // "members"要跟RESTful API匹配

    // 将新增成员添加到现有成员
    let arr = state.maillists[payload.maillist].members.concat(payload.members)
    Vue.set(state.maillists[payload.maillist], "members", arr)
  },
  REMOVE_MAILLIST_MEMBER(state, payload) {
    // payload = {
    //   maillist: "xxx_group",
    //   uid: "User ID",
    // }
    let current = state.maillists[payload.maillist].members
    current.splice(current.findIndex(item => item.uid === payload.uid), 1)
  },
  CREATE_MAILLIST(state, payload) {
    // payload = {
    //   key: "",
    //   data: {},
    // }
    Vue.set(state.maillists, payload.key, payload.data)
  },
  UPDATE_MAILLIST(state, data) {
    // data = {
    //   maillist: "xxx_group",
    //   cn: "xxx_group cn",
    // }
    // only update "cn"
    state.maillists[data.maillist].cn = data.cn
  },
  DELETE_MAILLIST(state, maillist) {
    // 使用Vue.delete()保证DOM触发更新
    Vue.delete(state.maillists, maillist) 
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}