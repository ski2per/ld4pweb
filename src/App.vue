<template>
<v-app>
  <nav-menu />

  <v-content transition="slide-x-transition">
    <router-view></router-view>
  </v-content>
</v-app>
</template>

<script>
import Menu from '@/components/Menu.vue'

export default {
  name: 'App',
  components: {
    'nav-menu': Menu
  },
  created () {
    console.log('[App.vue]')
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function (resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch(logout)
        }
        throw err;
      });
    });
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
