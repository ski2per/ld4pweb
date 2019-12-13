<template>
  <v-container>
      <v-row> 
        <v-col class="grey">
          <v-row justify="end">
            <v-col cols="3">
              <v-img
                src="../assets/logo.png"
                aspect-radio="1"
                width="50%"
              ></v-img>
            </v-col>
          </v-row>
        </v-col>

        <v-col class="light-green">
          <v-row justify="start">
            <v-col cols="3">
              <v-form @submit.prevent="login">
                <v-text-field
                  v-model="username"
                  :rules="[rules.required]"
                  label="Username"
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min]"
                  :type="show ? 'text' : 'password'"
                  name="input-password"
                  label="Password"
                  hint="At least 1 characters"
                  @click:append="show = !show"
                ></v-text-field>

                <v-btn color="success" type="submit">Login</v-btn>
              </v-form>
            </v-col>
        </v-row>

        </v-col>

      </v-row>
  </v-container>
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
        console.log('[Login.vue]')
        for (var key of params.entries()) {
			    console.log(key[0] + ', ' + key[1])
		    }
        //debug

        this.$store.dispatch('login', params)
       .then(() => this.$router.push('/'))
       .catch(err => console.log(err))
      }
    }
  }
</script>
