<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text start="end">{{ userInAction }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="close">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="action2Item">OK</v-btn>
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
      action: "",
    }
  },
  computed: {
    title () {
      switch(this.action) {
        case "delete":
          return "删除用户？";
          break;
        case "lock":
          return "锁定用户？";
          break;
        default:
          return "重置密码？"
      }
    },
    userInAction() {
      return this.user.cn
    }
  },
  methods: {
    close () {
      this.dialog = false
    },
    deleteItem () {

      const info = { msg: "", color: "" } 
    },
    action2Item () {
      const uid = this.user.uid
      const info = { msg: "", color: "" } 

      switch(this.action) {
        case "delete":
          this.$store.dispatch('usr/deleteUser', uid)
          this.dialog = false
          break;
        case "lock":
          console.log(`will lock ${this.user.cn}`);
          break;
        default:
          console.log(`will reset ${this.user.cn}`);
          this.dialog = false
      }
    }
  },
}
</script>