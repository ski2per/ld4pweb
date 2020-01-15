<template>
  <v-container>
    <h3>当前组用户({{members.length}})</h3>
      <template v-if="!members.length">
        <v-progress-circular v-if="loading"
          indeterminate
          color="green"
        ></v-progress-circular>
      </template>
      <!--Will use CSS later-->
      <v-list dense style="max-height: 200px" class="overflow-y-auto">
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
  name: 'SubgroupMembers',
  data () {
    return {
      loading: false
    }
  }, //data()
  props: {
    group: "",
    subgroup: "",
  },
  computed: {
    members: function() {
      console.log("rick")
      return this.$store.getters['grp/subgroupMembers']({group: this.group, subgroup: this.subgroup})
    } 
  },
  mounted() {
    console.log("mmmmmm")
  },
  created() {
    console.log('==================')
    console.log(`members:${this.members}`)
    if (!this.members.length) {
      console.log('No subgroup member in Vuex, load from API')
      this.loading = true
      this.$store.dispatch('grp/loadSubgroupMembers', {group: this.group, subgroup: this.subgroup})
      .then(response => {
        this.loading = false
      })
    }
  },
  methods: {
    removeItem(item) {
      // this.$store.dispatch('mlst/removeUserFromMaillist', {maillist: this.maillistName, uid: item.uid})
    },
    selectItem(selectedList) {
      // 向MLEditDialog发送selected事件，并传递当前选中用户列表
      // this.$emit('selected', selectedList)
    },
  }, //method()
}
</script>

<style scoped>
.v-progress-circular {
  margin: 6rem;
}
</style>
