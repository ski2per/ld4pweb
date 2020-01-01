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
      dialog: false,
      valid: true,
      edited: false,
      selected: [],
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
  created() {
    console.log('[MLEditDialog.vue] created()')
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
      li.forEach((item, index, arr) => {
        arr[index] = item.cn
      })
      return li
    },
    reset () {
      this.dialog = false
      this.edited = false
      this.editedItem = this.defaultItem
      this.selected = []
      this.$refs.userMini.selectedUsers = []
    },
    validate () {
      this.valid = false
      if(this.$refs.maillistForm.validate()) {
        if (this.edited) {
          console.log("[edit] TBD")
          this.modify()
        } else {
          console.log("form valid, gonna create maillist")
          this.create()
        }
      }
      this.valid = true
    },
    modify () {
      const mlMember = this.filterList(this.$refs.userMicro.members)
      const maillistName = this.editedItem.mail.split('@')[0]
      this.selected.forEach((item, index) => {
        if (mlMember.indexOf(item.cn) == -1) {
          this.$store.dispatch('lm/addUser2Maillist', {maillist: maillistName, uid: item.uid})
          .then(response => {
            if(response && response.status == 200) {
              console.log(`Add ${item.uid} to ${maillistName} success`)
            }
          })
          .catch(error => { console.log(error) })
          .finally(() => {
            this.reset()
          })
        }
      })//forEach
      this.reset()
    },
    create () {
      const data = {
        cn: this.editedItem.cn,
        mail: this.editedItem.mail
      }
      const info = {msg: "", color: ""}

      // Add new maillist
      this.$store.dispatch('lm/createMaillist', data)
      .then(response => {
        if(response && response.status == 200) {
          info.msg = response.data.detail
          info.color = "success"
          // Add selected users to maillist
          // (Only when adding maillist successfully)
          this.massiveAdd2Maillist(this.selected)

          // Reload maillist
          this.$store.dispatch('lm/loadMaillists')
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
        this.reset()
      })
    }, //save()
    massiveAdd2Maillist (users) {
      console.log(`groupData: ${users}`)
      console.log("[massiveAdd2Maillist()]")
      // Need refactor
      users.forEach((item, index) => {
        console.log(item.uid)
        console.log(this.editedItem.mail)
        const currentML = this.editedItem.cn

        // Think I will put sleep or something here ;P
        this.$store.dispatch('lm/addUser2Maillist', {maillist: this.editedItem.mail, uid: item.uid})
        .then(response => {
          if(response && response.status == 200) {
            console.log(`Add ${item.uid} to ${currentML} success`)
          }
        })
        .catch(error => { console.log(error) })
      })
    }//massiveAdd2Maillist()
  }//methods(),
}
</script>