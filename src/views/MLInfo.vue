<template>
<v-container fluid>
  <v-container v-if="!allMaillists.length">
    加载中...
  </v-container>
  <v-list>
    <v-list-item v-for="(maillist, idx) in allMaillists" :key="idx">
      <v-list-item-content>
        <v-list-item-title style="font-size: 1.5em;">{{maillist.cn}}</v-list-item-title>
        <v-list-item-subtitle style="color: #388E3C;">{{maillist.mail}}</v-list-item-subtitle>
        <maillist-member v-if="! (maillist.mail == 'all_group@cetcxl.com')" :maillist="maillist.mail"></maillist-member>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import MaillistMember from '@/components/maillist/MaillistMember.vue'

export default {
  components: {
    'maillist-member': MaillistMember
  },
  data: function() {
    return {
      maillistInfo: [],
    }
  },
  computed: {
    ...mapGetters({
      allMaillists: 'mlst/allMaillists',
    })
  },
  created: function () {
    // 浏览器未检测到用户登录时重新加邮件列表
    if(!this.$store.getters.isLoggedIn) {
      this.$store.dispatch('mlst/loadMaillists')
      .catch(error => {
        this.allMaillists = ['加载邮件列表信息出错🤷']
        console.log(error)
      })
    }
  },
}
</script>

<style scoped>
.green-text {
  color: green;
}
</style>
