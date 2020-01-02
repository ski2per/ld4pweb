<template>
  <v-navigation-drawer
    app
    permanent
    width="200"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          LDAP Menu
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ version }}
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
        <v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-icon>
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
        items: [],
        version: process.env.VUE_APP_VERSION,
      }
    },
    mounted() {
      console.log("Menu.vue mounted, get menu content") 
      // console.log(process.env.VUE_APP_VERSION)
      // console.log(process.env.VUE_APP_API_URL)
      console.log(`isAdmin: ${this.$store.getters.isAdmin}`)
      this.$store.dispatch('getMenu')
      .then(response => {
        if(response && response.status == 200) {
          this.items = response.data

          if (this.$store.getters.isAdmin) {
            // Load users
            this.$store.dispatch('lu/loadUsers')
            this.$store.dispatch('lg/loadGroupTree')
            this.$store.dispatch('lg/loadGroups')
            this.$store.dispatch('lm/loadMaillists')
          }
        } else {
          console.log(response)
        }
      })
      .catch(error => {
        console.log(error)
        this.logout()
      })
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