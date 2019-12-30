<template>
  <v-container justify="start">
    <mail-list></mail-list>
  </v-container>
</template>

<script>
import MList from '@/components/maillist/MList.vue'

export default {
  name: 'MList',
  components: {
    'mail-list': MList
  }
}
</script>