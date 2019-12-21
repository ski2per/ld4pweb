<template>
  <v-form 
    ref="loginForm"
    @submit.prevent="validate"
    >
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

    <v-btn color="warning" type="submit" :disabled="!valid">Login</v-btn>
    <!--<v-btn color="warning" @click="validate" :disabled="!valid">Login</v-btn>-->
  </v-form>
</template>

<script>
  export default {
    data(){
      return {
        valid : true,
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
      validate () {
        this.valid = false
        if(this.$refs.loginForm.validate()) {
          this.login()
        }
        this.valid = true
      }, 
      login: function () {
        let username = this.username
        let password = this.password
        // const params = new URLSearchParams()
        const params = new FormData()
        params.append('username', username)
        params.append('password', password)

        this.$store.dispatch('login', params)
       .then(() => this.$router.push('/user'))
       .catch(err => {
         console.log(err)
         if(err) {console.log(err.response.data)}
       })
      }
    }
  }
</script>