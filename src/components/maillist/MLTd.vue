<template>
  <td v-if="edited">
    <v-text-field
      solo
      autofocus
      v-model="maillist.cn"
      @blur="update"
      ></v-text-field>
  </td>
  <td v-else @click="edit">
    {{maillist.cn}}
  </td>
</template>

<script>
export default {
  data: function() {
    return {
      edited: false,
      lastCN: "",
    }
  },
  props: {
    maillist: Object,
  },
  methods: {
    edit: function() {
      console.log(this.maillist)
      this.edited = true
      this.lastCN = this.maillist.cn
    },
    update: function() {
      this.edited = false
      const maillistName = this.maillist.mail.split('@')[0]
      console.log(this.maillist)
      if(this.lastCN != this.maillist.cn) {
        this.$store.dispatch('mlst/updateMaillist', {maillist: maillistName, cn: this.editedItem.cn})
      }
    }

  }
}
</script>