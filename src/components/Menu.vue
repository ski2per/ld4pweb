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
      }
    },
    mounted() {
      console.log("Menu.vue mounted, get menu content") 
      this.$http.get(`${process.env.VUE_APP_API_URL}/api/v1/auth/menu`)
      .then(response => {
        if(response && response.status == 200) {
          console.log(response.data)
          this.items = response.data
        }
      })
      .catch(error => {
        console.log(error)
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