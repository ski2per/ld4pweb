<template>
<v-card
  class="mx-auto"
  min-width="360"
  max-width="360"
>
  <v-card-title>{{ this.group.ou }}</v-card-title>
  <v-card-subtitle>{{ this.group.description}}</v-card-subtitle>

  <v-card-actions>
    <v-tooltip bottom >
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" medium class="mx-0">
          mdi-square-edit-outline
        </v-icon>
      </template>
      <span>编辑</span>
    </v-tooltip>
  
    <v-tooltip bottom v-if="this.expand">
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" medium class="mx-2" color="green">
          mdi-folder-plus
        </v-icon>
      </template>
      <span>添加子组</span>
    </v-tooltip>

    <v-spacer></v-spacer>
    <v-btn icon @click="showSubGroup()" >
        <v-icon>{{ expand? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
    </v-btn>
  </v-card-actions>

  <v-expand-transition>
    <div v-show="expand">
      <v-divider></v-divider>
      <v-card-text>
        <v-list>
          <v-btn text color="red" v-if="!this.isSubgroup">删除</v-btn>
          <subgroup v-for="sg in this.group.subgroups" :subgroup="sg"></subgroup>
        </v-list>
      </v-card-text>
    </div>
  </v-expand-transition>
</v-card>
</template>

<script>
import Vue from 'vue'
import Subgroup from '@/components/group/Subgroup.vue'

export default {
  data: () => ({
    expand: false,
    showDel: false,
  }),
  components: {
    'subgroup': Subgroup
  },
  props: {
    group: Object,
  },
  computed: {
    isSubgroup: function(){
      console.log('compute isSubgroup')
      if(this.group.subgroups) {
        if(this.group.subgroups.length) {
          return true
        }
      }
      return false
    }
  },
  methods: {
    showSubGroup: function(){
      this.expand = !this.expand

      // Only load subgroup when expanding,
      // and subgroups array is empty
      if(this.expand && !this.isSubgroup){
        console.log('[GroupCard]: Loading subgroup')
        this.$store.dispatch('grp/loadSubgroup', this.group.ou)
      }
    }
  },
}
</script>