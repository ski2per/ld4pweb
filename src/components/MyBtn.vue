<template>
  <button @click="btnClickEvent">
    <span>{{msg}}</span>
  </button>
</template>

<script>
export default {
  props: {
    msg: {
      default: 'Click Me'
    }
  },
  methods: {
    btnClickEvent: function () {
      alert(this.msg)
      this.$emit('btnClickEvent')
    }
  }
}
</script>
