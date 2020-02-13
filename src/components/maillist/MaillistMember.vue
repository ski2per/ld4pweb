<template>
  <v-container class="mx-0 px-0">
    <v-row >
      <v-col cols="1" xs="12" v-for="(member, idx) in members" :key="idx">
        {{member.cn}}
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'MaillistMember',
  data () {
    return {
      maillistName: "",
    }
  }, //data()
  props: {
    maillist: ""
  },
  computed: {
    members: function(){
      return this.$store.getters['mlst/maillistMember'](this.maillistName)
    } 
  },
  created: function() {
    this.maillistName = this.maillist.split('@')[0]
    if (!this.members.length) {
      console.log('No maillist member in Vuex, load from API')
      this.$store.dispatch('mlst/loadMaillistMember', this.maillistName)
    }
  },
  
}
</script>