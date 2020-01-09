<template>
<v-container class="px-0">
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-icon v-on="on" medium class="mr-2" @click="editUser">
        mdi-account-edit
      </v-icon>
    </template>
    <span>编辑用户</span>
  </v-tooltip>

  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-icon v-on="on" medium class="mr-2" @click="deleteUser">
        mdi-account-minus
      </v-icon>
    </template>
    <span>删除用户</span>
  </v-tooltip>

  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-icon medium class="mr-2" v-on="on" @click="lockUser">
        mdi-account-off
      </v-icon>
    </template>
    <span>锁定/解锁用户</span>
  </v-tooltip>

  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-icon medium class="mr-2" v-on="on" @click="resetPassword">
        mdi-account-key
      </v-icon>
    </template>
    <span>重置密码</span>
  </v-tooltip>
</v-container>
</template>

<script>
export default {
  props: {
    user: Object,
  },
  methods: {
    lockUser () {
      console.log("TBD")
    },
    resetPassword () {
    },
    editUser() {
      // 向父级发送edit事件，同时传递user对象
      this.$emit('edit', this.user)
    },
    deleteUser() {
      // 向父级发送delete事件，同时传递user对象
      this.$emit('delete', this.user)
    },
  },

}
</script>