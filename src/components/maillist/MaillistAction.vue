<template>
<v-container>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-icon v-on="on" medium class="mr-2" @click="editItem">
        mdi-email-edit
      </v-icon>
    </template>
    <span>编辑</span>
  </v-tooltip>

  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-icon v-on="on" medium class="mr-2" @click="deleteItem">
        mdi-email-minus
      </v-icon>
    </template>
    <span>删除</span>
  </v-tooltip>

  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-icon medium class="mr-2" v-on="on" @click="addUser">
        mdi-account-edit
      </v-icon>
    </template>
    <span>增/删用户</span>
  </v-tooltip>

</v-container>
</template>

<script>
export default {
  props: {
    user: Object,
  },
  methods: {
    addUser () {
      console.log("TBD")
    },
    editItem() {
      // 向父级发送edit事件，同时传递user对象
      // this.$emit('edit', this.user)
    },
    deleteItem() {
      // 向父级发送delete事件，同时传递user对象
      // this.$emit('delete', this.user)
    },
  },

}
</script>