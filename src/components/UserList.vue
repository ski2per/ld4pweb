<template>
  <v-data-table
    :headers="headers"
    :items="this.$store.state.ldapusers.users"
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
        <user-edit-dialog ref="editDialog"
        v-on:init-user="handleInitEvent"
        ></user-edit-dialog>

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
import UserListAction from '@/components/UserListAction.vue'
import UserEditDialog from '@/components/UserEditDialog.vue'
import UserDeleteDialog from '@/components/UserDeleteDialog.vue'

export default {
  name: 'UserList',
  components: {
    'user-list-action': UserListAction,
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
    handleInitEvent() {
      this.initializeUsers()
    },
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
    initializeUsers() {
      console.log("[initializeUsers()]")
      // this.$store.dispatch()
      // this.$store.dispatch('getUsers')
      // .then(response => {
      //   this.users = response.data
      // })
      // .catch(error => {
      //   console.log(error)
      //   if (error.response && error.response.status == 401) {
      //     this.$store.dispatch("logout")
      //     this.$router.push("/login")
      //   }
      // })
    },// initializeUsers()

    close () {
      this.dialog = false
      this.dialogDelete = false
      this.edited = false
      this.selectedGroup = []
    },
    save () {
      const params = new FormData()

      const data = {
        uid: this.editedItem.uid,
        chinese_name: this.editedItem.cn,
        surname: this.editedItem.sn,
        given_name: this.editedItem.givenName,
      }
      const info = {msg: "", color: ""}

      if (this.edited) {
        console.log("[edit] TBD")
      } else {
        // Add new user
        this.$store.dispatch('createUser', data)
        .then(response => {
          if(response && response.status == 200) {
            info.msg = response.data.detail
            info.color = "success"
            // Add new user to groups
            // (Only when adding user successfully)
            this.massiveAddToGroup(this.selectedGroup)

            // init users, consider using vuex later
            this.initializeUsers()
          } else {
            console.log(response)
            info.msg = "Unknown error"
            info.color = "error"
          }
          this.$store.dispatch('showInfo', info)
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
        .finally(() => {
          this.dialog = false
          this.editedItem = this.defaultItem
          this.selectedGroup = []
        })
      }

    }, //save()
    massiveAddToGroup (groupData) {
      console.log(`groupData: ${groupData}`)
      console.log("[massiveAddToGroup()]")
      // Need refactor
      groupData.forEach((item, index) => {
        // Think I will put sleep or something here ;P
        this.$store.dispatch('add2Group', {pgroup: item.pgroup, group: item.name, uid: this.editedItem.uid})
        .then(response => {
          if(response && response.status == 200) {
            console.log(`Add ${this.editedItem.uid} to ${item.pgroup}/${item.name} success`)
          }
        })
        .catch(error => {
          console.log(error)
        })
      })

    }

  }, //method()
}
</script>
