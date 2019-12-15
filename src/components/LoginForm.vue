<template>
  <v-form @submit.prevent="login">
    <v-text-field
      v-model="username"
      :rules="[rules.required]"
      label="Username"
      color="white"
    ></v-text-field>

    <v-text-field
      v-model="password"
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[rules.required, rules.min]"
      :type="show ? 'text' : 'password'"
      name="input-password"
      label="Password"
      color="white"
      @click:append="show = !show"
    ></v-text-field>

    <v-btn color="warning" type="submit">Login</v-btn>
  </v-form>
</template>

<script>
  export default {
    data(){
      return {
        username: "",
        password : "",
        show: false,
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 1 || 'Min 1 characters',
          emailMatch: () => ('The email and password you entered don\'t match'),
        },
      }
    },
    methods: {
      login: function () {
        let username = this.username
        let password = this.password
        // const params = new URLSearchParams()
        const params = new FormData()
        params.append('username', username)
        params.append('password', password)

        //debug
        console.log('[LoginForm.vue]')
        for (var key of params.entries()) {
			    console.log(key[0] + ', ' + key[1])
		    }
        //debug

        this.$store.dispatch('login', params)
       .then(() => this.$router.push('/'))
      //  .catch(err => console.log(err))
       .catch(err => {
          var http_code = err.response.status
          if (http_code == 401) {
          // if (err.response.status == 401) {
            this.$store.dispatch('showInfo', "Wrong username or password")
          } else {
            this.$store.dispatch('showInfo', "Unknown error")
          }
       })
      }
    }
  }
</script>