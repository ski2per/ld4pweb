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
            <v-form ref="userForm">
              <v-col>
                <v-text-field v-model="editedItem.cn" label="Name(建议中文名)"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="editedItem.uid" label="UserID(中文全拼)" :disabled="edited"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col v-if="edited">
                <v-text-field v-model="editedItem.mail" label="Email" disabled></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="editedItem.sn" label="姓(Surname)"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="editedItem.givenName" label="名(Given name)"></v-text-field>
              </v-col>
            </v-form>
          </v-col>

          <!--Group selectedGroup(right)-->
          <v-col v-if="!edited">
            选择用户组:
            <v-divider></v-divider>
            <v-treeview
              v-model="selectedGroup"
              selectedGroup-type="leaf"
              :items="this.$store.state.lg.groupTree"
              item-disabled="locked"
              selectable
              return-object
            ></v-treeview>
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
export default {
  data () {
    return {
      dialog: false,
      valid: true,  
      groups: [],
      selectedGroup: [],
      edited: false,
      editedItem: {
          uid: '',
          cn: '',
          mail: '',
          sn: '',
          givenName: '',
      },
      defaultItem: {
          uid: '',
          cn: '',
          mail: '',
          sn: '',
          givenName: '',
      },
      rules: {
        required: value => !!value || '不能为空',
      },
    }
  },
  computed: {
    dialogTitle() {
      return this.edited ? '编辑' : '创建用户'
    },
  },
  methods: {
    reset() {
      this.dialog = false
      this.edited = false
      this.editedItem = this.defaultItem
      this.selectedGroup = []
    },
    validate () {
      this.valid = false
      if(this.$refs.userForm.validate()) {
        if (this.edited) {
          console.log("[edit] TBD")
        } else {
          this.save()
        }
      }
      this.valid = true
    },
    save () {
      const data = {
        uid: this.editedItem.uid,
        chinese_name: this.editedItem.cn,
        surname: this.editedItem.sn,
        given_name: this.editedItem.givenName,
      }
      const info = {msg: "", color: ""}

      if (this.edited) {
      } else {
        // Add new user
        this.$store.dispatch('lu/createUser', data)
        .then(response => {
          if(response && response.status == 200) {
            info.msg = response.data.detail
            info.color = "success"
            // Add new user to groups
            // (Only when adding user successfully)
            this.massiveAddToGroup(this.selectedGroup)

            // Reload users in vuex
            this.$store.dispatch('lu/loadUsers')
          } else {
            info.msg = "Unknown error"
            info.color = "error"
          }
          this.$store.dispatch('notify', info)
        })
        .catch(error => {
          info.color = "error"
          if (error.response) {
            info.msg = error.response.data.detail
          } else {
            info.msg = "Unknown server error"
          }
          this.$store.dispatch('notify', info)
        })
        .finally(() => {
          this.reset()
        })
      }

    }, //save()
    massiveAddToGroup (groupData) {
      console.log("[massiveAddToGroup()] heavy operation")
      // Need refactor
      groupData.forEach((item, index) => {
        // Think I will put sleep or something here ;P
        this.$store.dispatch('lg/add2Group', {pgroup: item.pgroup, group: item.name, uid: this.editedItem.uid})
        .then(response => {
          if(response && response.status == 200) {
            console.log(`Add ${this.editedItem.uid} to ${item.pgroup}/${item.name} success`)
          }
        })
        .catch(error => { console.log(error) })
      })

    }
  }//methods(),
}
</script>