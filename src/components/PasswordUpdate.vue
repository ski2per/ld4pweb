<template>
  <v-form 
    ref="passwordForm"
    @submit.prevent="validate"
    >
    <v-text-field
      v-model="oldPassword"
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[rules.required, rules.min]"
      :type="show ? 'text' : 'password'"
      name="input-password"
      label="旧密码"
      @click:append="show = !show"
      color="green"
    ></v-text-field>

    <v-text-field
      v-model="newPassword"
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[rules.required, rules.min]"
      :type="show ? 'text' : 'password'"
      name="input-password"
      label="新密码"
      @click:append="show = !show"
      color="green"
    ></v-text-field>

    <v-text-field
      v-model="newPasswordAgain"
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[rules.required, rules.min]"
      :type="show ? 'text' : 'password'"
      name="input-password"
      label="再来一次"
      @click:append="show = !show"
      color="green"
    ></v-text-field>

    <v-btn color="warning" type="submit" :disabled="!valid">修改密码</v-btn>
  </v-form>
</template>

<script>
  export default {
    data () {
      return {
        valid: true,
        show: false,
        oldPassword : "",
        newPassword : "",
        newPasswordAgain : "",
        username: "",
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 1 || 'Min 1 characters',
          emailMatch: () => ('The email and password you entered don\'t match'),
        }
      }
    }, //data()
    methods: {
      validate () {
        this.valid = false
        if(this.$refs.passwordForm.validate()) {
          console.log("Form ok, gonna change psd")
        }
        this.valid = true
      },
    },
  } //export default
</script>