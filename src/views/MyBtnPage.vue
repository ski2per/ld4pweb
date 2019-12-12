<template>
  <div>
    <my-btn v-on:btnClickEvent="doSth" msg="hehe"></my-btn>
  </div>
</template>

<script>
import MyBtn from '@/components/MyBtn.vue'
export default {
  name: 'MyBtnPage',
  components: {
    'my-btn': MyBtn
  },
  methods: {
    doSth: function () {
      alert('trigger click: btnClickEvent')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
