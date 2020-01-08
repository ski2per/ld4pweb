<template>
<td>
  hehe
</td>
</template>
<script>
export default {
  props: {
    user: Object
  },
  mounted() {
    console.log("sucker")
  },
  created() {
    console.log("fuck")
    console.log(this.user)
  },

}
</script