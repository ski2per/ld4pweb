<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <v-card>
      <v-card-title class="headline">删除邮件组?</v-card-title>
      <v-card-text start="end">{{ ml2delete }}</v-card-text>
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
      maillist: Object,
    }
  },
  computed: {
    ml2delete () {
      // 如果邮件列表的cn未定义，则返回mail
      if (this.maillist.cn) {
        return this.maillist.cn
      } else {
        return this.maillist.mail
      }
    }
  },
  methods: {
    close () {
      this.dialog = false
    },
    deleteItem () {
      const info = { msg: "", color: "" }
      const maillistName = this.maillist.mail.split('@')[0]
      this.$store.dispatch('mlst/deleteMaillist', maillistName)
      this.dialog = false
    },
  },
}
</script>