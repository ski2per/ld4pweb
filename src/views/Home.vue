<template>
  <v-card
    height="400"
    width="256"
    class="mx-auto"
  >
    <v-navigation-drawer permanent>
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

      <v-list
        dense
        nav
      >
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
    </v-navigation-drawer>
  </v-card>
</template>


<script>
  export default {
    data () {
      return {
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
  }
</script>