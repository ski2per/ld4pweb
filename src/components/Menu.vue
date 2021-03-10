<template>
<v-container class="pa-0">
  <v-navigation-drawer class="hidden-xs-only"
    v-model="drawer"
    app
    color="success"
    hide-overlay
    dark
    permanent
    :mini-variant="mini"
  >
    <!-- expand-on-hover -->
    <v-list-item class="px-2">
      <v-list-item-action>
        <v-btn icon color="#000000" @click="logout" >
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" medium class="mx-0">mdi-exit-run</v-icon>
            </template>
            <span>退出登录</span>
          </v-tooltip>
        </v-btn>
      </v-list-item-action>
      <v-list-item-title>
        统一账号系统
      </v-list-item-title>
      <!-- <v-btn icon @click.stop="mini = !mini">
        <v-icon>mdi-arrow-left-circle-outline</v-icon>
      </v-btn> -->
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav >
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :to="item.link"
        link
      >
        <v-list-item-icon class="mx-0">
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-icon>
          <v-list-item-title style="font-size: 1em;">{{ item.title }}</v-list-item-title>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-menu>
    <template v-slot:activator="{ on }">
      <v-btn
        fab
        fixed
        left 
        small
        bottom
        color="green"
        v-on="on"
        class="hidden-sm-and-up"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        :to="item.link"
      >
        <v-list-item-title>{{item.title}}</v-list-item-title>
      </v-list-item>

      <v-btn text color="warning" @click="logout">
        退出登录
      </v-btn>

    </v-list>
  </v-menu>
</v-container>


</template>

<script>
  export default {
    name: 'Menu',
    data () {
      return {
        drawer: true,
        items: [],
        version: process.env.VUE_APP_VERSION,
      }
    },
    created() {
    // mounted() {
      this.$store.dispatch('getMenu')
      .then(response => {
        if(response && response.status == 200) {
          this.items = response.data
          this.$store.dispatch('usr/loadMyInfo')
          
          //加载管理员数据
          if (this.$store.getters.isAdmin) {
            this.$store.dispatch('grp/loadGroupTree')
            this.$store.dispatch('grp/loadGroups')
            this.$store.dispatch('mlst/loadMaillists')
          }
        } else { console.log(response) }
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
    computed: {
      mini() {
        console.log(this.$vuetify.breakpoint.name);
        console.log(this.$vuetify.breakpoint.mdAndDown);
        return this.$vuetify.breakpoint.mdAndDown;
      }
    }
  }
</script>

<style scoped>
/* .v-list-item-title {
  font-size: 18px;
} */
</style>