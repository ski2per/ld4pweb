<template>
  <v-data-table
    :headers="headers"
    :items="this.$store.state.lu.users"
    :search="search"
    sort-by="uid"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>LDAP Users</v-toolbar-title>

        <v-divider class="mx-4" inset vertical ></v-divider>

        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          append-icon="mdi-search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

        <v-spacer></v-spacer>

        <!--创建用户按钮-->
        <v-btn small color="green" fab dark @click="handleCreate">
          <v-icon>mdi-account-plus </v-icon>
        </v-btn>
        <!--创建/编辑用户对话框-->
        <user-edit-dialog ref="editDialog"></user-edit-dialog>

        <user-delete-dialog ref="deleteDialog"></user-delete-dialog>

      </v-toolbar>
    </template>

    <!--操作按钮
      v-slot:item.action跟的"action"对应headers数组对象中，
      操作这一列的value
    -->
    <template v-slot:item.action="{ item }">
      <user-list-action :user="item"
      v-on:delete="handleDeleteEvent($event)"
      v-on:edit="handleEditEvent($event)"
      ></user-list-action>
    </template>

    <template v-slot:no-data>
      No data : P
    </template>

  </v-data-table>
</template>

<script>
import UserListActionBtn from '@/components/user/UserListActionBtn.vue'
import UserEditDialog from '@/components/user/UserEditDialog.vue'
import UserDeleteDialog from '@/components/user/UserDeleteDialog.vue'

export default {
  name: 'UserList',
  components: {
    'user-list-action': UserListActionBtn,
    'user-edit-dialog': UserEditDialog,
    'user-delete-dialog': UserDeleteDialog,
  },
  data () {
    return {
      valid: true,  
      users: [],
      search: '',
      headers: [
        {
            text: "User ID",
            align: "left",
            sortable: true,
            value: "uid"
        },
        { text: "姓名", value: "cn"},
        { text: "Email", value: "mail", sortable: false},
        { text: "操作", value: "action", sortable: false, align: 'center'},
      ],
    }
  }, //data()
  methods: {
    handleCreate() {
      this.$refs.editDialog.editedItem = {}
      this.$refs.editDialog.dialog = true
    },
    handleEditEvent(item) {
      const editedItem = {
        uid: item.uid,
        cn: item.cn,
        mail: item.mail,
        sn: item.sn,
        givenName: item.givenName,
      }
      this.$refs.editDialog.editedItem = editedItem
      this.$refs.editDialog.dialog = true
      this.$refs.editDialog.edited = true
    },
    handleDeleteEvent(item) {
      this.$refs.deleteDialog.user= item
      this.$refs.deleteDialog.dialog = true
    },
    close () {
      this.dialog = false
      this.dialogDelete = false
      this.edited = false
      this.selectedGroup = []
    },
  }, //method()
}
</script>
