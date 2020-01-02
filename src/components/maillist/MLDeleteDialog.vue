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
      console.log(`[MLDeleteDialog.vue]: will delete ${this.ml2delete}`)

      const info = { msg: "", color: "" }
      const maillistName = this.maillist.mail.split('@')[0]
      this.$store.dispatch('lm/deleteMaillist', maillistName)
      .then(response => {
        if(response && response.status == 200) {
          console.log(response.data)
          info.msg = response.data.detail
          info.color = "success"
          // 重新加载邮件列表
          this.$store.dispatch('lm/loadMaillists')
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