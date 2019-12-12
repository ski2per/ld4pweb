<template>
 <div>
   <form class="login" @submit.prevent="login">
     <h1>Login</h1>
     <label>Username</label>
     <input required v-model="username" placeholder="Username"/>
     <label>Password</label>
     <input required v-model="password" type="password" placeholder="Password"/>
     <hr/>
     <button type="submit">Login</button>
   </form>
 </div>
</template>

<script>
  export default {
    data(){
      return {
        username: "",
        password : ""
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
