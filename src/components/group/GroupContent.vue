<template>
<v-container fluid>
  <v-row col="12" justify="end">
          <v-btn small color="green" fab dark @click="handleCreateGroup">
          <v-icon>mdi-account-multiple-plus</v-icon>
        </v-btn>
  </v-row>
  <v-row col="12" alignment="start" justify="start">
    <v-col v-for="(group, cardIdx) in groups" v-bind:key="cardIdx">
      <group-card v-bind:group="group" v-on:editSubgroup="handleEditSubgroupEvent($event)">
      </group-card>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import GroupCard from '@/components/group/GroupCard.vue'

export default {
  name: 'GroupCard',
  components: {
    "group-card": GroupCard
  },
  computed: {
    groups() {
      return this.$store.state.grp.groups
    }
  },
  methods: {
    handleCreateGroup: function(){
      this.$store.dispatch("grp/preCreateGroup")
    },
    handleEditSubgroupEvent(payload){
      console.log(payload.group)
      console.log(payload.subgroup)
    }
  },
}
</script>
