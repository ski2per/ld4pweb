<template>
  <!--<v-container justify="start">-->
  <v-container >
    <v-row>
      <v-col cols="4">
      <v-card min-width="400">
        <v-card-title><h4>{{ me.cn }}</h4></v-card-title>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-item>
            <v-list-item-content>用户ID:</v-list-item-content>
            <v-list-item-content>{{ me.uid }}</v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>邮箱:</v-list-item-content>
            <v-list-item-content>{{ me.mail }}</v-list-item-content>
          </v-list-item>

          <v-list-item v-if="me.shadowAddress">
            <v-list-item-content>邮箱别名:</v-list-item-content>
            <v-list-item-content>{{ me.shadowAddress}}</v-list-item-content>
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
  computed: {
    me: function () {
      return this.$store.state.usr.me
    }
  },
  components: {
    'password-update': PasswordUpdate
  },
}
</script>
