<template>
  <v-container justify="start">
    <group-list />
  </v-container>
</template>

<script>
import GroupList from '@/components/group/GroupList.vue'

export default {
  name: 'Group',
  components: {
    'group-list': GroupList
  }
}
</script>