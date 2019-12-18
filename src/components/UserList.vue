<template>
  <v-data-table
    :headers="headers"
    :items="users"
    :search="search"
    sort-by="uid"
    class="elevation-2"
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
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.givenName" label="名(Given name)"></v-text-field>
                    </v-col>
                  </v-col>

                  <!--Group selection(right)-->
                  <v-col v-if="!edited">
                    <v-treeview
                      v-model="selectedGroups"
                      selection-type="leaf"
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
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon medium class="mr-2"
        @click="editItem(item)"
      >
       mdi-account-edit
      </v-icon>
      <v-icon medium 
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>

    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize_users">Reload</v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'UserList',
  data () {
    return {
        selectedGroups: [],
        groups: [],
        search: '',
        users: [],
        headers: [
          {
              text: "User ID",
              align: "left",
              sortable: true,
              value: "uid"
          },
          { text: "姓名", value: "cn"},
          { text: "Email", value: "mail", sortable: false},
          { text: "Actions", value: "action", sortable: false},
        ],
        dialog: false,
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
  },
  created() {
    this.initialize_users()
    this.initialize_group_tree()
  },
  methods: {
    initialize_users() {
      this.$http.get(`${process.env.VUE_APP_API_URL}/api/v1/users/`)
      .then(response => {
        this.users = response.data
      })
      .catch(error => {
        console.log(error)
        if (error.response && error.response.status == 401) {
          this.$store.commit("logout")
          this.$router.push("/login")
        }
      })
    },// initialize_users()
    initialize_group_tree() {
      this.$http.get(`${process.env.VUE_APP_API_URL}/api/v1/groups/tree`)
      .then(response => {
        this.groups = response.data
      })
      .catch(error => {
        console.log(error)
        if (error.response && error.response.status == 401) {
          this.$store.commit("logout")
          this.$router.push("/login")
        }
      })
    },// initialize_group_tree()

    editItem (item) {
      this.edited = true
      this.editedItem = item
      this.dialog = true
    },

    deleteItem (item) {
      console.log("Delete TBD")
    },

    close () {
      this.dialog = false
      this.editedItem = this.defaultItem
      this.edited = false
      this.selectedGroups = []
    },
    save () {
      const params = new FormData()

      const data = {
        'chinese_name': this.editedItem.cn,
        'surname': this.editedItem.sn,
        'given_name': this.editedItem.givenName,
      }

      // Add new user
      this.$http.post(`${process.env.VUE_APP_API_URL}/api/v1/users/${this.editedItem.uid}`, data)
      .then(response => {
        const info = {"msg": "", "color": ""} 
        if(response && response.status == 200){
          info.msg = response.data.detail
          info.color = "success"
        } else {
          info.msg = "Unknown error"
          info.color = "error"
        }
        console.log(info)
        this.$store.dispatch('showInfo', info)
      })
      .catch(error => {
        const info = {"msg": "", "color": "error"} 
        if (error.response) {
          info.msg = response.data.detail
        } else {
          info.msg = "Unknown server error"
        }
        this.$store.dispatch('showInfo', info)
        console.log(error)
      })

      // Add new user to groups
      this.selectedGroups.forEach((item, index) => {
        // Think I will put sleep or something here ;P
        this.$http.put(`${process.env.VUE_APP_API_URL}/api/v1/groups/${item.pgroup}/${item.name}/${this.editedItem.uid}`)
        .then(response => {
          if(response && response.status == 200) {
            console.log(`Add ${this.editedItem.uid} to ${item.pgroup}/${item.name} success`)
          }
        })
        .catch(error => {
          console.log(error)
        })
      })

      this.dialog = false
      this.editedItem = this.defaultItem
      this.selectedGroups = []
    },

  }, //method()
}
</script>
