<template>
  <v-app>
    <v-content transition="slide-x-transition">
      <router-view></router-view>
    </v-content>
  </v-app>
  <!--
  <div id="app">
    <div id="nav">
      <span v-if="isLoggedIn"> <a @click="logout">Logout</a></span>
    </div>
  </div>
  -->
</template>

<script>
export default {
  name: 'App',
  created: function () {
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function (resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch(logout)
        }
        throw err;
      });
    });
  },
  computed : {
    isLoggedIn : function(){ return this.$store.getters.isLoggedIn}
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
