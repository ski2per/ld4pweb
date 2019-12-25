<template>
  <v-container justify="start">
  about me
    <password-update></password-update>
  </v-container>
</template>

<script>
import PasswordUpdate from '@/components/PasswordUpdate.vue'

export default {
  name: 'About',
  components: {
    'password-update': PasswordUpdate
  }
}
</script>
