<template>
<td v-bind:class="classObject">
  {{ this.user.uid }}
</td>
</template>

<script>
export default {
  props: {
    user: Object
  },
  computed: {
    classObject: function () {
      if(this.user.accountStatus === "active") {
        return ""
      } else {
        return "banned"
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