<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    permanent
    width="160"
    floating
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
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :to="item.link"
        link
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
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
        items: [
          { title: 'User', icon: 'mdi-account', link: '/user'},
          { title: 'Group', icon: 'mdi-account-group', link: '/group'},
          { title: 'Ted', icon: 'mdi-help-box', link: '/ted' },
        ],
        right: null,
      }
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
    },
  }
</script>