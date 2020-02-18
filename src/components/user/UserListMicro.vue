<template>
  <v-container class="pa-0">
    <h3>当前邮件组用户({{members.length}})</h3>
    <v-list v-if="!members.length">
      <v-row justify="center">
        <v-progress-circular class="mt-12"
          width="2"
          color="green darken-2"
          indeterminate
        >
        </v-progress-circular>
      </v-row>
    </v-list>
    <!--Will use CSS later-->
    <v-list v-else dense style="max-height: 200px" class="overflow-y-auto">
      <v-list-item-group color="green">
        <v-list-item
          v-for="(item, idx) in members"
          :key="idx"
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
      maillistName: "",
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
<!--
<style scoped>
.v-progress-circular {
   margin: 6rem;
}
</style>
-->