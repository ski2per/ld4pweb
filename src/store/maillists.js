import Vue from 'vue'
import httpCli from '@/assets/js/http'
import { stat } from 'fs'

const state = {
  maillists: Object,
}

const getters = {
  // return values in "maillists"
  // maillistArr: (state) => () => {
  maillistArr: state => {
    return Object.values(state.maillists)
  },
  maillistMember: (state) => (mlst) => {
    // "members" 跟RESTful API返回值要匹配
    // How to use:
    // this.$store.getters['mlst/maillistMember'](this.maillistName)
    return state.maillists[mlst].members
  },
}

const actions = {
  loadMaillists({commit}) {
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/`)
      .then(response => {
        commit('LOAD_MAILLISTS', response.data)
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
  createMaillist({commit}, data) {
    console.debug(data)
    let key = data.mail + '_group'
    let mlMail = key + '@cetcxl.com'
    let newCN = ""
    if (!data.cn ) {
      newCN = key
    } else {
      newCN = data.cn
    }
    let newData = {
      ...data,
      mail: mlMail,
      cn: newCN,
    }
    console.log(newData)
    console.log(data)
    commit("CREATE_MAILLIST", {key: key, data: newData})
    // httpCli.post(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${data.mail}`, data)
    // .then(response => {
    //   console.info(`[Invoke API] POST: /maillists/{maillist}, http code: ${response.status}`)
    //   if (response && response.status == 200) {
    //     this.dispatch('notify', {msg: response.data.detail, color: "success"}, { root: true })
    //     // Then try to add members
    //     if (data.members.length) {
    //       console.debug('try to add members')
    //       data.members.forEach((item, index) => {
    //         console.debug(item)
    //         // const currentML = this.editedItem.cn
    
    //         // Think I will put sleep or something here ;P
    //         // this.$store.dispatch('mlst/addUser2Maillist', {maillist: this.editedItem.mail, uid: item.uid})
    //         // .then(response => {
    //         //   if(response && response.status == 200) {
    //         //     console.log(`Add ${item.uid} to ${currentML} success`)
    //         //   }
    //         // })
    //         // .catch(error => { console.log(error) })
    //       })
    //     }
    //   }
    // })
    // .catch(error => {console.error(error)})
  },
  deleteMaillist({commit}, maillist) {
    commit("DELETE_MAILLIST", maillist)
      httpCli.delete(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${maillist}`)
      .then(response => {
        console.info(`[Invoke API] DELETE: /maillists/{maillist}, http code: ${response.status}`)
        if (response && response.status == 200) {
          this.dispatch('notify', {msg: response.data.detail, color: "success"}, { root: true })
        }
      })
      .catch(error => { reject(error) })
  },
  updateMaillist({commit}, data) {
    commit('UPDATE_MAILLIST', data)
    httpCli.put(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${data.maillist}`, data)
    .then(response => { 
      console.info(`[Invoke API] PUT: /maillists/{maillist}, http code: ${response.status}`)
      if (response && response.status == 200) {
        this.dispatch('notify', {msg: `${data.cn} 已更新 `, color: "success"}, { root: true })
      }
    })
    .catch(error => { console.log(error) })
  },
  // addUser2Maillist({commit}, data) {
  //   return new Promise((resolve, reject) => {
  //     httpCli.put(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${data.maillist}/${data.uid}`)
  //     .then(response => { resolve(response) })
  //     .catch(error => { reject(error) })
  //   })
  // },
  removeUserFromMaillist({commit}, data) {
    return new Promise((resolve, reject) => {
      httpCli.delete(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${data.maillist}/${data.uid}`)
      .then(response => { resolve(response) })
      .catch(error => { reject(error) })
    })
  },
  loadMaillistMember({commit}, maillist) {
    return new Promise((resolve, reject) => {
      httpCli.get(`${process.env.VUE_APP_API_HOST}/${process.env.VUE_APP_API_PATH}/maillists/${maillist}/member`)
      .then(response => {
        commit('SET_MAILLIST_MEMBER', {maillist: maillist, members: response.data})
        resolve(response)
      })
      .catch(error => { reject(error) })
    })
  },
}

const mutations = {
  LOAD_MAILLISTS(state, maillists){
    state.maillists = maillists 
  },
  SET_MAILLIST_MEMBER(state, payload) {
    // payload = {
    //   maillist: "xxx_group",
    //   members: [],
    // }
    // "members"要跟RESTful API匹配
    state.maillists[payload.maillist].members = payload.members
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