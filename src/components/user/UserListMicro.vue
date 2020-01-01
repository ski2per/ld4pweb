<template>
  <v-container>
    <h3>当前邮件组用户</h3>
      <template v-if="!members.length">
        <h4>无</h4>
      </template>
      <template v-else>
        <div v-for="item in members" :key="item.cn">
          {{ item.cn}}
        </div>
      </template>
  </v-container>

</template>

<script>

export default {
  name: 'UserListMicro',
  data () {
    return {
      members: [],
      maillistName: ""
    }
  }, //data()
  props: {
    maillist: ""
  },
  created() {
    console.log('[UserListMicro.vue] created')
    this.maillistName = this.maillist.split('@')[0]
    this.loadMember()
  },
  methods: {
    loadMember() {
      this.$store.dispatch('lm/loadMaillistMember', this.maillistName)
      .then(response => {
        if(response && response.status == 200) {
          this.members = response.data
        }
      })
      .catch(error => {
        console.log(error)
      })

    },
    selectItem(selectedList) {
      // 向MLEditDialog发送selected事件，并传递当前选中用户列表
      this.$emit('selected', selectedList)
    },
  }, //method()
}
</script>
