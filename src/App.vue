<template>
<v-app>
  <nav-menu v-if="isLoggedIn"></nav-menu>
  
  <v-main>
    <router-view></router-view>
    <my-noti></my-noti>
  </v-main>
</v-app>
</template>

<script>
import Menu from '@/components/Menu.vue'
import Notification from "@/components/Notification.vue"

export default {
  name: 'App',
  components: {
    'nav-menu': Menu,
    'my-noti': Notification
  },
  computed: {
    isLoggedIn : function() {
      if(this.$route.name == 'ml') {
        return false
      }
      return this.$store.getters.isLoggedIn
    },
  },
}
</script>
