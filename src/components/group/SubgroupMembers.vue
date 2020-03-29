<template>
  <v-container class="pa-0">
    <h3>当前组用户({{members.length}})</h3>
    <v-list v-if="!members.length">
      <v-row justify="center">
        <v-progress-circular  
          class="mt-12"
          width="2"
          indeterminate
          color="green"
        >
        </v-progress-circular>
      </v-row>
    </v-list>
    <!--Will use CSS later-->
    <v-list v-else dense style="max-height: 500px" class="overflow-y-auto">
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
      // loading: false,
    }
  }, //data()
  props: {
    group: "",
    subgroup: "",
  },
  computed: {
    members: function() {
      console.log(`SubgroupMembers.vue: members()`)
      return this.$store.getters['grp/subgroupMembers']({group: this.group, subgroup: this.subgroup})
    } 
  },
  created() {
    if (this.members.length == 0) {
      console.log('No subgroup member in Vuex, load from API')
      this.$store.dispatch('grp/loadSubgroupMembers', {group: this.group, subgroup: this.subgroup})
    }
  },
  methods: {
    removeItem(item) {
      console.log(`will remove ${item.uid}`)
      let payload = {
        group: this.group,
        subgroup: this.subgroup,
        member: item.uid
      }
      this.$store.dispatch('grp/deleteSubgroupMember', payload)
    },
    selectItem(selectedList) {
      // 向MLEditDialog发送selected事件，并传递当前选中用户列表
      // this.$emit('selected', selectedList)
    },
  }, //method()
}
</script>