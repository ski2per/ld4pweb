<template>
  <v-data-table
    :headers="headers"
    :items="allMaillists"
    :search="search"
    sort-by="uid"
    class="elevation-1"
    dense
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
      <!--
        <v-toolbar-title>LDAP Maillists</v-toolbar-title>
        <v-divider class="mx-4" inset vertical ></v-divider>
      -->

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

    <!-- Use Dynamic Slot Names to setup header -->
    <template v-for="(h, index) in headers" v-slot:[`header.${h.value}`]>
      <span class="green-text" :key="index">{{h.text}}</span>
    </template>
    <template v-slot:item="{item}">
      <tr>
        <ml-td :maillist="item"></ml-td>
        <td>{{item.mail}}</td>
        <td>
          <ml-action :maillist="item"
          v-on:delete="handleDeleteEvent($event)"
          v-on:edit="handleEditEvent($event)"
          ></ml-action>
        </td>
      </tr>
    </template>

    <template v-slot:no-data>
      No Data 🤷
    </template>

  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'
import MLTd from '@/components/maillist/MLTd.vue'
import MLActionBtn from '@/components/maillist/MLActionBtn.vue'
import MLEditDialog from '@/components/maillist/MLEditDialog.vue'
import MLDeleteDialog from '@/components/maillist/MLDeleteDialog.vue'

export default {
  name: 'MList',
  components: {
    'ml-td': MLTd,
    'ml-action': MLActionBtn,
    'ml-edit-dialog': MLEditDialog,
    'ml-delete-dialog': MLDeleteDialog,
  },
  data () {
    return {
      valid: true,  
      search: '',
      headers: [
        { text: "邮件列表", value: "cn"},
        { text: "Email", value: "mail", sortable: false},
        { text: "操作", value: "action", sortable: false, align: 'left'},
      ],
    }
  }, //data()
  computed: {
    ...mapGetters({
      allMaillists: 'mlst/allMaillists',
    })
    // allMaillists: function() {
    //   return this.$store.getters['mlst/allMaillists']
    // }
  },
  methods: {
    handleCreate() {
      this.$refs.editDialog.editedItem = {}
      this.$refs.editDialog.dialog = true
    },
    handleEditEvent(item) {
      const editedItem = {
        cn: item.cn,
        mail: item.mail,
      }
      this.$refs.editDialog.editedItem = editedItem
      this.$refs.editDialog.dialog = true
      this.$refs.editDialog.edited = true
      this.$refs.editDialog.lastCN = item.cn
    },
    handleDeleteEvent(item) {
      this.$refs.deleteDialog.maillist= item
      this.$refs.deleteDialog.dialog = true
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