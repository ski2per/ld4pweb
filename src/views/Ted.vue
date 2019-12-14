<template>
<v-container fluid>
  <div class="ted">
    <h1>{{ msg }}</h1>
    <input v-model="msg">
    <p>
      <button v-on:click="reverseMsg"> Reverse Message</button>
    </p>
  </div>
  </div>
</v-container>
</template>

<script>
export default {
  name: 'Ted',
  data () {
    return {
      msg: 'Hello Ted !'
    }
  },
  methods: {
    reverseMsg: function () {
      this.msg = this.msg.split('').reverse().join('')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
