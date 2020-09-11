<template>
    <v-layout row justify-center>
      <v-toolbar color="green darken-2" class="hidden-xs-only">
        <v-toolbar-title>Desktop Menu</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
         <v-btn
           v-for="(item, index) in items"
           :key="index"
           :to="item.link"
           :title="item.title"
           text
           x-large
           color="white"
         >
         {{item.title}}
         </v-btn>
        <v-btn icon color="#000000" @click="logout" >
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" medium class="mx-0">mdi-exit-run</v-icon>
            </template>
            <span>退出登录</span>
          </v-tooltip>
        </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      
      <v-toolbar dark color="green darken-2" class="hidden-sm-and-up">
        <v-toolbar-title>Mobile Menu</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon @click.stop="dialog = true">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-toolbar-items>

        <v-dialog v-model="dialog" transition="dialog-right-transition">
          abc
        </v-dialog>
      </v-toolbar>
      
    </v-layout>
</template>

<script>
  export default {
    name: 'Menu',
    data () {
      return {
        dialog: false,
        drawer: true,
        // mini: true,
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
        tmp = this.$vuetify.breakpoint.mdAndDown;
        console.log(tmp);
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