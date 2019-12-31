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
          Current users in maillist
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
              No item selected.
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

export default {
  components: {
    'userlist-mini': UserListMini
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
        required: value => !!value || 'Required.',
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
      console.log("bitch")
      console.log(data)
      this.selected = data
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
        } else {
          console.log("form valid, gonna create maillist")
          // console.log(this.$refs.userMini.selectedUsers)
          // this.save()
        }
      }
      this.valid = true
    },
    save () {
      const data = {
        cn: this.editedItem.cn,
        mail: this.editedItem.mail
      }
      const info = {msg: "", color: ""}

      if (this.edited) {
      } else {
        // Add new maillist
        this.$store.dispatch('lm/createMaillist', data)
        .then(response => {
          if(response && response.status == 200) {
            info.msg = response.data.detail
            info.color = "success"
    //         // Add new user to groups
    //         // (Only when adding user successfully)
    //         this.massiveAddToGroup(this.selectedGroup)

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
      }
    }, //save()
    // massiveAddToGroup (groupData) {
    //   console.log(`groupData: ${groupData}`)
    //   console.log("[massiveAddToGroup()]")
    //   // Need refactor
    //   groupData.forEach((item, index) => {
    //     // Think I will put sleep or something here ;P
    //     this.$store.dispatch('lg/add2Group', {pgroup: item.pgroup, group: item.name, uid: this.editedItem.uid})
    //     .then(response => {
    //       if(response && response.status == 200) {
    //         console.log(`Add ${this.editedItem.uid} to ${item.pgroup}/${item.name} success`)
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
    //   })

    // }
  }//methods(),
}
</script>