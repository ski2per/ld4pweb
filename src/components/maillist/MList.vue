<template>
  <v-data-table
    :headers="headers"
    :items="this.$store.state.lm.maillists"
    :search="search"
    sort-by="uid"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>LDAP Maillists</v-toolbar-title>

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

        <!--邮件列表创建按钮-->
        <v-btn small color="green" fab dark @click="handleCreate">
          <v-icon>mdi-email-plus </v-icon>
        </v-btn>
        <!--创建/编辑用户对话框-->
        <ml-edit-dialog ref="editDialog"></ml-edit-dialog>

        <ml-delete-dialog ref="deleteDialog"></ml-delete-dialog>

      </v-toolbar>
    </template>

    <!--操作按钮
      v-slot:item.action中的"action"对应headers数组对象中，
      操作这一列的"value"(参考VuetifyJS v-table API slots: item.<name>)
    -->
    <template v-slot:item.action="{ item }">
      <ml-action :maillist="item"
      v-on:delete="handleDeleteEvent($event)"
      v-on:edit="handleEditEvent($event)"
      ></ml-action>
    </template>

    <template v-slot:no-data>
      No data : P
    </template>

  </v-data-table>
</template>

<script>
import MLActionBtn from '@/components/maillist/MLActionBtn.vue'
import MLEditDialog from '@/components/maillist/MLEditDialog.vue'
import MLDeleteDialog from '@/components/maillist/MLDeleteDialog.vue'

export default {
  name: 'MList',
  components: {
    'ml-action': MLActionBtn,
    'ml-edit-dialog': MLEditDialog,
    'ml-delete-dialog': MLDeleteDialog,
  },
  data () {
    return {
      valid: true,  
      // users: [],
      search: '',
      headers: [
        { text: "邮件列表", value: "cn"},
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
      this.$refs.deleteDialog.maillist= item
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
