<template>
  <v-data-table
    ref="ul"
    :headers="headers"
    :items="users"
    :search="search"
    sort-by="uid"
    :loading="loading"
    loading-text="Loading..."
    :footer-props="{
      itemsPerPageText: '每页',
      showFirstLastPage: true,
      firstIcon: 'mdi-skip-previous',
      lastIcon: 'mdi-skip-next',
      prevIcon: 'mdi-arrow-left-bold',
      nextIcon: 'mdi-arrow-right-bold'
    }"
  >
    <!--Table top-->
    <template v-slot:top>
      <v-toolbar flat color="white">
        <!--Filter User-->
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-switch v-on="on" v-model="realUsers" class="mt-6" color="orange"></v-switch>
          </template>
          <span>隐藏/显示功能账号</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" @click="syncUser" class='mx-2' color="green">
              mdi-sync
            </v-icon>
          </template>
          <span>同步全员</span>
        </v-tooltip>

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
        <user-action-dialog ref="actionDialog"></user-action-dialog>

      </v-toolbar>
    </template>

    <!-- Use Dynamic Slot Names to setup header -->
    <template v-for="(h,idx) in headers" v-slot:[`header.${h.value}`]>
      <span class="green-text" :key="idx">{{h.text}}</span>
    </template>

    <!--
      "item"为v-slot:item中的属性，
      貌似必须为"item"
    -->
    <template v-slot:item="{item}">
      <tr>
        <uid-td :user="item"></uid-td>
        <td>{{item.cn}}</td>
        <td>{{item.mail}}</td>
        <td>
          <user-list-action :user="item"
          v-on:delete="handleDeleteEvent($event)"
          v-on:edit="handleEditEvent($event)"
          v-on:lock="handleLockEvent($event)"
          v-on:reset="handleResetPsdEvent($event)"
          ></user-list-action>
        </td>
      </tr>
    </template>

    <!--操作按钮
      v-slot:item.action中的"action"对应headers数组对象中，
      操作这一列的"value"(参考VuetifyJS v-table API slots: item.<name>)
    -->
    <!-- <template v-slot:item.action="{ item }">
      <user-list-action :user="item"
      v-on:delete="handleDeleteEvent($event)"
      v-on:edit="handleEditEvent($event)"
      v-on:lock="handleLockEvent($event)"
      v-on:reset="handleResetPsdEvent($event)"
      ></user-list-action>
    </template> -->


    <template v-slot:no-data>
      No Data ☕
    </template>

  </v-data-table>

</template>

<script>
import UidTd from '@/components/user/UidTd.vue'
import UserListActionBtn from '@/components/user/UserListActionBtn.vue'
import UserEditDialog from '@/components/user/UserEditDialog.vue'
import UserActionDialog from '@/components/user/UserActionDialog.vue'

export default {
  name: 'UserList',
  components: {
    'user-list-action': UserListActionBtn,
    'user-edit-dialog': UserEditDialog,
    'user-action-dialog': UserActionDialog,
    'uid-td': UidTd,
  },
  data () {
    return {
      realUsers: true,
      valid: true,  
      loading: false,
      search: '',
      headers: [
        {
            text: "User ID",
            align: "left",
            sortable: true,
            value: "uid",
        },
        { text: "姓名", value: "cn"},
        { text: "Email", value: "mail", sortable: false},
        { text: "操作", value: "action", sortable: false, align: 'left'},
      ],
    }
  }, //data()
  computed: {
    users: function() {
      return this.$store.getters['usr/allUsers'](this.realUsers)
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
    syncUser() {
      this.$store.dispatch('usr/syncUsers')
    },
    handleCreate() {
      // this.$refs.editDialog.editedItem = {}
      this.$refs.editDialog.dialog = true
    },
    handleEditEvent(item) {
      let isAdmin = false
      if(item.domainGlobalAdmin && item.domainGlobalAdmin == 'yes') {
        isAdmin = true
      }
      const editedItem = {
        uid: item.uid,
        cn: item.cn,
        mail: item.mail,
        sn: item.sn,
        givenName: item.givenName,
        admin: isAdmin
      }
      this.$refs.editDialog.editedItem = editedItem
      this.$refs.editDialog.edited = true
      this.$refs.editDialog.dialog = true
    },
    handleDeleteEvent(item) {
      this.$refs.actionDialog.action = "delete"
      this.$refs.actionDialog.user= item
      this.$refs.actionDialog.dialog = true
    },
    handleLockEvent(item) {
      if(item.accountStatus == "active") {
        this.$refs.actionDialog.action = "lock"
      } else {
        this.$refs.actionDialog.action = "unlock"
      }
      this.$refs.actionDialog.user = item
      this.$refs.actionDialog.dialog = true
    },
    handleResetPsdEvent(item) {
      this.$refs.actionDialog.action = "reset"
      this.$refs.actionDialog.user = item
      this.$refs.actionDialog.dialog = true
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

<style scoped>
.green-text {
  color: green;
  font-size: 16px;
}
</style>