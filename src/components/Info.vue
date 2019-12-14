<template>
  <v-snackbar
    v-model="snackbar"
    :bottom="y === 'bottom'"
    :color="color"
    :left="x === 'left'"
    :multi-line="mode === 'multi-line'"
    :right="x === 'right'"
    :timeout="timeout"
    :top="y === 'top'"
    :vertical="mode === 'vertical'"
  >
    {{ text }}
    <v-btn
      dark
      text
      @click="snackbar = false"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
  export default {
    data () {
      return {
        color: '',
        mode: '',
        snackbar: false,
        text: 'Hello, I\'m a snackbar',
        timeout: 1500,
        x: null,
        y: 'top',
      }
    },
  }
  </script>