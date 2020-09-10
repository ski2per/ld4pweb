<template>
  <v-container class="mx-0 px-0">
    <v-row align="center"  justify="start" v-if="!members.length">
      <v-progress-circular class="ml-6"
        width="2"
        color="green darken-2"
        indeterminate
      >
      </v-progress-circular>
    </v-row>
    <v-row  justify="start" >
      <!-- Use 'cols' instead of 'xs' -->
      <v-col cols="6" sm="3" md="2" lg="2" xl="1"
        v-for="(member, idx) in members" :key="idx">
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
      loading: false,
    }
  }, //data()
  props: {
    maillist: ""
  },
  computed: {
    members: function() {
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