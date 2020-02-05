<template>
<v-app>
  <nav-menu v-if="isLoggedIn"></nav-menu>

  <v-content transition="slide-x-transition">
    <router-view></router-view>
    <my-noti></my-noti>
  </v-content>
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
    isLoggedIn : function(){ return this.$store.getters.isLoggedIn },
  },
}
</script>
