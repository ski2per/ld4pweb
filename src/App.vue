<template>
<v-app>
  <nav-menu v-if="isLoggedIn"></nav-menu>

  <v-content transition="slide-x-transition">
    <router-view></router-view>
    <my-info></my-info>
  </v-content>
</v-app>
</template>

<script>
import Menu from '@/components/Menu.vue'
import Info from "@/components/Info.vue"

export default {
  name: 'App',
  components: {
    'nav-menu': Menu,
    'my-info': Info
  },
  created () {
  //   this.$axios.interceptors.response.use(undefined, function (err) {
  //     return new Promise(function (resolve, reject) {
  //       if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
  //         this.$store.dispatch(logout)
  //       }
  //       throw err;
  //     });
  //   });
    console.log('[App.vue: created()]')
  },
  computed: {
    isLoggedIn : function(){ return this.$store.getters.isLoggedIn },
  },
  methods: {
    logout: function () {
      this.$store.dispatch('logout')
      .then(() => {
        this.$router.push('/login')
      })
    }
  }
}
</script>
