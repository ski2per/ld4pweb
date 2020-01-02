<template>
  <v-container>
    <h3>当前邮件组用户</h3>
      <template v-if="!members.length">
        <h4>无</h4>
      </template>
      <!--Will use CSS later-->
      <v-list dense style="max-height: 200px" class="overflow-y-auto">
        <v-list-item-group color="green">
          <v-list-item
            v-for="(item, i) in members"
            :key="i"
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.cn" inactive></v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon @click="removeItem(item)">mdi-minus-circle-outline</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-item-group>
      </v-list>
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
    this.maillistName = this.maillist.split('@')[0]
    this.loadMember()
  },
  methods: {
    removeItem(item) {
      this.$store.dispatch('lm/removeUserFromMaillist', {maillist: this.maillistName, uid: item.uid})
      .then(response => {
        if(response && response.status == 200) {
          this.$store.dispatch('notify', {msg: response.data.detail, color: "success"})
        }
      })
      .catch(error => {console.log(error)})
      .finally(() => {
        this.loadMember()
      })
    },
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
