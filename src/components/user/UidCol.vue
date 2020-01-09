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
    console.log(this.user)
    console.log(this.classObject)
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