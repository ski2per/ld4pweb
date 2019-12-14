<template>
  <v-container justify="start">
    <userlist />
  </v-container>
</template>

<script>
import UserList from '@/components/UserList.vue'

export default {
  name: 'User',
  components: {
    'userlist': UserList
  }
}
</script>