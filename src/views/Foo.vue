<template>
  <v-container fluid>
        <v-row align="center" justify="center" style="height: 400px;" >
        <v-col cols="12">

        <v-row class="elevation-4" > 
          <v-col>
            <v-row justify="end">
                <v-img
                  src="../assets/logo.png"
                  max-width="200"
                  max-height="250"
                ></v-img>
            </v-row>
          </v-col>

          <v-col class="light-green">
            <v-row justify="start" class="pl-2">
                <v-form>
                  <v-text-field
                    v-model="username"
                    label="Username"
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    name="input-password"
                    label="Password"
                    hint="At least 1 characters"
                  ></v-text-field>

                  <v-btn color="success" type="submit">Login</v-btn>
                </v-form>
            </v-row>
          </v-col>
        </v-row>  

      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    data () {
      return {
        alignmentsAvailable: [
          'start',
          'center',
          'end',
          'baseline',
          'stretch',
        ],
        alignment: 'center',
        dense: false,
        justifyAvailable: [
          'start',
          'center',
          'end',
          'space-around',
          'space-between',
        ],
        justify: 'center',
      }
    },
  }
</script>