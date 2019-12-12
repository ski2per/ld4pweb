<template>
  <div>
    <h3>{{$store.state.count}}</h3>
    <div>
      <button @click="handlePlusClick(10)">+</button>
      <button @click="handleMinusClick(10)">-</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Foo',
  methods: {
    handlePlusClick(n) {
      this.$store.commit('mutationsPlus', n);
    },
    handleMinusClick(n) {
      this.$store.commit('mutationsMinus', n);
    }
  }
}
</script>
