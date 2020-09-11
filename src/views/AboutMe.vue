<template>
  <!--<v-container justify="start">-->
  <v-container>
    <v-row>
      <v-col :cols="colWidth">
        <v-card>
          <v-card-title><h4>{{ me.cn }}</h4></v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="4" align="start" class="py-0 green-text">用户ID:</v-col>
              <v-col cols="auto" class="py-0">{{me.uid}}</v-col>
            </v-row>
            <v-row>
              <v-col cols="4" align="start" class="py-0 green-text">邮箱:</v-col>
              <v-col cols="auto" class="py-0">{{ me.mail }}</v-col>
            </v-row>
            <v-row v-if="me.shadowAddress">
              <v-col cols="4" align="start" class="py-0 green-text">邮箱别名:</v-col>
              <v-col cols="auto" class="py-0">{{ me.shadowAddress}}</v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text v-if="me.memberof && me.memberof.length">
            <v-card-subtitle class="pa-0" style="color: green;">
              所在用户组：
            </v-card-subtitle>
            <v-list dense>
              <v-list-item v-for="(member, idx) in me.memberof" :key="idx">
                {{member.pgroup}} / {{member.group}}
              </v-list-item>
            </v-list>
          </v-card-text>

        </v-card>
      </v-col>

      <v-col :cols="colWidth">
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
      return this.$store.state.usr.me;
    },
    colWidth: function () {
      if (this.$vuetify.breakpoint.name === 'xs') {
        return 12;
      } else {
        return 4;
      }
    },
    // infoColWidth: function () {
    //   if (this.$vuetify.breakpoint.name === 'xs') {}
    // }

  },
  components: {
    'password-update': PasswordUpdate
  },
}
</script>

<style scoped>
.green-text {
  color: green;
}
</style>
