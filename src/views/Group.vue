<template>
  <v-container justify="start">
    <grouplist />
  </v-container>
</template>

<script>
import GroupList from '@/components/GroupList.vue'

export default {
  name: 'Group',
  components: {
    'grouplist': GroupList
  }
}
</script>