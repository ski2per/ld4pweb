<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    floating
    permanent
    width="200"
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
        <v-btn block @click="logout">Logout</v-btn>
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
          { title: 'User', icon: 'mdi-view-dashboard', link: '/home'},
          { title: 'Group', icon: 'mdi-image' },
          { title: 'Ted', icon: 'mdi-help-box', link: '/ted' },
          { title: 'Btn', icon: 'mdi-help-box', link: '/btn' },
          { title: 'Todo', icon: 'mdi-help-box', link: '/todo' },
        ],
        right: null,
      }
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