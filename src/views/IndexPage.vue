<template>
  <div class="hello">
    <p>{{ msg }}<p>
    <h2>导航</h2>
      <ul>
        <li><router-link to="/ted">Ted</router-link></li>
        <li><router-link to="/btn">Button</router-link></li>
        <li><router-link to="/todo">Todo</router-link></li>
      </ul>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      msg: "Winter is coming ~"
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
