<template>
  <v-container justify="start">
    <v-row>
      <v-col>
        <Menu />
      </v-col>
      <v-col>
        abc
      </v-col>

    </v-row>
  </v-container>
</template>


<script>
// @ is an alias to /src
import Menu from '@/components/Menu.vue'

export default {
  name: 'Home',
  components: {
    Menu
  }
}
</script>
