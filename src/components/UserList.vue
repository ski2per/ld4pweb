<template>
  <v-data-table
    :headers="headers"
    :items="users"
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

        <!--Create/Edit dialog-->
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn small color="green" fab dark v-on="on">
              <v-icon>mdi-account-plus </v-icon>
            </v-btn>
          </template>

          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <!--User info(left)-->
                  <v-form ref="userForm">
                    <v-col>
                      <v-col cols="12">
                        <v-text-field v-model="editedItem.cn" label="Name(建议中文名)"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="editedItem.uid" label="UserID(中文全拼)" :disabled="edited"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" v-if="edited">
                        <v-text-field v-model="editedItem.mail" label="Email" disabled></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="editedItem.sn" label="姓(Surname)"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="editedItem.givenName" label="名(Given name)"></v-text-field>
                      </v-col>
                    </v-col>
                  </v-form>

                  <!--Group selectedGroup(right)-->
                  <v-col v-if="!edited">
                    选择用户组:
                    <v-divider></v-divider>
                    <v-treeview
                      v-model="selectedGroup"
                      selectedGroup-type="leaf"
                      :items="groups"
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
              <v-btn color="green darken-1" text @click="close" :disabled="!valid">Cancel</v-btn>
              <v-btn color="green darken-1" text @click="validate">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!--Delete dialog-->
        <v-dialog v-model="dialogDelete" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">Delete User ?</v-card-title>
            <v-card-text start="end">{{ user2delete }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="green darken-1" text @click="deleteItem">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on" medium class="mr-2" @click="editItem(item)">
            mdi-account-edit
          </v-icon>
        </template>
        <span>编辑用户</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on" medium class="mr-2" @click="deleteConfirm(item)">
            mdi-account-minus
          </v-icon>
        </template>
        <span>删除用户</span>
      </v-tooltip>
      <v-icon medium class="mr-2">
        mdi-account-off
      </v-icon>
      <v-icon medium class="mr-2">
        mdi-account-key
      </v-icon>
    </template>

    <template v-slot:no-data>
      No data : P
    </template>

  </v-data-table>
</template>

<script>
export default {
  name: 'UserList',
  data () {
    return {
      valid: true,  
      users: [],
      groups: [],
      search: '',
      selectedGroup: [],
      headers: [
        {
            text: "User ID",
            align: "left",
            sortable: true,
            value: "uid"
        },
        { text: "姓名", value: "cn"},
        { text: "Email", value: "mail", sortable: false},
        { text: "操作", value: "action", sortable: false},
      ],
      dialog: false,
      dialogDelete: false,
      edited: false,
      editedItem: {
          uid: '',
          cn: '',
          mail: '',
      },
      defaultItem: {
          uid: '',
          cn: '',
          mail: '',
      },
      rules: {
        required: value => !!value || 'Required.',
      },
    }
  }, //data()
  computed: {
    formTitle() {
      return this.edited ? '编辑' : '创建用户'
    },
    user2delete () {
      return this.editedItem.cn
    }
  },
  created() {
    this.initializeUsers()
    this.initializeGroupTree()
  },
  methods: {
    initializeUsers() {
      console.log("[initializeUsers()]")
      this.$store.dispatch('getUsers')
      .then(response => {
        this.users = response.data
      })
      .catch(error => {
        console.log(error)
        if (error.response && error.response.status == 401) {
          this.$store.dispatch("logout")
          this.$router.push("/login")
        }
      })
    },// initializeUsers()
    initializeGroupTree() {
      this.$store.dispatch('getGroupTree')
      .then(response => {
        this.groups = response.data
      })
      .catch(error => {
        console.log(error)
        if (error.response && error.response.status == 401) {
          this.$store.dispatch("logout")
          this.$router.push("/login")
        }
      })
    },// initializeGroupTree()
    validate () {
      this.valid = false
      if(this.$refs.userForm.validate()) {
        this.save()
      }
      this.valid = true
    },
    editItem(item) {
      this.edited = true
      this.editedItem = item
      this.dialog = true
    },
    deleteConfirm (item) {
      this.editedItem = item
      this.dialogDelete = true
    },
    deleteItem () {
      console.log(`will delete ${this.editedItem.cn}`)
      console.log(this.editedItem)
      const uid = this.editedItem.uid

      const info = { msg: "", color: "" } 
      this.$store.dispatch('deleteUser', uid)
      .then(response => {
        if(response && response.status == 200) {
          console.log(response.data)
          info.msg = response.data.detail
          info.color = "success"
          // init users, consider using vuex later
          this.initializeUsers()
        } else {
          info.msg = response.data.detail
          info.color = "error"
        }
        this.$store.dispatch("showInfo", info)
      })
      .catch(error => {
        // Also need to refactor
        info.color = "error"
        if (error.response) {
          info.msg = error.response.data.detail
        } else {
          info.msg = "Unknown server error"
        }
        this.$store.dispatch('showInfo', info)
      })
      .finally(() => {
        this.dialogDelete = false
        this.editedItem = this.defaultItem
      })
    },

    close () {
      this.dialog = false
      this.dialogDelete = false
      this.editedItem = this.defaultItem
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
