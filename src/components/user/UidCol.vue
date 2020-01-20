<template>
<td v-bind:class="classObject">
  <v-icon v-if="isAdmin">mdi-account-supervisor</v-icon>
  {{ this.user.uid }}
</td>
</template>

<script>
export default {
  props: {
    user: Object
  },
  computed: {
    classObject: function() {
      if(this.user.accountStatus === "active") {
        return ""
      } else {
        return "banned"
      }
    },
    isAdmin: function() {
      if(this.user.domainGlobalAdmin && this.user.domainGlobalAdmin == 'yes') {
        return true
      } else {
        return false
      }
    }
  },  
  created() {
  },

}
</script>

<style scoped>
.banned {
  text-decoration-line: line-through;
  text-decoration-color: red;
  text-decoration-style: double;
}
</style>