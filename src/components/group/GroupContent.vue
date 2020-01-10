<template>
<v-container fluid>
  <v-row col="12" justify="end">
          <v-btn small color="green" fab dark @click="handleCreate">
          <v-icon>mdi-account-multiple-plus</v-icon>
        </v-btn>
  </v-row>
  <v-row col="12" alignment="start" justify="start">
    <v-col v-for="group in groups">
      <group-card v-bind:group="group">
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
}
</script>
