<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    permanent
    width="160"
    v-if="isLoggedIn"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          LDAP Menu
        </v-list-item-title>
        <v-list-item-subtitle>
          Winter is coming ~
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav >
      <!-- User -->
      <v-list-item link to="/user" v-if="isAdmin">
        <v-list-item-icon>
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>User</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- Group -->
      <v-list-item link to="/group" v-if="isAdmin">
        <v-list-item-icon>
          <v-icon>mdi-account-group</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Group</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- About me -->
      <v-list-item link to="/aboutme">
        <v-list-item-icon>
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>About Me</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

    </v-list>

    <template v-slot:append>
      <div class="pa-4">
        <v-btn block @click="logout" class="success">Logout</v-btn>
      </div>
    </template>

  </v-navigation-drawer>
</template>

<script>
  export default {
    name: 'Menu',
    data () {
      return {
        drawer: true,
        //items: [
        //  { title: 'User', icon: 'mdi-account', link: '/user'},
        //  { title: 'Group', icon: 'mdi-account-group', link: '/group'},
        //  { title: 'About Me', icon: 'mdi-account-group', link: '/aboutme'},
        //],
        right: null,
      }
    },
    computed : {
      isLoggedIn : function(){ return this.$store.getters.isLoggedIn },
      isAdmin: function() { return this.$store.getters.isAdmin },

    },
    methods: {
      logout: function () {
        this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
      }
    },
  }
</script>