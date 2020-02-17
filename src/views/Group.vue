<template>
  <v-container justify="start">
    <group-content/>
  </v-container>
</template>

<script>
import GroupContent from '@/components/group/GroupCardContainer.vue'

export default {
  name: 'Group',
  components: {
    'group-content': GroupContent
  }
}
</script>