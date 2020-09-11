<template>
  <v-data-table
    :mobile-breakpoint="120"
    v-model="selectedUsers"
    :headers="headers"
    :items="users"
    :search="search"
    :loading="loading"
    loading-text="Loading..."
    sort-by="uid"
    item-key="cn"
    dense
    show-select
    hide-default-header
    class="elevation-1"
    :items-per-page="noPerPage"
    :footer-props="{
      itemsPerPageText: '',
      disableItemsPerPage: true
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
      loading: false,
      valid: true,  
      selectedUsers: [],
      search: '',
      headers: [
        //注意' d-none'前面有空格
        {value: "cn", align: "left"},
        {value: "uid", align: ' d-none'},
      ],
    }
  }, //data()
  props: {
    noPerPage: Number,
  },
  computed: {
    users: function() {
      return this.$store.state.usr.users
    }
  },
  created() {
    if(!this.users.length) {
      this.loading = true
      this.$store.dispatch('usr/loadUsers')
      .then(response => {
        this.loading = false
      })
    }
  },
  methods: {
    selectItem(selectedList) {
      // 向MLEditDialog发送selected事件，并传递当前选中用户列表
      this.$emit('selected', selectedList)
    },
  }, //method()
}
</script>
