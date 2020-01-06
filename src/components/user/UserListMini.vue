<template>
  <v-data-table
    v-model="selectedUsers"
    :headers="headers"
    :items="this.$store.state.usr.users"
    :search="search"
    sort-by="uid"
    item-key="cn"
    dense
    show-select
    hide-default-header
    class="elevation-1"
    :items-per-page="6"
    :footer-props="{
      'disable-items-per-page': true,
    }"
    @input="selectItem"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          append-icon="mdi-search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

        <v-spacer></v-spacer>

      </v-toolbar>
    </template>

    <!--操作按钮
      v-slot:item.action跟的"action"对应headers数组对象中，
      操作这一列的value
    -->

    <template v-slot:no-data>
      No data : P
    </template>

  </v-data-table>
</template>

<script>

export default {
  name: 'UserListMini',
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
  methods: {
    selectItem(selectedList) {
      // 向MLEditDialog发送selected事件，并传递当前选中用户列表
      this.$emit('selected', selectedList)
    },
  }, //method()
}
</script>
