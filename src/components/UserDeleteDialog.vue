<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <v-card>
      <v-card-title class="headline">Delete User ?</v-card-title>
      <v-card-text start="end">{{ user2delete }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="deleteItem">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      user: Object,
    }
  },
  computed: {
    user2delete () {
      return this.user.cn
    }
  },
  methods: {
    close () {
      this.dialog = false
    },
    deleteItem () {
      console.log(`[UserDeleteDialog.vue]: will delete ${this.user.displayName}`)
      const uid = this.user.uid

      const info = { msg: "", color: "" } 
      this.$store.dispatch('deleteUser', uid)
      .then(response => {
        if(response && response.status == 200) {
          console.log(response.data)
          info.msg = response.data.detail
          info.color = "success"
          // Dispatch store/users.js中的加载用户action, 重新加载用户
          this.$store.dispatch('ldapusers/loadUsers')
        } else {
          info.msg = response.data.detail
          info.color = "error"
        }
        this.$store.dispatch("showInfo", info)
      })
      .catch(error => {
        // Also need to refactor
        info.color = "error"
        if (error.response) {
          info.msg = error.response.data.detail
        } else {
          info.msg = "Unknown server error"
        }
        this.$store.dispatch('showInfo', info)
      })
      .finally(() => {
        this.dialog = false
      })
    },
  },
}
</script>