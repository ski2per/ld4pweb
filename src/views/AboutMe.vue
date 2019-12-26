<template>
  <v-container justify="start">
    <v-row>
      <v-col cols="2">
        <v-subheader>test</v-subheader>
      </v-col>
      <v-col cols="4">
        <v-text-field :value="this.uid" readonly solo></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4">
        <password-update></password-update>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PasswordUpdate from '@/components/PasswordUpdate.vue'

export default {
  name: 'About',
  data () {
    return {
      uid: "",
      cn: "",
      mail: "",
    }
  },
  components: {
    'password-update': PasswordUpdate
  },
  created() {
    this.$store.dispatch('user/getMyInfo')
    .then(response => {
      if(response && response.status == 200) {
        console.log(response.data)
        this.uid = response.data.uid
      }
    })
    .catch(error => {
      console.log(error)
    })
  },

}
</script>
