<template>
  <v-container justify="start">
    <user-list />
  </v-container>
</template>

<script>
import UserList from '@/components/user/UserList.vue'

export default {
  name: 'User',
  components: {
    'user-list': UserList
  }
}
</script>