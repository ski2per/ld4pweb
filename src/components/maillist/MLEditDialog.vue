<template>
<v-dialog v-model="dialog" persistent max-width="600px">

  <v-card>
    <v-card-title>
      <span class="headline">{{ dialogTitle }}</span>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <!--User info(left)-->
          <v-col>
            <v-form ref="maillistForm">
              <v-col>
                <v-text-field v-model="editedItem.cn" label="邮件列表名(建议中文)"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="editedItem.mail" label="邮件列表地址(不用输入@域名)" 
                  v-if="!edited" :rules="[rules.required]"
                ></v-text-field>
                <v-text-field v-model="editedItem.mail" label="邮件列表地址" v-if="edited" :disabled="edited"
                ></v-text-field>
              </v-col>
            </v-form>
          </v-col>
          <!--Only visible in edit mode-->
          <v-col v-if="edited">
            <userlist-micro ref="userMicro"
              :maillist="this.editedItem.mail"
            ></userlist-micro>
          </v-col>
        </v-row>
        <!--User Addition-->
        <v-row>
          <v-col>
          <userlist-mini ref="userMini"
            v-on:selected="handleSelectedEvent($event)"
          ></userlist-mini>
          </v-col>
          <v-col>
            <template v-if="!selected.length">
              <h4>从左侧选择要加入邮件列表的用户</h4>
            </template>
            <template v-else>
              <div v-for="item in selected" :key="item.uid">
                {{ item.cn}}
              </div>
            </template>
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
      //Record old cn，invoke maillist update API when value changing
      lastCN: "",
      editedItem: {
        cn: '',
        mail: '',
      },
      defaultItem: {
        cn: '',
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
      if(this.$refs.maillistForm.validate()) {
        if (this.edited) {
          this.modify()
        } else {
          this.create()
        }
      }
      this.valid = true
    },
    modify () {
      const mlMember = this.filterList(this.$refs.userMicro.members)
      const maillistName = this.editedItem.mail.split('@')[0]

      // NEED optimize later
      console.log(this.lastCN)
      console.log(this.editedItem.cn)
      console.log(this.selected)
      if((this.lastCN == this.editedItem.cn) && (! this.selected.length)) {
        console.log("no change")
        this.reset()
      } else {
        // Detect whether cn value changed
        if(this.lastCN != this.editedItem.cn) {
          this.$store.dispatch('mlst/updateMaillist', {maillist: maillistName, cn: this.editedItem.cn})
          this.reset()
        }

        if (this.selected.length) {
          // Update maillist member
          console.log(this.selectd)
          console.log(mlMember)
          this.selected.forEach((item, index) => {
            if (mlMember.indexOf(item.cn) == -1) {
              this.$store.dispatch('mlst/addUser2Maillist', {maillist: maillistName, uid: item.uid})
              .then(response => {
                if(response && response.status == 200) {
                  this.notification.msg = `${maillistName} updated`
                  this.notification.color = "success"
                  console.log(`Add ${item.uid} to ${maillistName} success`)
                }
              })
              .catch(error => { console.log(error) })
              .finally(() => {
                this.$store.dispatch('notify', this.notification)
                this.reset()
              })
            }
          })//forEach
        } else {
          this.reset()
        }
      }
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