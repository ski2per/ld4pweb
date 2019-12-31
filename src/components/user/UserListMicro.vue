<template>
  <v-container>
    <h3>当前邮件组用户</h3>
  </v-container>

</template>

<script>

export default {
  name: 'UserListMicro',
  data () {
    return {
      valid: true,  
      selectedUsers: [],
      search: '',
      headers: [
        //注意' d-none'前面有空格
        {value: "uid", align: ' d-none'},
        {value: "cn", align: "left"},
      ],
    }
  }, //data()
  created() {
  },
  methods: {
    selectItem(selectedList) {
      // 向MLEditDialog发送selected事件，并传递当前选中用户列表
      this.$emit('selected', selectedList)
    },
  }, //method()
}
</script>
