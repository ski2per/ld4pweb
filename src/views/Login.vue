<template>
<v-container fluid class="pa-0 ml-0 fill-height" style="display:-webkit-box;">
  <!--
    Use 'no-gutters' to remove negative margin,
    or there will be a tricky space on the right
  -->
  <v-row align="center" justify="center" no-gutters="">

    <v-col>
      <v-row class="elevation-4" > 
        <v-col class="hidden-xs-only">
          <v-row justify="end">
              <v-img src="../assets/logo.png"
                max-width="200"
                max-height="250"
              ></v-img>
          </v-row>
        </v-col>

        <!-- Desktop -->
        <v-col class="green darken-1 hidden-xs-only">
          <v-chip class="my-2" color="white" outlined label >
            <v-icon left>mdi-contact-mail-outline</v-icon>
            统一账号管理系统 - {{version}}
          </v-chip>

          <v-row>
            <v-col cols="4">
              <v-row justify="start" class="pl-2">
                <login-form />
              </v-row>
            </v-col>
          </v-row>
        </v-col>

        <!-- Mobile -->
        <v-col class="green darken-1 hidden-sm-and-up">
          <v-container>
            <v-chip class="my-2" color="white" outlined label >
              <v-icon left>mdi-contact-mail-outline</v-icon>
              统一账号管理系统 - {{version}}
            </v-chip>
            <v-row justify="start">
              <login-form />
            </v-row>
          </v-container>
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
    data() {
      return {
        version: process.env.VUE_APP_VERSION,
      }
    },
    components: {
      'login-form': LoginForm,
    }
  }
</script>

<style scoped>
</style>