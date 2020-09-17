<template>
  <v-snackbar
    v-model="snackbar"
    :bottom="y === 'bottom'"
    :color="myColor"
    :left="x === 'left'"
    :right="x === 'right'"
    :timeout="timeout"
    :top="y === 'top'"
  >
    {{ myText }}
    <template v-slot:action="{ attrs }">
      <v-btn dark text
        @click="dismiss"
        v-bind="attrs">
        <v-icon>mdi-cancel</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
  export default {
    data () {
      return {
        timeout: 3000,
        x: 'right',
        y: 'top',
      }
    },
    computed: {
      snackbar: {
        get: function() { return this.$store.getters.showNoti},
        set: function(value) {
          this.$store.dispatch('notify', { msg: "", color: "" })
        }
      },
      myText: function () {
        return this.$store.getters. getNotiText
      },
      myColor: function () {
        return this.$store.getters.getNotiColor
      }
    },
    methods: {
      dismiss: function() {
        this.$store.dispatch('notify', { msg: "", color: "" })
      }
    },
  }
  </script>