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
      :rules="[rules.required, rules.min, rules.passwordMatchRule]"
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
          passwordMatchRule: () => (this.newPassword === this.newPasswordAgain) || '两次密码不匹配'
        }
      }
    }, //data()
    // computed: {
        // passwordMatchRule() {
            // return () => (this.newPassword === this.newPasswordAgain) || '两次密码不匹配'
        // }
    // },
    methods: {
      validate () {
        this.valid = false
        if(this.$refs.passwordForm.validate()) {
          this.updatePassword()
        }
        this.valid = true
      },
      updatePassword () {
        const info = { msg: "", color: "" } 
        const psd = {
          old_password: this.oldPassword,
          new_password: this.newPassword
        }
        this.$store.dispatch('user/updatePassword', psd)
        .then(response => {
          if(response && response.status == 200) {
            console.log(response.data)
            info.msg = response.data.detail
            info.color = "success"
            } else {
              info.msg = response.data.detail
              info.color = "error"
          }
          this.$store.dispatch("showInfo", info)
        })
        .catch(error => {
          info.color = "error"
          if (error.response) {
            info.msg = error.response.data.detail
          } else {
            info.msg = "Unknown server error"
          }
          this.$store.dispatch('showInfo', info)
        })
      },
    },
  } //export default
</script>