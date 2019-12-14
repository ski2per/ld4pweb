<template>
<v-container fluid class="pa-0 ml-0 fill-height" style="display:-webkit-box;">
  <v-row align="center" justify="center">

    <v-col cols="12">
      <v-row class="elevation-4" > 

        <v-col>
          <v-row justify="end">
              <v-img src="../assets/logo.png"
                max-width="200"
                max-height="250"
              ></v-img>
          </v-row>
        </v-col>

        <v-col class="green darken-1">
          <v-chip class="my-2" color="white" outlined label >
            <v-icon left>mdi-contact-mail-outline</v-icon>
            OpenLDAP Management
          </v-chip>
          <v-row justify="start" class="pl-2">
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
          </v-row>
        </v-col>

      </v-row><!--row with elevation-->
    </v-col>

  </v-row><!--row with 100% height-->
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
