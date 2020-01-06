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
      // members: [],
      maillistName: ""
    }
  }, //data()
  props: {
    maillist: ""
  },
  computed: {
    members: function(){
      return this.$store.getters['mlst/maillistMember'](this.maillistName)
    } 
  },
  created() {
    this.maillistName = this.maillist.split('@')[0]

    if (!this.members.length) {
      console.log('No maillist member in Vuex, load from API')
      this.$store.dispatch('mlst/loadMaillistMember', this.maillistName)
    }
  },
  methods: {
    removeItem(item) {
      this.$store.dispatch('mlst/removeUserFromMaillist', {maillist: this.maillistName, uid: item.uid})
    },
    selectItem(selectedList) {
      // 向MLEditDialog发送selected事件，并传递当前选中用户列表
      this.$emit('selected', selectedList)
    },
  }, //method()
}
</script>
