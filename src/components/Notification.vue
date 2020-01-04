<template>
  <v-snackbar
    v-model="this.$store.getters.showNoti"
    :bottom="y === 'bottom'"
    :color="color"
    :left="x === 'left'"
    :multi-line="mode === 'multi-line'"
    :right="x === 'right'"
    :timeout="timeout"
    :top="y === 'top'"
    :vertical="mode === 'vertical'"
  >
    {{ info }}
    <v-btn dark text @click="dismiss" >
      <v-icon>mdi-cancel</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
  export default {
    data () {
      return {
        // color: 'error',
        mode: '',
        timeout: 3600,
        x: 'right',
        y: 'top',
      }
    },
    computed: {
      // snackbar: {
      //   get () { return this.$store.getters.isInfo},
      //   set (value) {
      //     this.$store.dispatch('notify', { msg: "", color: "error" })
      //   }
      // },
      info: function () {
        return this.$store.getters.getInfo
      },
      color: function () {
        return this.$store.getters.getInfoColor
      }
    },
    methods: {
      dismiss: function() {
        this.$store.dispatch('notify', { msg: "", color: "error" })
      }
    },
  }
  </script>