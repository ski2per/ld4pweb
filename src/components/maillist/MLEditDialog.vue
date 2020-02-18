<template>
<v-dialog v-model="dialog" persistent max-width="800px">

  <v-card>
    <v-card-title>
      {{ dialogTitle }}
    </v-card-title>
    <v-card-subtitle v-if="edited" style="color: green;">
      {{editedItem.mail}}
    </v-card-subtitle>

    <v-card-text>
      <v-container>
        <v-row v-if="!edited">
          <v-col>
            <v-form ref="maillistForm">
              <v-text-field v-model="editedItem.cn" label="邮件列表名(建议中文)"
              ></v-text-field>
              <v-text-field v-model="editedItem.mail" label="邮件列表地址(不用输入@域名)" 
                v-if="!edited" :rules="[rules.required]"
              ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <userlist-mini ref="userMini"
              v-on:selected="handleSelectedEvent($event)"
            ></userlist-mini>
          </v-col>
          <v-col>
            <template v-if="!selected.length">
              <h4>选择加入邮件列表的用户</h4>
            </template>
            <template v-else>
              <div v-for="item in selected" :key="item.uid">
                {{ item.cn}}
              </div>
            </template>
          </v-col>
          <v-col v-if="edited">
              <userlist-micro ref="userMicro"
                :maillist="editedItem.mail"
              ></userlist-micro>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green darken-1" text @click="reset" :disabled="!valid">Cancel</v-btn>
      <v-btn color="green darken-1" text @click="validate">OK</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

</template>

<script>
import UserListMini from '@/components/user/UserListMini.vue'
import UserListMicro from '@/components/user/UserListMicro.vue'

export default {
  components: {
    'userlist-mini': UserListMini,
    'userlist-micro': UserListMicro
  },
  data () {
    return {
      notification: {
        msg: '',
        color: '',
      },
      dialog: false,
      valid: true,
      edited: false,
      selected: [],
      //Record last cn，invoke maillist update API when value changing
      lastCN: "",
      editedItem: {
        // cn: '',
        mail: '',
      },
      defaultItem: {
        // cn: '',
        mail: '',
      },
      rules: {
        required: value => !!value || '不能为空',
      },
    }
  },
  computed: {
    dialogTitle() {
      return this.edited ? '编辑邮件列表' : '创建邮件列表'
    },
  },
  methods: {
    handleSelectedEvent(data) {
      this.selected = data
    },
    filterList(li) {
      // Create a new
      let newArr = []
      li.forEach((item, index) => {
        newArr[index] = item.cn
      })
      return newArr
    },
    reset () {
      this.dialog = false
      this.edited = false
      this.editedItem = this.defaultItem
      this.selected = []
      this.$refs.userMini.selectedUsers = []
      this.notification= {msg: "", color: ""}
    },
    validate () {
      this.valid = false
      if(this.edited) {
        this.modify()
      } else {
        if(this.$refs.maillistForm.validate()) {
          this.create()
        }
      }
      this.valid = true
    },
    modify () {
      const mlMember = this.filterList(this.$refs.userMicro.members)
      const maillistName = this.editedItem.mail.split('@')[0]

      if(this.selected.length) {
        // Update maillist member
        let members = []
        this.selected.forEach((item, index) => {
          // 过滤掉重复选择的用户
          if (mlMember.indexOf(item.cn) == -1) {
            members.push(item)
          }
        })//forEach
        this.$store.dispatch('mlst/addUser2Maillist', {maillist: maillistName, members: members})
      }
      this.reset()
    },
    create () {
      const data = {
        cn: this.editedItem.cn,
        mail: this.editedItem.mail,
        members: this.selected,
      }
      // Add new maillist
      this.$store.dispatch('mlst/createMaillist', data)
      this.reset()
    }, 
  }//methods(),
}
</script>
