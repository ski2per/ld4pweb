<template>
<v-card
  class="mx-auto"
  min-width="360"
  max-width="360"
>
  <v-card-title>{{ this.group.ou }}</v-card-title>
  <v-card-subtitle>{{ this.group.description}}</v-card-subtitle>
  <v-card-actions>
    <v-btn text color="green">编辑</v-btn>
          <v-spacer></v-spacer>

      <v-btn icon
        @click="showSubGroup()"
      >
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          <v-list>
            <v-btn text color="red" v-if="this.showDel">删除</v-btn>

            <subgroup v-for="sg in this.group.subgroups" :subgroup="sg"></subgroup>
          </v-list>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card-actions>
</v-card>
</template>

<script>
import Vue from 'vue'
import Subgroup from '@/components/group/Subgroup.vue'

export default {
  data: () => ({
    show: false,
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
      this.show = !this.show

      // Only load subgroup when expanding
      if(this.show) {
        console.log('loading subgroup')
        this.$store.dispatch('grp/loadSubgroup', this.group.ou)
        .then(response => {
          Vue.set(this.group, "subgroups", response.data)
          this.showDel = !this.isSubgroup
        })
        .catch(error => {console.log(error)})
      }
    }
  },
}
</script>