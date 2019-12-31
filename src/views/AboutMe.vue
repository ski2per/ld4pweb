<template>
  <!--<v-container justify="start">-->
  <v-container >
    <v-row>
      <v-col cols="4">
      <v-card min-width="400">
        <v-card-title><h4>{{ cn }}</h4></v-card-title>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-item>
            <v-list-item-content>用户ID:</v-list-item-content>
            <v-list-item-content>{{ uid }}</v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>邮箱:</v-list-item-content>
            <v-list-item-content>{{ mail }}</v-list-item-content>
          </v-list-item>

          <v-list-item v-if="alias">
            <v-list-item-content>邮箱别名:</v-list-item-content>
            <v-list-item-content>{{ alias }}</v-list-item-content>
          </v-list-item>

        </v-list>
      </v-card>
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
      alias: "",
    }
  },
  components: {
    'password-update': PasswordUpdate
  },
  created() {
    this.$store.dispatch('lu/getMyInfo')
    .then(response => {
      if(response && response.status == 200) {
        const user = response.data
        console.log(`alias: ${user.shadowAddress}`)
        this.uid = user.uid
        this.cn = user.cn
        this.mail = user.mail
        this.alias = user.shadowAddress
      }
    })
    .catch(error => {
      console.log(error)
    })
  },

}
</script>
