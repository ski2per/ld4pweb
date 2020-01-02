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
            统一账号管理系统
          </v-chip>
          <v-row justify="start" class="pl-2">
            <login-form />
          </v-row>
        </v-col>

      </v-row><!--row with elevation-->
    </v-col>
  </v-row><!--row with 100% height-->

</v-container>
</template>

<script>
  import LoginForm from "@/components/LoginForm.vue"

  export default {
    name: "Login",
    components: {
      'login-form': LoginForm,
    }
  }
</script>